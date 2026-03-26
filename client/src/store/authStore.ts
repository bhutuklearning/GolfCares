// @ts-nocheck
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  charityId: any
  charityContributionPercent: number
}

interface AuthState {
  user: User | null
  token: string | null
  subscription: any | null
  isAuthenticated: boolean
  login: (user: User, token: string, subscription?: any) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
  updateSubscription: (data: any) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      subscription: null,
      isAuthenticated: false,

      login: (user, token, subscription = null) =>
        set({ user, token, subscription, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, subscription: null, isAuthenticated: false }),

      updateUser: (data) =>
        set({ user: get().user ? { ...get().user!, ...data } : null }),

      updateSubscription: (data) => set({ subscription: data }),
    }),
    { name: 'golfcares-auth' }
  )
)
