import { action, mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { api } from "./_generated/api"
import colombiaContext from "./colombia_contexto_emprendimiento.json"

export const analyzeProfile = action({
  args: {
    businessId: v.id("businesses"),
    profileDescription: v.string(),
    city: v.string(),
  },
  handler: async (ctx, args) => {
    const nvidiaKey =
      process.env.NVIDIA_API_KEY_1 ||
      process.env.NVIDIA_API_KEY_2 ||
      process.env.NVIDIA_API_KEY_3

    if (!nvidiaKey) {
      throw new Error("No hay API Key de NVIDIA configurada.")
    }

    const business = await ctx.runQuery(api.businesses.getById, { id: args.businessId })
    if (!business) throw new Error("Negocio no encontrado")

    const systemPrompt = `
Eres un asesor experto en el ecosistema de emprendimiento de Colombia.
A continuación te proporcionaré el contexto actual de identidades y entidades de apoyo en Colombia en formato JSON:

${JSON.stringify(colombiaContext, null, 2)}

El usuario ha descrito su negocio y su perfil de la siguiente manera:
"""
${args.profileDescription}
"""
También sabemos que su negocio se llama "${business.name}", su categoría es "${business.category}" y está ubicado en la ciudad de "${args.city}".

Tu tarea es analizar esta descripción y hacer un "match" con las opciones del contexto proporcionado. Ten en cuenta la ciudad (${args.city}) para recomendar entidades que tengan sede o foco allí.
Debes retornar EXCLUSIVAMENTE un objeto JSON con la siguiente estructura y nada más:
{
  "identityId": "El ID de la identidad que mejor coincide (ej. I01, I02, etc.)",
  "identityName": "El nombre exacto de la identidad seleccionada",
  "stage": "La etapa en la que crees que se encuentra (ej. idea, inicio, formalización, crecimiento)",
  "recommendedEntities": ["E01", "E04", "E05"], // Array con los IDs de las entidades que más le convienen según su identidad y necesidades. Recomienda entre 2 y 4 entidades.
  "customAdvice": "Un consejo corto (2-3 oraciones) animando al emprendedor y explicándole por qué le recomiendas estas entidades."
}

No incluyas explicaciones fuera del JSON. Devuelve solo el JSON válido.
`

    try {
      console.log("[Growth] Analizando perfil con NVIDIA NIM...")
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
            messages: [{ role: "user", content: systemPrompt }],
            temperature: 0.2,
            max_tokens: 1000,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Error en la API de NVIDIA: " + response.status)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content ?? ""
      const match = content.match(/```json\s*([\s\S]*?)\s*```/)
      const jsonStr = match ? match[1] : content.trim()
      
      const parsed = JSON.parse(jsonStr)

      // Guardar en la base de datos
      await ctx.runMutation(api.growth.saveGrowthRoute, {
        businessId: args.businessId,
        identityId: parsed.identityId,
        identityName: parsed.identityName,
        stage: parsed.stage,
        recommendedEntities: parsed.recommendedEntities,
        customAdvice: parsed.customAdvice,
        city: args.city,
      })

      return parsed

    } catch (error: any) {
      console.error("[Growth] Error analizando perfil:", error)
      throw new Error("Falló el análisis del perfil: " + error.message)
    }
  },
})

export const saveGrowthRoute = mutation({
  args: {
    businessId: v.id("businesses"),
    identityId: v.string(),
    identityName: v.string(),
    stage: v.string(),
    recommendedEntities: v.array(v.string()),
    customAdvice: v.string(),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.businessId, {
      growthRoute: {
        identityId: args.identityId,
        identityName: args.identityName,
        stage: args.stage,
        recommendedEntities: args.recommendedEntities,
        customAdvice: args.customAdvice,
        city: args.city,
        createdAt: Date.now(),
        isActive: true,
      },
    })
  },
})

export const getColombiaContext = query({
  args: {},
  handler: async () => {
    return colombiaContext
  },
})
