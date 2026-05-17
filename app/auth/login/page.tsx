'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { mockLogin } from '@/lib/mock-api'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await mockLogin(email, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900/60 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="
          w-full max-w-md
          rounded-3xl
          border border-white/10
          bg-zinc-900/80
          backdrop-blur-md
          shadow-[0_0_40px_rgba(0,0,0,0.45)]
          p-8
        "
      >
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">
          Login
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm text-zinc-400">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="
              w-full rounded-xl
              border border-white/10
              bg-black/40
              p-3
              text-white
              outline-none
              transition
              placeholder:text-zinc-500
              focus:border-green-500/60
              focus:bg-black/60
            "
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-zinc-400">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
            className="
              w-full rounded-xl
              border border-white/10
              bg-black/40
              p-3
              text-white
              outline-none
              transition
              placeholder:text-zinc-500
              focus:border-green-500/60
              focus:bg-black/60
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-xl
            bg-green-500
            p-3
            font-semibold
            text-black
            transition
            hover:bg-green-400
            hover:shadow-lg hover:shadow-green-500/20
            cursor-pointer
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/auth/register"
            className="text-sm text-green-400 transition hover:text-green-300 hover:underline"
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  )
}