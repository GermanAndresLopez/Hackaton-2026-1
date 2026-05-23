import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Helper para normalizar slugs en español
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remover acentos
    .replace(/\s+/g, "-")            // reemplazar espacios por guiones
    .replace(/[^\w\-]+/g, "")       // remover caracteres no válidos
    .replace(/\-\-+/g, "-")          // colapsar guiones repetidos
    .replace(/^-+/, "")              // limpiar guiones al inicio
    .replace(/-+$/, "")              // limpiar guiones al final
}

// Registro de usuario y creación de negocio en una sola transacción
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    businessName: v.string(),
    category: v.union(
      v.literal("comida"),
      v.literal("ropa"),
      v.literal("tecnologia"),
      v.literal("belleza"),
      v.literal("servicios"),
      v.literal("artesanias"),
      v.literal("otro")
    ),
  },
  handler: async (ctx, args) => {
    // 1. Verificar si el email ya existe
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique()

    if (existingUser) {
      throw new Error("El correo electrónico ya está registrado.")
    }

    // 2. Crear el usuario
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: "owner",
    })

    // 3. Generar slug único para el negocio
    let baseSlug = slugify(args.businessName)
    if (!baseSlug) baseSlug = "mi-negocio"
    
    let slug = baseSlug
    let counter = 1
    let existingBusiness = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()

    // Si el slug ya existe, agregar un contador al final
    while (existingBusiness) {
      slug = `${baseSlug}-${counter}`
      existingBusiness = await ctx.db
        .query("businesses")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
      counter++
    }

    // 4. Crear el negocio
    const businessId = await ctx.db.insert("businesses", {
      userId,
      name: args.businessName,
      description: "",
      category: args.category,
      theme: "moderno",
      tone: "amigable",
      slug,
      isPublic: false,
      onboardingStep: 1, // Primer paso completado (el registro)
    })

    const user = await ctx.db.get(userId)
    const business = await ctx.db.get(businessId)

    return {
      user,
      business,
    }
  },
})

// Inicio de sesión básico por credenciales
export const login = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Buscar usuario por email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique()

    if (!user) {
      throw new Error("No encontramos una cuenta con ese correo. ¿Ya te registraste?")
    }

    // 2. Validar contraseña
    if (user.password !== args.password) {
      throw new Error("Contraseña incorrecta. Por favor intenta de nuevo.")
    }

    // 3. Obtener el negocio del usuario
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first() // Toma el primer negocio del usuario

    return {
      user,
      business,
    }
  },
})

// Obtener negocio asociado a un usuario
export const getBusinessByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()
  },
})
