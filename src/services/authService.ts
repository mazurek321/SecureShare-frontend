export interface AuthResponse {
  username: string
  role: string 
}

export interface AuthCredentials {
  username: string
  password: string
}

const AUTH_BASE_URL = '/api/auth'

async function handleAuthResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!response.ok) {
    throw new Error(text || `Błąd HTTP: ${response.status}`)
  }
  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

export const authService = {
  async register(credentials: AuthCredentials): Promise<void> {
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await fetch(`${AUTH_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
    
    return handleAuthResponse<void>(response)
  },

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/login-cookie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      }),
    })
    
    return handleAuthResponse<AuthResponse>(response)
  },

  async logout(): Promise<void> {
    const response = await fetch(`${AUTH_BASE_URL}/logout`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Wylogowanie nie powiodło się')
    }
  },

  async getMe(): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return handleAuthResponse<AuthResponse>(response)
  },
}