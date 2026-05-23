// ============================================================
// MOCK DATABASE — Simula Convex en memoria para pruebas
// Reemplazar cada función por la query/mutation de Convex real
// ============================================================

import {
  SEED_USERS,
  SEED_BUSINESSES,
  SEED_PRODUCTS,
  SEED_GENERATED_CONTENT,
  SEED_CONVERSATIONS,
  SEED_METRICS,
} from "./seedData"
import type {
  User,
  Business,
  Product,
  GeneratedContent,
  Conversation,
  Metric,
} from "@/types"
import { slugify } from "@/lib/utils"

// --- Estado mutable en memoria ---
let users = [...SEED_USERS]
let businesses = [...SEED_BUSINESSES]
let products = [...SEED_PRODUCTS]
let generatedContent = [...SEED_GENERATED_CONTENT]
let conversations = [...SEED_CONVERSATIONS]
let metrics = [...SEED_METRICS]

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// =============================================================
// USERS
// =============================================================
export const db = {
  users: {
    findByEmail: (email: string): User | undefined =>
      users.find((u) => u.email === email),

    findById: (id: string): User | undefined =>
      users.find((u) => u.id === id),

    create: (data: Omit<User, "id" | "createdAt">): User => {
      const user: User = { ...data, id: generateId("user"), createdAt: Date.now() }
      users = [...users, user]
      return user
    },
  },

  // =============================================================
  // BUSINESSES
  // =============================================================
  businesses: {
    findByUserId: (userId: string): Business | undefined =>
      businesses.find((b) => b.userId === userId),

    findBySlug: (slug: string): Business | undefined =>
      businesses.find((b) => b.slug === slug),

    findById: (id: string): Business | undefined =>
      businesses.find((b) => b.id === id),

    list: (): Business[] => [...businesses],

    create: (data: Omit<Business, "id" | "slug" | "createdAt">): Business => {
      const business: Business = {
        ...data,
        id: generateId("biz"),
        slug: slugify(data.name),
        createdAt: Date.now(),
      }
      businesses = [...businesses, business]
      return business
    },

    update: (id: string, data: Partial<Business>): Business | null => {
      const idx = businesses.findIndex((b) => b.id === id)
      if (idx === -1) return null
      const updated = { ...businesses[idx], ...data }
      businesses = businesses.map((b) => (b.id === id ? updated : b))
      return updated
    },
  },

  // =============================================================
  // PRODUCTS
  // =============================================================
  products: {
    findByBusinessId: (businessId: string): Product[] =>
      products.filter((p) => p.businessId === businessId),

    findActiveByBusinessId: (businessId: string): Product[] =>
      products.filter((p) => p.businessId === businessId && p.isActive),

    findById: (id: string): Product | undefined =>
      products.find((p) => p.id === id),

    create: (data: Omit<Product, "id" | "createdAt">): Product => {
      const product: Product = {
        ...data,
        id: generateId("prod"),
        createdAt: Date.now(),
      }
      products = [...products, product]
      return product
    },

    update: (id: string, data: Partial<Product>): Product | null => {
      const idx = products.findIndex((p) => p.id === id)
      if (idx === -1) return null
      const updated = { ...products[idx], ...data }
      products = products.map((p) => (p.id === id ? updated : p))
      return updated
    },

    delete: (id: string): boolean => {
      const prev = products.length
      products = products.filter((p) => p.id !== id)
      return products.length < prev
    },

    toggleActive: (id: string): Product | null => {
      const product = products.find((p) => p.id === id)
      if (!product) return null
      return db.products.update(id, { isActive: !product.isActive })
    },

    addAIGenerated: (
      id: string,
      aiData: NonNullable<Product["aiGenerated"]>
    ): Product | null => db.products.update(id, { aiGenerated: aiData }),
  },

  // =============================================================
  // GENERATED CONTENT
  // =============================================================
  generatedContent: {
    findByBusinessId: (businessId: string): GeneratedContent[] =>
      generatedContent
        .filter((c) => c.businessId === businessId)
        .sort((a, b) => b.createdAt - a.createdAt),

    create: (data: Omit<GeneratedContent, "id" | "createdAt">): GeneratedContent => {
      const content: GeneratedContent = {
        ...data,
        id: generateId("content"),
        createdAt: Date.now(),
      }
      generatedContent = [content, ...generatedContent]
      return content
    },

    delete: (id: string): boolean => {
      const prev = generatedContent.length
      generatedContent = generatedContent.filter((c) => c.id !== id)
      return generatedContent.length < prev
    },
  },

  // =============================================================
  // CONVERSATIONS
  // =============================================================
  conversations: {
    findByBusinessId: (businessId: string): Conversation[] =>
      conversations
        .filter((c) => c.businessId === businessId)
        .sort((a, b) => b.createdAt - a.createdAt),

    findById: (id: string): Conversation | undefined =>
      conversations.find((c) => c.id === id),

    create: (data: Omit<Conversation, "id" | "createdAt">): Conversation => {
      const conv: Conversation = {
        ...data,
        id: generateId("conv"),
        createdAt: Date.now(),
      }
      conversations = [conv, ...conversations]
      return conv
    },

    addMessage: (
      id: string,
      message: Conversation["messages"][0]
    ): Conversation | null => {
      const conv = conversations.find((c) => c.id === id)
      if (!conv) return null
      const updated = { ...conv, messages: [...conv.messages, message] }
      conversations = conversations.map((c) => (c.id === id ? updated : c))
      return updated
    },
  },

  // =============================================================
  // METRICS
  // =============================================================
  metrics: {
    findByBusinessId: (businessId: string): Metric | undefined =>
      metrics.find((m) => m.businessId === businessId),

    incrementView: (businessId: string, productId: string): void => {
      const idx = metrics.findIndex((m) => m.businessId === businessId)
      if (idx === -1) return
      const m = metrics[idx]
      const views = { ...(m.productViews as Record<string, number> ?? {}) }
      views[productId] = (views[productId] ?? 0) + 1
      metrics = metrics.map((m, i) =>
        i === idx ? { ...m, productViews: views } : m
      )
    },

    incrementMessage: (businessId: string): void => {
      metrics = metrics.map((m) =>
        m.businessId === businessId
          ? { ...m, totalMessages: m.totalMessages + 1 }
          : m
      )
    },
  },

  // =============================================================
  // RESET (para tests)
  // =============================================================
  reset: () => {
    users = [...SEED_USERS]
    businesses = [...SEED_BUSINESSES]
    products = [...SEED_PRODUCTS]
    generatedContent = [...SEED_GENERATED_CONTENT]
    conversations = [...SEED_CONVERSATIONS]
    metrics = [...SEED_METRICS]
  },

  // =============================================================
  // STATS globales (para el dashboard)
  // =============================================================
  getStats: (businessId: string) => {
    const bProducts = products.filter((p) => p.businessId === businessId)
    const bContent = generatedContent.filter((c) => c.businessId === businessId)
    const bMetrics = metrics.find((m) => m.businessId === businessId)
    const productViews = bMetrics?.productViews as Record<string, number> ?? {}

    return {
      totalProducts: bProducts.length,
      activeProducts: bProducts.filter((p) => p.isActive).length,
      totalMessages: bMetrics?.totalMessages ?? 0,
      contentGenerated: bContent.length,
      totalViews: Object.values(productViews).reduce((a, b) => a + b, 0),
    }
  },
}

// Negocio activo para pruebas (usuario_001 → biz_001)
export const CURRENT_USER_ID = "user_001"
export const CURRENT_BUSINESS_ID = "biz_001"
export const currentBusiness = () => db.businesses.findById(CURRENT_BUSINESS_ID)!
export const currentProducts = () => db.products.findByBusinessId(CURRENT_BUSINESS_ID)
export const currentMetrics = () => db.metrics.findByBusinessId(CURRENT_BUSINESS_ID)
export const currentContent = () => db.generatedContent.findByBusinessId(CURRENT_BUSINESS_ID)
export const currentConversations = () => db.conversations.findByBusinessId(CURRENT_BUSINESS_ID)
