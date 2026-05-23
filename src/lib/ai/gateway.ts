// ============================================================
// AI GATEWAY LAYER — Rotación de keys, fallback, routing, cache
// ============================================================

import type { AIProvider, AIRequest, AIResponse } from "@/types"

// --- Key rotation ---
class KeyRotator {
  private keys: string[]
  private index = 0

  constructor(keys: string[]) {
    this.keys = keys.filter(Boolean)
  }

  next(): string {
    if (this.keys.length === 0) throw new Error("No API keys available")
    const key = this.keys[this.index]
    this.index = (this.index + 1) % this.keys.length
    return key
  }

  hasKeys(): boolean {
    return this.keys.length > 0
  }
}

// --- In-memory cache (reemplazar con Redis/Convex en producción) ---
const responseCache = new Map<string, { response: string; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hora

function getCached(key: string): string | null {
  const entry = responseCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    responseCache.delete(key)
    return null
  }
  return entry.response
}

function setCache(key: string, response: string): void {
  responseCache.set(key, { response, timestamp: Date.now() })
  // Limpiar cache si supera 500 entradas
  if (responseCache.size > 500) {
    const oldestKey = responseCache.keys().next().value
    if (oldestKey) responseCache.delete(oldestKey)
  }
}

// --- Routing inteligente por tarea ---
const TASK_ROUTING: Record<string, { provider: AIProvider; model: string }> = {
  copywriting: { provider: "groq", model: "llama-3.3-70b-versatile" },
  marketing:   { provider: "groq", model: "llama-3.3-70b-versatile" },
  branding:    { provider: "groq", model: "mixtral-8x7b-32768" },
  chat:        { provider: "groq", model: "llama-3.1-8b-instant" },
  image:       { provider: "pollinations", model: "flux" },
  banner:      { provider: "huggingface", model: "stabilityai/stable-diffusion-xl-base-1.0" },
}

// --- Groq client ---
async function callGroq(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content ?? ""
}

// --- Pollinations (imágenes gratuitas) ---
async function callPollinations(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&enhance=true`
  // Pollinations devuelve la URL directamente
  return url
}

// --- HuggingFace ---
async function callHuggingFace(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  )

  if (!response.ok) {
    throw new Error(`HuggingFace error: ${response.status}`)
  }

  // Para modelos de imagen, devuelve blob → convertir a base64
  const blob = await response.blob()
  const buffer = await blob.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  return `data:image/png;base64,${base64}`
}

// --- Fallback chain para texto ---
async function callWithFallback(
  prompt: string,
  groqRotator: KeyRotator,
  model = "llama-3.3-70b-versatile"
): Promise<{ content: string; provider: AIProvider }> {
  // 1. Groq (principal)
  if (groqRotator.hasKeys()) {
    try {
      const content = await callGroq(prompt, model, groqRotator.next())
      return { content, provider: "groq" }
    } catch (err) {
      console.warn("[AIGateway] Groq failed, trying fallback:", err)
    }
  }

  // 2. Pollinations como fallback para texto (limitado)
  // En producción aquí iría OpenRouter o Gemini
  throw new Error("All AI providers failed. Check API keys.")
}

// --- Gateway principal ---
export class AIGateway {
  private groqRotator: KeyRotator
  private hfRotator: KeyRotator

  constructor() {
    // Keys desde variables de entorno
    const groqKeys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
    ].filter(Boolean) as string[]

    const hfKeys = [
      process.env.HUGGINGFACE_API_KEY_1,
      process.env.HUGGINGFACE_API_KEY_2,
    ].filter(Boolean) as string[]

    this.groqRotator = new KeyRotator(groqKeys)
    this.hfRotator = new KeyRotator(hfKeys)
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const cacheKey = `${request.task}:${request.prompt.slice(0, 100)}`

    // 1. Check cache
    const cached = getCached(cacheKey)
    if (cached) {
      return { content: cached, provider: "groq", cached: true }
    }

    // 2. Routing por tarea
    const routing = TASK_ROUTING[request.task] ?? TASK_ROUTING.copywriting

    // 3. Ejecutar según provider
    if (request.task === "image" || request.task === "banner") {
      // Imagen: intentar Pollinations primero (gratis), luego HF
      try {
        const content = await callPollinations(request.prompt)
        setCache(cacheKey, content)
        return { content, provider: "pollinations", cached: false }
      } catch {
        if (this.hfRotator.hasKeys()) {
          const content = await callHuggingFace(
            request.prompt,
            routing.model,
            this.hfRotator.next()
          )
          setCache(cacheKey, content)
          return { content, provider: "huggingface", cached: false }
        }
        throw new Error("Image generation failed")
      }
    }

    // Texto: usar fallback chain
    const { content, provider } = await callWithFallback(
      request.prompt,
      this.groqRotator,
      routing.model
    )

    setCache(cacheKey, content)
    return { content, provider, cached: false }
  }

  // Helper: parsear JSON de respuesta IA con fallback
  static parseJSON<T>(content: string, fallback: T): T {
    try {
      // Extraer JSON si viene envuelto en ```json ... ```
      const match = content.match(/```json\s*([\s\S]*?)\s*```/)
      const jsonStr = match ? match[1] : content.trim()
      return JSON.parse(jsonStr) as T
    } catch {
      return fallback
    }
  }
}

// Singleton
export const aiGateway = new AIGateway()
