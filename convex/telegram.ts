import { httpAction, action } from "./_generated/server"
import { v } from "convex/values"
import { api } from "./_generated/api"

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

      await ctx.runAction(api.telegram.handleTelegramMessage, {
        businessId: businessId as any,
        chatId: chatId.toString(),
        message: userMessage,
      })
    }
    
    return new Response("OK", { status: 200 })
  } catch (error) {
    console.error("Error processing telegram webhook:", error)
    return new Response("Error", { status: 500 })
  }
})

export const handleTelegramMessage = action({
  args: {
    businessId: v.id("businesses"),
    chatId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Obtener información del negocio
    const business = await ctx.runQuery(api.businesses.getById, { id: args.businessId })
    if (!business || !business.botToken) {
      console.error("No se encontró el negocio o no tiene token configurado.")
      return
    }

    const nvidiaKey = process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY_2 || process.env.NVIDIA_API_KEY_3
    if (!nvidiaKey) {
      console.error("No hay API Key de NVIDIA configurada.")
      return
    }

    // 2. Preparar el prompt con el contexto
    const systemPrompt = `
Eres el asistente virtual por Telegram de este negocio: "${business.name}".
Descripción: ${business.description}
Contexto e instrucciones adicionales del dueño: ${business.botContext || "Sé amable y servicial."}
Tono solicitado: ${business.tone || "amigable"}.

Responde a las preguntas de los clientes de forma concisa, útil y persuasiva. Si no sabes algo, pídele al cliente que espere mientras lo consultas con el dueño o revisa la página web. Usa emojis moderadamente si el tono es amigable.
`

    let aiResponseText = "Lo siento, tuve un problema procesando tu mensaje. Intenta más tarde."

    // 3. Generar respuesta con NVIDIA (Llama 3)
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
          temperature: 0.5,
          max_tokens: 500,
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

    // 4. Enviar respuesta por Telegram
    try {
      await fetch(`https://api.telegram.org/bot${business.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: args.chatId,
          text: aiResponseText,
        }),
      })
    } catch (err) {
      console.error("Error al enviar mensaje por Telegram:", err)
    }
  }
})
