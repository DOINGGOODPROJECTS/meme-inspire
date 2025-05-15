import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Meme {
  id: string
  imageUrl: string
  topText: string
  bottomText: string
  textColor: string
  fontSize: number
  textShadow: boolean
  filter: string
  createdAt: number
  userId: string | null
  userName: string | null
  likes: number
  userLiked?: boolean
}

interface MemeState {
  memes: Meme[]
  addMeme: (meme: Omit<Meme, "id" | "createdAt" | "likes">) => string
  likeMeme: (id: string) => void
  unlikeMeme: (id: string) => void
  getUserMemes: (userId: string) => Meme[]
  getMemeById: (id: string) => Meme | undefined
  deleteMeme: (id: string) => void
}

export const useMemeStore = create<MemeState>()(
  persist(
    (set, get) => ({
      memes: [],

      addMeme: (meme) => {
        const id = `meme_${Date.now()}`
        const newMeme: Meme = {
          ...meme,
          id,
          createdAt: Date.now(),
          likes: 0,
        }

        set((state) => ({
          memes: [newMeme, ...state.memes],
        }))

        return id
      },

      likeMeme: (id) => {
        set((state) => ({
          memes: state.memes.map((meme) =>
            meme.id === id ? { ...meme, likes: meme.likes + 1, userLiked: true } : meme,
          ),
        }))
      },

      unlikeMeme: (id) => {
        set((state) => ({
          memes: state.memes.map((meme) =>
            meme.id === id && meme.likes > 0 ? { ...meme, likes: meme.likes - 1, userLiked: false } : meme,
          ),
        }))
      },

      getUserMemes: (userId) => {
        return get().memes.filter((meme) => meme.userId === userId)
      },

      getMemeById: (id) => {
        return get().memes.find((meme) => meme.id === id)
      },

      deleteMeme: (id) => {
        set((state) => ({
          memes: state.memes.filter((meme) => meme.id !== id),
        }))
      },
    }),
    {
      name: "meme-storage",
    },
  ),
)
