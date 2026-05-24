import { httpAction, action } from "./_generated/server"
import { v } from "convex/values"
import { api } from "./_generated/api"

// HTTP Action for Telegram Webhook
export const telegramWebhook = httpAction(async (ctx, request) => {
  const url = new URL(request.url)
  const businessId = url.searchParams.get("businessId")

  if (!businessId) {
    return new Response("Missing businessId in query params", { status: 400 })
  }

  try {
    const payload = await request.json()
    
    if (payload.message && payload.message.text) {
      const chatId = payload.message.chat.id
      const userMessage = payload.message.text
      
      // Capturar nombre del cliente si está disponible en la metadata de Telegram
      const from = payload.message.from || {}
      const firstName = from.first_name || ""
      const lastName = from.last_name || ""
      const username = from.username || ""
      const customerName = `${firstName} ${lastName}`.trim() || username || "Cliente de Telegram"

      await ctx.runAction(api.telegram.handleTelegramMessage, {
        businessId: businessId as any,
        chatId: chatId.toString(),
        message: userMessage,
        customerName: customerName,
      })
    }
    
    return new Response("OK", { status: 200 })
  } catch (error) {
    console.error("Error processing telegram webhook:", error)
    return new Response("Error", { status: 500 })
  }
})

// Registrar webhook en la API de Telegram
export const registerTelegramWebhook = action({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args): Promise<any> => {
    // 1. Obtener negocio
    const business: any = await ctx.runQuery(api.businesses.getById, { id: args.businessId })
    if (!business || !business.botToken) {
      throw new Error("No se encontró el negocio o no tiene token configurado.")
    }

    // 2. Obtener URL del sitio Convex
    const siteUrl = process.env.CONVEX_SITE_URL
    if (!siteUrl) {
      throw new Error("La variable de entorno CONVEX_SITE_URL no está configurada en Convex.")
    }

    const webhookUrl = `${siteUrl}/telegram?businessId=${args.businessId}`

    // 3. Registrar en Telegram
    try {
      const response = await fetch(`https://api.telegram.org/bot${business.botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`)
      const result = await response.json()
      
      if (!response.ok || !result.ok) {
        throw new Error(result.description || "Error al registrar el webhook en Telegram.")
      }

      return {
        success: true,
        description: result.description,
        webhookUrl,
      }
    } catch (err: any) {
      console.error("Error al registrar webhook con Telegram:", err)
      throw new Error(err.message || "Error al conectar con la API de Telegram")
    }
  },
})

// Manejar el mensaje con IA, catálogo e historial
export const handleTelegramMessage = action({
  args: {
    businessId: v.id("businesses"),
    chatId: v.string(),
    message: v.string(),
    customerName: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    // 1. Obtener información del negocio
    const business: any = await ctx.runQuery(api.businesses.getById, { id: args.businessId })
    if (!business || !business.botToken) {
      console.error("No se encontró el negocio o no tiene token configurado.")
      return
    }

    const nvidiaKey = process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY_2 || process.env.NVIDIA_API_KEY_3
    if (!nvidiaKey) {
      console.error("No hay API Key de NVIDIA configurada.")
      return
    }

    // 2. Obtener o Crear la conversación para registrar en BD
    const conversation: any = await ctx.runMutation(api.conversations.getOrCreateConversation, {
      businessId: args.businessId,
      platform: "telegram",
      customerContact: args.chatId,
      customerName: args.customerName,
    })

    // Registrar mensaje de usuario en BD
    await ctx.runMutation(api.conversations.addMessage, {
      conversationId: conversation._id,
      role: "user",
      content: args.message,
    })

    // Si el bot está apagado, no generar respuesta de IA
    if (conversation.botEnabled === false) {
      console.log("Bot apagado. No se generará respuesta automática.");
      return;
    }

    // 3. Obtener el catálogo de productos activos del negocio
    const products: any = await ctx.runQuery(api.products.list, { businessId: args.businessId })
    const activeProducts = (products as any[]).filter((p: any) => p.isActive)
    const catalogContext = activeProducts.map((p: any) => 
      `- ${p.name}: ${p.description || "Sin descripción"}. Precio: $${p.price} COP. Categoría: ${p.category}`
    ).join("\n")

    // 4. Obtener los últimos 8 mensajes del historial del chat para mantener el contexto
    const historyLimit = 8
    const chatHistory = conversation.messages.slice(-historyLimit)
    const historyText = chatHistory.map((m: any) => 
      `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.content}`
    ).join("\n")

    // 5. Preparar el prompt con el contexto
    const systemPrompt = `
Eres el asistente virtual por Telegram de este negocio: "${business.name}".
Descripción del negocio: ${business.description}
Contexto e instrucciones adicionales del dueño: ${business.botContext || "Sé amable y servicial."}
Tono solicitado para hablar: ${business.tone || "amigable"}.

---
CATÁLOGO DE PRODUCTOS DISPONIBLES:
${catalogContext || "Actualmente no hay productos en el catálogo público."}
---

HISTORIAL DE LA CONVERSACIÓN RECIENTE:
${historyText || "(Esta es la primera interacción)"}

---
REGLAS IMPORTANTES DE ATENCIÓN:
1. Responde a las preguntas de los clientes de forma concisa, útil y persuasiva.
2. Si te preguntan por productos, descripciones, precios o stock, usa estrictamente el CATÁLOGO DE PRODUCTOS DISPONIBLES provisto arriba.
3. Si no sabes algo o no está en el catálogo, pídele amablemente al cliente que espere o dile que lo consultarás con el dueño.
4. DETECTAR INTENCIÓN DE PAGO/COMPRA: Si el cliente expresa un claro deseo de finalizar la compra, pagar, pedir el total de su pedido, realizar un pedido formal o coordinar el pago, responde de forma muy amable informándole que **el dueño del negocio tomará el control en este momento** para mandarle las opciones de pago (transferencia, efectivo, etc.) y coordinar el envío de forma segura de inmediato. 
5. CRÍTICO: Si detectas esta intención de compra o pago, **DEBES incluir la palabra clave exacta "[TRANSFER_TO_HUMAN]"** al final de tu respuesta (con corchetes). Si solo está haciendo preguntas generales o conociendo productos, NO incluyas este tag.

Por favor genera tu respuesta a continuación:
`

    let aiResponseText = "Lo siento, tuve un problema procesando tu mensaje. Intenta más tarde."

    // 6. Generar respuesta con NVIDIA (Llama 3)
    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${nvidiaKey}`,
        },
        body: JSON.stringify({
          model: "meta/llama-3.3-70b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: args.message }
          ],
          temperature: 0.4,
          max_tokens: 600,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        aiResponseText = data.choices[0]?.message?.content ?? aiResponseText
      } else {
        console.error("Error en NVIDIA API:", response.status)
      }
    } catch (err) {
      console.error("Error al llamar a NVIDIA API:", err)
    }

    // 7. Evaluar si la IA solicitó transferir el control a un humano
    const wantsToTransfer = aiResponseText.includes("[TRANSFER_TO_HUMAN]")
    // Limpiar el tag de la respuesta que va al cliente
    const finalResponseText = aiResponseText.replace("[TRANSFER_TO_HUMAN]", "").trim()

    // Registrar respuesta de asistente en BD (y marcar como pendiente/no resuelto si requiere humano)
    await ctx.runMutation(api.conversations.addMessage, {
      conversationId: conversation._id,
      role: "assistant",
      content: finalResponseText,
      isResolved: wantsToTransfer ? false : undefined, // Si requiere transferencia, se desmarca como "resuelto"
    })

    // 8. Enviar respuesta por Telegram
    try {
      await fetch(`https://api.telegram.org/bot${business.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: args.chatId,
          text: finalResponseText,
        }),
      })
    } catch (err) {
      console.error("Error al enviar mensaje por Telegram:", err)
    }
  }
})

// Enviar respuesta manual del vendedor y resolver conversación
export const sendManualMessage = action({
  args: {
    businessId: v.id("businesses"),
    conversationId: v.id("conversations"),
    chatId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    // 1. Obtener negocio
    const business: any = await ctx.runQuery(api.businesses.getById, { id: args.businessId })
    if (!business || !business.botToken) {
      throw new Error("No se encontró el negocio o no tiene token configurado.")
    }

    // 2. Enviar mensaje por Telegram
    try {
      const response = await fetch(`https://api.telegram.org/bot${business.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: args.chatId,
          text: args.message,
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) {
        throw new Error(result.description || "Error al enviar mensaje por Telegram")
      }
    } catch (err: any) {
      console.error("Error al enviar mensaje manual de Telegram:", err)
      throw new Error(err.message || "Error al enviar mensaje por Telegram")
    }

    // 3. Registrar mensaje en BD y marcar como resuelto (ya que el humano respondió)
    await ctx.runMutation(api.conversations.addMessage, {
      conversationId: args.conversationId,
      role: "assistant",
      content: args.message,
      isResolved: true, // El humano respondió, entonces se marca como resuelto
    })

    // 4. Apagar bot automáticamente al responder manualmente
    await ctx.runMutation(api.conversations.toggleBotStatus, {
      id: args.conversationId,
      botEnabled: false,
    })

    return { success: true }
  }
})
