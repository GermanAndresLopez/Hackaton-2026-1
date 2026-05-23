// ============================================================
// AI GATEWAY LAYER — Rotación de keys, fallback, routing, cache
// Prioridad: NVIDIA NIM -> Fallback: Groq / Pollinations / HF
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

// --- In-memory cache ---
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
  if (responseCache.size > 500) {
    const oldestKey = responseCache.keys().next().value
    if (oldestKey) responseCache.delete(oldestKey)
  }
}

// --- NVIDIA NIM text helper ---
async function callNvidia(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
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
    throw new Error(`Nvidia error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content ?? ""
}

// --- NVIDIA NIM image helper (OpenAI compatible) ---
async function callNvidiaImage(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch("https://integrate.api.nvidia.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  })

  if (!response.ok) {
    throw new Error(`Nvidia image error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const b64 = data.data?.[0]?.b64_json
  if (!b64) throw new Error("No image data returned from NVIDIA")
  return `data:image/png;base64,${b64}`
}

// --- Groq helper ---
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
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&enhance=true`
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

  const blob = await response.blob()
  const buffer = await blob.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  return `data:image/png;base64,${base64}`
}

// --- Failover chain para texto ---
async function callWithFallback(
  prompt: string,
  nvidiaRotator: KeyRotator,
  groqRotator: KeyRotator,
  task: string
): Promise<{ content: string; provider: AIProvider }> {
  // Determinar modelos de nvidia y groq para cada tarea
  const nvidiaModel = task === "chat" ? "meta/llama-3.1-8b-instruct" : "meta/llama-3.3-70b-instruct"
  const groqModel = task === "chat" ? "llama-3.1-8b-instant" : "llama-3.3-70b-versatile"

  // 1. Intentar NVIDIA (Principal)
  if (nvidiaRotator.hasKeys()) {
    try {
      console.log(`[AIGateway] Intentando NVIDIA (${nvidiaModel}) para tarea: ${task}...`)
      const content = await callNvidia(prompt, nvidiaModel, nvidiaRotator.next())
      return { content, provider: "nvidia" }
    } catch (err) {
      console.warn("[AIGateway] NVIDIA failed, falling back to Groq:", err)
    }
  }

  // 2. Intentar Groq (Secundario)
  if (groqRotator.hasKeys()) {
    try {
      console.log(`[AIGateway] Intentando Groq (${groqModel}) como fallback para tarea: ${task}...`)
      const content = await callGroq(prompt, groqModel, groqRotator.next())
      return { content, provider: "groq" }
    } catch (err) {
      console.warn("[AIGateway] Groq fallback failed:", err)
    }
  }

  throw new Error("All text AI providers failed. Check NVIDIA and Groq API keys.")
}

// --- Gateway principal ---
export class AIGateway {
  private nvidiaRotator: KeyRotator
  private groqRotator: KeyRotator
  private hfRotator: KeyRotator

  constructor() {
    // Keys desde variables de entorno
    const nvidiaKeys = [
      process.env.NVIDIA_API_KEY_1,
      process.env.NVIDIA_API_KEY_2,
      process.env.NVIDIA_API_KEY_3,
    ].filter(Boolean) as string[]

    const groqKeys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
    ].filter(Boolean) as string[]

    const hfKeys = [
      process.env.HUGGINGFACE_API_KEY_1,
      process.env.HUGGINGFACE_API_KEY_2,
    ].filter(Boolean) as string[]

    this.nvidiaRotator = new KeyRotator(nvidiaKeys)
    this.groqRotator = new KeyRotator(groqKeys)
    this.hfRotator = new KeyRotator(hfKeys)
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const cacheKey = `${request.task}:${request.prompt.slice(0, 100)}`

    // 1. Check cache
    const cached = getCached(cacheKey)
    if (cached) {
      return { content: cached, provider: "nvidia", cached: true }
    }

    // 2. Ejecutar según provider / tarea
    if (request.task === "image" || request.task === "banner") {
      // Imagen: intentar NVIDIA primero, luego Pollinations, luego HF
      if (this.nvidiaRotator.hasKeys()) {
        try {
          console.log("[AIGateway] Intentando NVIDIA Image...")
          const content = await callNvidiaImage(
            request.prompt,
            "nvidia/stable-diffusion-xl",
            this.nvidiaRotator.next()
          )
          setCache(cacheKey, content)
          return { content, provider: "nvidia", cached: false }
        } catch (err) {
          console.warn("[AIGateway] NVIDIA Image failed, falling back to Pollinations/HF:", err)
        }
      }

      // Fallback a Pollinations (gratis)
      try {
        console.log("[AIGateway] Intentando Pollinations como fallback...")
        const content = await callPollinations(request.prompt)
        setCache(cacheKey, content)
        return { content, provider: "pollinations", cached: false }
      } catch {
        if (this.hfRotator.hasKeys()) {
          console.log("[AIGateway] Intentando HuggingFace como fallback...")
          const content = await callHuggingFace(
            request.prompt,
            "stabilityai/stable-diffusion-xl-base-1.0",
            this.hfRotator.next()
          )
          setCache(cacheKey, content)
          return { content, provider: "huggingface", cached: false }
        }
        throw new Error("Image generation failed on all providers")
      }
    }

    // Texto: usar fallback chain progresivo
    const { content, provider } = await callWithFallback(
      request.prompt,
      this.nvidiaRotator,
      this.groqRotator,
      request.task
    )

    setCache(cacheKey, content)
    return { content, provider, cached: false }
  }

  // Helper: parsear JSON de respuesta IA con fallback
  static parseJSON<T>(content: string, fallback: T): T {
    try {
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
