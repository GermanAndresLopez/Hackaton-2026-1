import { query, mutation, action } from "./_generated/server"
import { v } from "convex/values"
import { api } from "./_generated/api"
import colombiaContext from "./colombia_contexto_emprendimiento.json"

// =============================================================
// QUERIES
// =============================================================

// Obtener negocio por ID
export const getById = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Obtener negocio por Slug (tienda pública)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()
  },
})

// =============================================================
// MUTATIONS
// =============================================================

// Actualizar onboarding de forma progresiva
export const updateOnboarding = mutation({
  args: {
    id: v.id("businesses"),
    step: v.number(),
    data: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      telegram: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      enfoque: v.optional(v.string()),
      aspiraciones: v.optional(v.string()),
      necesidades: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.id)
    if (!business) {
      throw new Error("Negocio no encontrado")
    }

    // Backend progresivo: no permite saltar pasos sin completarlos
    if (args.step > business.onboardingStep + 1 && args.step !== business.onboardingStep) {
      throw new Error("No puedes saltarte pasos de registro. Por favor completa el onboarding progresivamente.")
    }

    const updatedData: any = {
      onboardingStep: args.step,
      ...args.data,
    }

    await ctx.db.patch(args.id, updatedData)
    return await ctx.db.get(args.id)
  },
})

// Guardar la ruta de crecimiento
export const saveGrowthRoute = mutation({
  args: {
    id: v.id("businesses"),
    growthRoute: v.object({
      identityId: v.string(),
      identityName: v.string(),
      stage: v.string(),
      recommendedEntities: v.array(v.string()),
      customAdvice: v.string(),
      createdAt: v.number(),
      isActive: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      growthRoute: args.growthRoute,
      onboardingStep: 4, // 4 = Completado totalmente
    })
    return await ctx.db.get(args.id)
  },
})

// =============================================================
// ACTIONS (IA & API Calls)
// =============================================================

// Generar la ruta de crecimiento con NVIDIA NIM y fallbacks a Groq
export const generateGrowthRouteAction = action({
  args: {
    id: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    // 1. Obtener la info del negocio
    const business = await ctx.runQuery(api.businesses.getById, { id: args.id })
    if (!business) {
      throw new Error("Negocio no encontrado")
    }

    // 2. Validar que tenga los campos del paso 3 para poder generar
    if (!business.enfoque || !business.aspiraciones || !business.necesidades) {
      throw new Error("Falta completar la información de enfoque, aspiraciones y necesidades del negocio.")
    }

    // 3. Armar el Prompt con el contexto de Colombia
    const prompt = `
Eres un asesor de negocios especialista en emprendimientos y micronegocios informales de Colombia.

Tu objetivo es analizar el perfil de un emprendedor, clasificarlo dentro del marco de caracterización nacional y proveer una ruta de crecimiento concreta, conectándolo con entidades y programas de apoyo reales en Colombia que resuelvan directamente sus necesidades.

A partir de la información de este negocio:
- Nombre del negocio: ${business.name}
- Categoría: ${business.category}
- Descripción general: ${business.description}
- Enfoque específico: ${business.enfoque}
- Aspiraciones a futuro: ${business.aspiraciones}
- Necesidades urgentes: ${business.necesidades}

Y utilizando estrictamente este contexto nacional colombiano de apoyo (entidades, identidades y rutas de impulso):
${JSON.stringify(colombiaContext, null, 2)}

Debes retornar un análisis en formato JSON estricto con los siguientes campos:
1. "identityId": El ID de la identidad en el JSON de contexto que mejor se ajusta al perfil del emprendedor (ej: "I01", "I02", "I03", "I04", "I05").
2. "identityName": El nombre de esa identidad seleccionada (ej: "Joven emprendedor", "Mujer emprendedora").
3. "stage": La etapa de la ruta de impulso recomendada (ej: "idea", "inicio", "formalización", "crecimiento").
4. "recommendedEntities": Un array de strings con los IDs de las entidades de apoyo que más le convienen (ej: ["E01", "E04", "E05"]). Máximo 3 entidades.
5. "customAdvice": Un texto motivador, redactado de forma muy amigable, cercana y con jerga/tono colombiano respetuoso. Explícale al emprendedor EXACTAMENTE por qué elegiste esas entidades para él, cómo sus necesidades (necesidades de financiamiento, marca, equipos) encajan con las entidades elegidas, y qué 2 acciones concretas inmediatas debe hacer esta semana (ej. "Ir al SENA en tal sede o web para...", "Registrar su RUT en la Dian"). Usa negritas con markdown (**) para destacar nombres y acciones clave. Mantén el texto corto, inspirador y directo (máx 3-4 párrafos pequeños).

Responde únicamente con el JSON estricto, sin explicaciones fuera del bloque JSON.

JSON de respuesta:
`

    let content = ""
    let provider = "nvidia"

    // 4. Intentar llamar al motor principal NVIDIA NIM
    const nvidiaKey = process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY_2 || process.env.NVIDIA_API_KEY_3
    if (nvidiaKey) {
      try {
        console.log("[Convex Action] Generando con NVIDIA NIM (meta/llama-3.3-70b-instruct)...")
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
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
        })

        if (response.ok) {
          const data = await response.json()
          content = data.choices[0]?.message?.content ?? ""
        } else {
          console.warn("[Convex Action] NVIDIA NIM falló, estado:", response.status)
        }
      } catch (err) {
        console.warn("[Convex Action] NVIDIA NIM falló con excepción, recurriendo a Groq:", err)
      }
    }

    // 5. Fallback silencioso a Groq si NVIDIA falla o no tiene keys
    if (!content) {
      const groqKey = process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY_2 || process.env.GROQ_API_KEY_3
      if (groqKey) {
        try {
          console.log("[Convex Action] Recurriendo a Groq (llama-3.3-70b-versatile) como fallback...")
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
              max_tokens: 1500,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            content = data.choices[0]?.message?.content ?? ""
            provider = "groq"
          } else {
            console.warn("[Convex Action] Groq fallback también falló, estado:", response.status)
          }
        } catch (err) {
          console.error("[Convex Action] Groq fallback falló con excepción:", err)
        }
      }
    }

    if (!content) {
      throw new Error("Ambos motores de IA (NVIDIA y Groq) fallaron. Por favor verifica las API keys en la configuración de Convex.")
    }

    // 6. Parsear respuesta en formato JSON
    let routeData: {
      identityId: string
      identityName: string
      stage: string
      recommendedEntities: string[]
      customAdvice: string
    }

    try {
      const match = content.match(/```json\s*([\s\S]*?)\s*```/)
      const jsonStr = match ? match[1] : content.trim()
      routeData = JSON.parse(jsonStr)
    } catch (err) {
      console.error("[Convex Action] Error parseando el JSON de IA. Respuesta cruda:", content)
      throw new Error("La IA no retornó un bloque JSON válido para estructurar la ruta. Reintenta.")
    }

    // 7. Guardar en BD a través de la Mutation
    await ctx.runMutation(api.businesses.saveGrowthRoute, {
      id: args.id,
      growthRoute: {
        identityId: routeData.identityId,
        identityName: routeData.identityName,
        stage: routeData.stage,
        recommendedEntities: routeData.recommendedEntities,
        customAdvice: routeData.customAdvice,
        createdAt: Date.now(),
        isActive: true,
      },
    })

    return {
      success: true,
      provider,
      growthRoute: routeData,
    }
  },
})
