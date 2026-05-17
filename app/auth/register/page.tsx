'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!res.ok) {
        throw new Error('Registration failed')
      }

      router.push('/auth/login')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900/60 px-4 text-white">
      <form
        onSubmit={handleRegister}
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
          Create Account
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
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
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <div className="mt-4 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-green-400 transition hover:text-green-300 hover:underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  )
}