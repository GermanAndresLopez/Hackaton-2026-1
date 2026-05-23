import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Business, Product, GeneratedContent } from "@/types"

interface BusinessState {
  currentBusiness: Business | null
  products: Product[]
  generatedContent: GeneratedContent[]
  isLoading: boolean
  error: string | null

  // Actions
  setBusiness: (business: Business | null) => void
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  removeProduct: (id: string) => void
  addGeneratedContent: (content: GeneratedContent) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  currentBusiness: null,
  products: [],
  generatedContent: [],
  isLoading: false,
  error: null,
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      ...initialState,

      setBusiness: (business) => set({ currentBusiness: business }),

      setProducts: (products) => set({ products }),

      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addGeneratedContent: (content) =>
        set((state) => ({
          generatedContent: [content, ...state.generatedContent].slice(0, 50),
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: "vendemasIA-business",
      partialize: (state) => ({
        currentBusiness: state.currentBusiness,
      }),
    }
  )
)
