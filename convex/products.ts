import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Listar todos los productos de un negocio
export const list = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .order("desc")
      .collect()
  },
})

// Obtener un producto por ID
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Crear un nuevo producto
export const create = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.optional(v.number()),
    images: v.array(v.string()),
    category: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const resolvedImages = await Promise.all(
      args.images.map(async (img) => {
        if (!img.startsWith("http") && !img.startsWith("data:")) {
          const url = await ctx.storage.getUrl(img)
          return url || img
        }
        return img
      })
    )

    const productId = await ctx.db.insert("products", {
      businessId: args.businessId,
      name: args.name,
      description: args.description,
      price: args.price,
      stock: args.stock,
      images: resolvedImages,
      category: args.category,
      isActive: args.isActive,
    })
    return await ctx.db.get(productId)
  },
})

// Activar o desactivar un producto
export const toggleActive = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id)
    if (!product) {
      throw new Error("Producto no encontrado")
    }
    
    await ctx.db.patch(args.id, {
      isActive: !product.isActive,
    })
    return await ctx.db.get(args.id)
  },
})

// Eliminar un producto
export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id)
    if (!product) {
      throw new Error("Producto no encontrado")
    }
    
    await ctx.db.delete(args.id)
    return { success: true }
  },
})

// Registrar visualización de un producto (+1 a views y log diario en metrics)
export const recordProductView = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId)
    if (!product) return { success: false }

    // Incrementar contador total en el producto
    await ctx.db.patch(args.productId, { views: (product.views || 0) + 1 })

    // Loguear vista diaria en la tabla metrics (para gráfico por día de semana)
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const existing = await ctx.db
      .query("metrics")
      .withIndex("by_date", (q) => q.eq("businessId", product.businessId).eq("date", today))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        productViews: (existing.productViews || 0) + 1,
      })
    } else {
      await ctx.db.insert("metrics", {
        businessId: product.businessId,
        date: today,
        productViews: 1,
        productQueries: 0,
        totalMessages: 0,
        contentGenerated: 0,
      })
    }

    return { success: true }
  },
})

