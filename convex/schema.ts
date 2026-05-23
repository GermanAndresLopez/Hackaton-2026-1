import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("viewer")),
    clerkId: v.optional(v.string()),
    avatar: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  businesses: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("comida"),
      v.literal("ropa"),
      v.literal("tecnologia"),
      v.literal("belleza"),
      v.literal("servicios"),
      v.literal("artesanias"),
      v.literal("otro")
    ),
    logo: v.optional(v.string()),
    theme: v.union(
      v.literal("minimalista"),
      v.literal("premium"),
      v.literal("artesanal"),
      v.literal("moderno"),
      v.literal("callejero")
    ),
    telegram: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    tone: v.string(),
    slug: v.string(),
    isPublic: v.boolean(),
    colors: v.optional(
      v.object({
        primary: v.string(),
        secondary: v.string(),
        accent: v.string(),
      })
    ),
    enfoque: v.optional(v.string()),
    aspiraciones: v.optional(v.string()),
    necesidades: v.optional(v.string()),
    onboardingStep: v.number(),
    growthRoute: v.optional(
      v.object({
        identityId: v.string(),
        identityName: v.string(),
        stage: v.string(),
        recommendedEntities: v.array(v.string()),
        customAdvice: v.string(),
        createdAt: v.number(),
        isActive: v.boolean(),
      })
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_slug", ["slug"]),

  products: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.optional(v.number()),
    images: v.array(v.string()),
    category: v.string(),
    isActive: v.boolean(),
    aiGenerated: v.optional(
      v.object({
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        copy: v.optional(v.string()),
        hashtags: v.optional(v.array(v.string())),
      })
    ),
    views: v.optional(v.number()),
    queries: v.optional(v.number()),
  })
    .index("by_businessId", ["businessId"])
    .index("by_businessId_active", ["businessId", "isActive"]),

  generatedContent: defineTable({
    businessId: v.id("businesses"),
    type: v.union(
      v.literal("marketing_post"),
      v.literal("product_description"),
      v.literal("slogan"),
      v.literal("banner"),
      v.literal("branding"),
      v.literal("campaign")
    ),
    prompt: v.string(),
    response: v.string(),
    provider: v.union(
      v.literal("nvidia"),
      v.literal("groq"),
      v.literal("openrouter"),
      v.literal("gemini"),
      v.literal("huggingface"),
      v.literal("pollinations"),
      v.literal("flux")
    ),
    metadata: v.optional(v.any()),
  }).index("by_businessId", ["businessId"]),

  conversations: defineTable({
    businessId: v.id("businesses"),
    platform: v.union(v.literal("telegram"), v.literal("whatsapp")),
    customerName: v.optional(v.string()),
    customerContact: v.optional(v.string()),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
    isResolved: v.boolean(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_platform", ["businessId", "platform"]),

  metrics: defineTable({
    businessId: v.id("businesses"),
    date: v.string(), // YYYY-MM-DD
    productViews: v.optional(v.any()),
    productQueries: v.optional(v.any()),
    totalMessages: v.number(),
    contentGenerated: v.number(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_date", ["businessId", "date"]),
})
