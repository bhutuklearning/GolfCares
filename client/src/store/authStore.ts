// @ts-nocheck
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockUser, mockSubscription } from '../mocks/mockData'

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
  useMockData: boolean
  login: (user: User, token: string, subscription: any) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
  updateSubscription: (data: any) => void
  enableMockMode: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      subscription: null,
      isAuthenticated: false,
      useMockData: false,

      login: (user, token, subscription) =>
        set({ user, token, subscription, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, subscription: null, isAuthenticated: false, useMockData: false }),

      updateUser: (data) =>
        set({ user: get().user ? { ...get().user!, ...data } : null }),

      updateSubscription: (data) => set({ subscription: data }),

      enableMockMode: () =>
        set({
          user: mockUser as User,
          token: 'mock-token-dev',
          subscription: mockSubscription,
          isAuthenticated: true,
          useMockData: true,
        }),
    }),
    { name: 'golfcares-auth' }
  )
)
