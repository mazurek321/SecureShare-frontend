import { create } from 'zustand'

interface User {
  id: string
  email: string
  role: 'GUEST' | 'USER' | 'MODERATOR' | 'ADMIN'
}

interface AuthStore {
  accessToken: string | null
  user: User | null

  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,  
  login: (token, user) => {
    sessionStorage.setItem('access_token', token)

    set({
      accessToken: token,
      user,
    })
  },

  logout: () => {
    sessionStorage.removeItem('access_token')

    set({
      accessToken: null,
      user: null,
    })
  },
}))