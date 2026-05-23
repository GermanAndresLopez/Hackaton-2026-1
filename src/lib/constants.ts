export const APP_NAME = "VendeMás IA"
export const APP_DESCRIPTION = "Tu asistente comercial inteligente"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const BUSINESS_CATEGORIES = [
  { value: "comida", label: "🍕 Comida y Bebidas" },
  { value: "ropa", label: "👕 Ropa y Accesorios" },
  { value: "tecnologia", label: "💻 Tecnología" },
  { value: "belleza", label: "💄 Belleza y Cuidado" },
  { value: "servicios", label: "🔧 Servicios" },
  { value: "artesanias", label: "🎨 Artesanías" },
  { value: "otro", label: "📦 Otro" },
] as const

export const BUSINESS_THEMES = [
  { value: "minimalista", label: "Minimalista", description: "Limpio y elegante" },
  { value: "premium", label: "Premium", description: "Lujoso y sofisticado" },
  { value: "artesanal", label: "Artesanal", description: "Cálido y auténtico" },
  { value: "moderno", label: "Moderno", description: "Fresco y contemporáneo" },
  { value: "callejero", label: "Callejero", description: "Urbano y vibrante" },
] as const

export const BUSINESS_TONES = [
  { value: "amigable", label: "Amigable y cercano" },
  { value: "profesional", label: "Profesional y formal" },
  { value: "divertido", label: "Divertido y energético" },
  { value: "elegante", label: "Elegante y sofisticado" },
  { value: "casual", label: "Casual y relajado" },
] as const

export const THEME_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  minimalista: { primary: "#1a1a2e", secondary: "#16213e", accent: "#0f3460" },
  premium:     { primary: "#1a1a1a", secondary: "#2d2d2d", accent: "#c9a84c" },
  artesanal:   { primary: "#5d4037", secondary: "#795548", accent: "#ff8f00" },
  moderno:     { primary: "#6c63ff", secondary: "#3d3d8e", accent: "#ff6584" },
  callejero:   { primary: "#212121", secondary: "#424242", accent: "#ffeb3b" },
}

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  productos: "/productos",
  marketing: "/marketing",
  imagenes: "/imagenes",
  agente: "/agente",
  bot: "/bot",
  metricas: "/metricas",
  tienda: (slug: string) => `/tienda/${slug}`,
} as const

export const AI_MODELS = {
  fast:    "llama-3.1-8b-instant",
  smart:   "llama-3.3-70b-versatile",
  creative: "mixtral-8x7b-32768",
} as const
