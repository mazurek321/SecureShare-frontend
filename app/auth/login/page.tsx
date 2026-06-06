'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '../../../src/services/authService'

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await authService.login({ username, password })
      router.push('/dashboard')
    } catch (err: any) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900/60 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/80 p-8 backdrop-blur-md"
      >
        <h1 className="mb-6 text-3xl font-bold">Login</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <input
          className="mb-3 w-full rounded-xl bg-black/40 p-3 outline-none border border-white/5 focus:border-green-500/50 transition"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="mb-6 w-full rounded-xl bg-black/40 p-3 outline-none border border-white/5 focus:border-green-500/50 transition"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-green-500 p-3 font-semibold text-black cursor-pointer disabled:opacity-50 hover:bg-green-400 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center text-sm">
          <Link href="/auth/register" className="text-zinc-400 hover:text-white transition">
            Don't have an account? <span className="text-green-400 hover:underline">Register</span>
          </Link>
        </div>
      </form>
    </div>
  )
}