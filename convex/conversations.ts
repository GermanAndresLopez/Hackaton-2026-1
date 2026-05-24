import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Listar conversaciones de un negocio
export const listByBusiness = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .order("desc")
      .collect()
  },
})

// Buscar o crear conversación por chatId (Telegram) o número (WhatsApp)
export const getOrCreateConversation = mutation({
  args: {
    businessId: v.id("businesses"),
    platform: v.union(v.literal("telegram"), v.literal("whatsapp")),
    customerContact: v.string(),
    customerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Intentar buscar conversación existente
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_platform", (q) =>
        q.eq("businessId", args.businessId).eq("platform", args.platform)
      )
      .filter((q) => q.eq(q.field("customerContact"), args.customerContact))
      .unique()

    if (existing) {
      // Actualizar nombre si no estaba y ahora se provee
      if (args.customerName && !existing.customerName) {
        await ctx.db.patch(existing._id, { customerName: args.customerName })
        return await ctx.db.get(existing._id)
      }
      return existing
    }

    // Si no existe, crearla
    const id = await ctx.db.insert("conversations", {
      businessId: args.businessId,
      platform: args.platform,
      customerContact: args.customerContact,
      customerName: args.customerName || "Cliente de Telegram",
      messages: [],
      isResolved: true, // Empieza como resuelto hasta que la IA determine que requiere atención
      botEnabled: true, // Por defecto, el bot está encendido
    })

    return await ctx.db.get(id)
  },
})

// Agregar mensaje a la conversación
export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    isResolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) {
      throw new Error("Conversación no encontrada")
    }

    const updatedMessages = [
      ...conversation.messages,
      {
        role: args.role,
        content: args.content,
        timestamp: Date.now(),
      },
    ]

    const patches: any = { messages: updatedMessages }
    if (args.isResolved !== undefined) {
      patches.isResolved = args.isResolved
    }

    await ctx.db.patch(args.conversationId, patches)
    return await ctx.db.get(args.conversationId)
  },
})

// Cambiar estado de resolución de una conversación (humano toma control)
export const setResolvedStatus = mutation({
  args: {
    id: v.id("conversations"),
    isResolved: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isResolved: args.isResolved })
    return await ctx.db.get(args.id)
  },
})

// Cambiar estado del bot en la conversación (encendido/apagado)
export const toggleBotStatus = mutation({
  args: {
    id: v.id("conversations"),
    botEnabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { botEnabled: args.botEnabled })
    return await ctx.db.get(args.id)
  },
})
