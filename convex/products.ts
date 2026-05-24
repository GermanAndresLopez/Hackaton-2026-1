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
