import { action, mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { api } from "./_generated/api"

// ─── Guardar post generado en BD ───
export const savePost = mutation({
  args: {
    businessId: v.id("businesses"),
    contentType: v.string(),
    goal: v.string(),
    texto: v.string(),
    cta: v.string(),
    hashtags: v.array(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("generatedContent", {
      businessId: args.businessId,
      type: "marketing_post",
      prompt: args.contentType + " | " + args.goal,
      response: JSON.stringify({
        texto: args.texto,
        cta: args.cta,
        hashtags: args.hashtags,
        imageUrl: args.imageUrl,
      }),
      provider: "nvidia",
      metadata: { goal: args.goal, contentType: args.contentType },
    })
  },
})

// ─── Guardar roadmap generado en BD ───
export const saveRoadmap = mutation({
  args: {
    businessId: v.id("businesses"),
    goal: v.string(),
    titulo: v.string(),
    dias: v.array(
      v.object({
        dia: v.number(),
        tipo: v.string(),
        hora: v.string(),
        descripcionVisual: v.string(),
        caption: v.string(),
        tip: v.string(),
      })
    ),
    consejosGenerales: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("generatedContent", {
      businessId: args.businessId,
      type: "marketing_roadmap",
      prompt: "Roadmap | " + args.goal,
      response: JSON.stringify({
        titulo: args.titulo,
        dias: args.dias,
        consejosGenerales: args.consejosGenerales,
      }),
      provider: "nvidia",
      metadata: { goal: args.goal },
    })
  },
})

// ─── Listar posts guardados ───
export const listPosts = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("generatedContent")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .order("desc")
      .collect()

    return posts
      .filter((p) => p.type === "marketing_post")
      .map((p) => {
        let parsed: any = {}
        try {
          parsed = JSON.parse(p.response)
        } catch {}
        return {
          _id: p._id,
          _creationTime: p._creationTime,
          ...parsed,
          metadata: p.metadata,
        }
      })
  },
})

// ─── Listar roadmaps guardados ───
export const listRoadmaps = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("generatedContent")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .order("desc")
      .collect()

    return posts
      .filter((p) => p.type === "marketing_roadmap")
      .map((p) => {
        let parsed: any = {}
        try {
          parsed = JSON.parse(p.response)
        } catch {}
        return {
          _id: p._id,
          _creationTime: p._creationTime,
          ...parsed,
          metadata: p.metadata,
        }
      })
  },
})

// ─── Eliminar post o roadmap ───
export const deletePost = mutation({
  args: { id: v.id("generatedContent") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// ─── Generar Post (texto + imagen) ───
export const generatePost = action({
  args: {
    product: v.string(),
    goal: v.string(),
  },
  handler: async (ctx, args) => {
    const nvidiaKey =
      process.env.NVIDIA_API_KEY_1 ||
      process.env.NVIDIA_API_KEY_2 ||
      process.env.NVIDIA_API_KEY_3

    if (!nvidiaKey) {
      throw new Error("No hay API Key de NVIDIA configurada.")
    }

    // 1. Generar texto con Llama
    const prompt = `
Eres un experto en marketing digital para Instagram.
El producto/servicio es: ${args.product}
El objetivo de esta campaña es: ${args.goal}

Debes retornar EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
{
  "texto": "El texto principal de la publicación para Instagram. Incluye emojis relevantes.",
  "cta": "El llamado a la acción (Call To Action).",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "imagePrompt": "A highly detailed prompt in English for generating a professional product photo. Photorealistic, studio lighting, high quality, no text overlays, no watermarks. Focus on the product itself."
}

Responde SOLO con el JSON, sin explicaciones ni markdown.
`

    let textData: any = null

    try {
      console.log("[Marketing] Generando texto con NVIDIA NIM...")
      const response = await fetch(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.3-70b-instruct",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0]?.message?.content ?? ""
        const match = content.match(/```json\s*([\s\S]*?)\s*```/)
        const jsonStr = match ? match[1] : content.trim()
        textData = JSON.parse(jsonStr)
      } else {
        const errText = await response.text()
        console.error("[Marketing] Error en API de texto:", response.status, errText)
        throw new Error("Error en la API de texto de NVIDIA: " + response.status)
      }
    } catch (error: any) {
      if (error.message?.includes("Error en la API")) throw error
      console.error("[Marketing] Error:", error)
      throw new Error("Falló la generación de texto de marketing.")
    }

    // 2. Generar imagen con FLUX
    let imageUrl: string | null = null

    if (textData?.imagePrompt) {
      try {
        console.log("[Marketing] Generando imagen con NVIDIA NIM (FLUX)...")
        const imgResponse = await fetch(
          "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${nvidiaKey}`,
              Accept: "application/json",
            },
            body: JSON.stringify({
              prompt: textData.imagePrompt,
              height: 1024,
              width: 1024,
              seed: Math.floor(Math.random() * 999999),
            }),
          }
        )

        if (imgResponse.ok) {
          const imgData = await imgResponse.json()
          if (imgData.image) {
            imageUrl = "data:image/jpeg;base64," + imgData.image
          } else if (imgData.artifacts && imgData.artifacts.length > 0) {
            imageUrl = "data:image/jpeg;base64," + imgData.artifacts[0].base64
          }
        } else {
          const errText = await imgResponse.text()
          console.warn("[Marketing] Error generando imagen. Status:", imgResponse.status, errText)
        }
      } catch (err) {
        console.error("[Marketing] Error al generar la imagen:", err)
      }
    }

    return {
      texto: textData.texto,
      cta: textData.cta,
      hashtags: textData.hashtags || [],
      imageUrl,
    }
  },
})

// ─── Generar Roadmap ───
export const generateRoadmap = action({
  args: {
    product: v.string(),
    goal: v.string(),
  },
  handler: async (ctx, args) => {
    const nvidiaKey =
      process.env.NVIDIA_API_KEY_1 ||
      process.env.NVIDIA_API_KEY_2 ||
      process.env.NVIDIA_API_KEY_3

    if (!nvidiaKey) {
      throw new Error("No hay API Key de NVIDIA configurada.")
    }

    const prompt = `
Eres un estratega de marketing digital experto en redes sociales para pequeños emprendimientos latinoamericanos.

El producto/servicio es: ${args.product}
El objetivo de marketing es: ${args.goal}

Crea un ROADMAP detallado de contenido para redes sociales de 7 días. 

Para CADA día debes incluir:
- Qué tipo de contenido publicar (foto, carrusel, reel, historia, etc.)
- Descripción exacta del contenido visual (qué foto tomar o crear)
- El texto/caption sugerido para acompañar la publicación
- La mejor hora para publicar
- Tips prácticos de cómo hacerlo (incluso con el celular)

Retorna EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
{
  "titulo": "Nombre creativo para la campaña",
  "dias": [
    {
      "dia": 1,
      "tipo": "Foto de producto",
      "hora": "12:00 PM",
      "descripcionVisual": "Qué foto tomar exactamente...",
      "caption": "El texto para acompañar la publicación...",
      "tip": "Un consejo práctico para hacerlo bien..."
    }
  ],
  "consejosGenerales": "3-4 consejos generales para toda la campaña..."
}

Responde SOLO con el JSON, sin explicaciones ni markdown.
`

    try {
      console.log("[Marketing] Generando roadmap con NVIDIA NIM...")
      const response = await fetch(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.3-70b-instruct",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 3000,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0]?.message?.content ?? ""
        const match = content.match(/```json\s*([\s\S]*?)\s*```/)
        const jsonStr = match ? match[1] : content.trim()
        return JSON.parse(jsonStr)
      } else {
        throw new Error("Error en la API de NVIDIA: " + response.status)
      }
    } catch (error: any) {
      console.error("[Marketing] Error generando roadmap:", error)
      throw new Error("Falló la generación del roadmap.")
    }
  },
})
