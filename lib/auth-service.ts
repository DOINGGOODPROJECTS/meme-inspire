// Service d'authentification simulé
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Stockage local pour simuler une base de données
const localStorageKey = "meme-inspire-users"

// Récupérer les utilisateurs du localStorage
const getStoredUsers = (): Record<string, { name: string; email: string; password: string }> => {
  if (typeof window === "undefined") return {}

  const stored = localStorage.getItem(localStorageKey)
  return stored ? JSON.parse(stored) : {}
}

// Enregistrer les utilisateurs dans le localStorage
const storeUsers = (users: Record<string, { name: string; email: string; password: string }>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, JSON.stringify(users))
  }
}

// Store Zustand pour l'authentification
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 500))

        const users = getStoredUsers()
        const user = Object.entries(users).find(([_, u]) => u.email === email)

        if (user && user[1].password === password) {
          set({
            user: {
              id: user[0],
              name: user[1].name,
              email: user[1].email,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user[1].name}`,
            },
            isAuthenticated: true,
          })
          return true
        }

        return false
      },

      register: async (name, email, password) => {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 500))

        const users = getStoredUsers()

        // Vérifier si l'email existe déjà
        if (Object.values(users).some((u) => u.email === email)) {
          return false
        }

        // Créer un nouvel utilisateur
        const userId = `user_${Date.now()}`
        users[userId] = { name, email, password }
        storeUsers(users)

        set({
          user: {
            id: userId,
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          },
          isAuthenticated: true,
        })

        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
