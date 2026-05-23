import { create } from "zustand"
import { persist } from "zustand/middleware"

interface BusinessState {
  currentUser: any | null
  currentBusiness: any | null
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: any | null) => void
  setBusiness: (business: any | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  currentUser: null,
  currentBusiness: null,
  isLoading: false,
  error: null,
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (currentUser) => set({ currentUser }),

      setBusiness: (currentBusiness) => set({ currentBusiness }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: "vendemasIA-business",
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentBusiness: state.currentBusiness,
      }),
    }
  )
)
