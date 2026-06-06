'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '../../../src/services/authService'

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await authService.register({ username, password })
      router.push('/auth/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900/60 px-4 text-white">
      <form onSubmit={handleRegister} className="w-full max-w-md rounded-3xl bg-zinc-900/80 p-8 border border-white/10 backdrop-blur-md">
        <h1 className="mb-6 text-3xl font-bold">Create Account</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        <input
          className="mb-3 w-full rounded-xl bg-black/40 p-3 outline-none"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="mb-3 w-full rounded-xl bg-black/40 p-3 outline-none"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="mb-6 w-full rounded-xl bg-black/40 p-3 outline-none"
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-green-500 p-3 font-semibold text-black cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>

        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-green-400 cursor-pointer hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}