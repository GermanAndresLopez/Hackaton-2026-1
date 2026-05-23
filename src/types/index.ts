// ============================================================
// TIPOS GLOBALES — Plataforma IA para Emprendedores
// ============================================================

export type UserRole = "owner" | "admin" | "viewer"

export type BusinessCategory =
  | "comida"
  | "ropa"
  | "tecnologia"
  | "belleza"
  | "servicios"
  | "artesanias"
  | "otro"

export type BusinessTheme =
  | "minimalista"
  | "premium"
  | "artesanal"
  | "moderno"
  | "callejero"

export type AIProvider =
  | "groq"
  | "openrouter"
  | "gemini"
  | "huggingface"
  | "pollinations"
  | "flux"

export type ContentType =
  | "marketing_post"
  | "product_description"
  | "slogan"
  | "banner"
  | "branding"
  | "campaign"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: number
}

export interface Business {
  id: string
  userId: string
  name: string
  description: string
  category: BusinessCategory
  logo?: string
  theme: BusinessTheme
  telegram?: string
  whatsapp?: string
  tone: string
  slug: string
  isPublic: boolean
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
  createdAt: number
}

export interface Product {
  id: string
  businessId: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
  isActive: boolean
  aiGenerated?: {
    name?: string
    description?: string
    copy?: string
    hashtags?: string[]
  }
  createdAt: number
}

export interface GeneratedContent {
  id: string
  businessId: string
  type: ContentType
  prompt: string
  response: string
  provider: AIProvider
  metadata?: Record<string, unknown>
  createdAt: number
}

export interface Conversation {
  id: string
  businessId: string
  platform: "telegram" | "whatsapp"
  customerName?: string
  messages: Message[]
  createdAt: number
}

export interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface Metric {
  businessId: string
  productViews: Record<string, number>
  productQueries: Record<string, number>
  totalMessages: number
  contentGenerated: number
  period: "day" | "week" | "month"
}

// AI Gateway types
export interface AIRequest {
  task: "copywriting" | "marketing" | "branding" | "image" | "banner" | "chat"
  prompt: string
  context?: Record<string, string>
  preferredProvider?: AIProvider
}

export interface AIResponse {
  content: string
  provider: AIProvider
  cached: boolean
  tokensUsed?: number
}

export interface AIGatewayConfig {
  groqKeys: string[]
  huggingfaceKeys: string[]
  openrouterKey?: string
  geminiKey?: string
}
