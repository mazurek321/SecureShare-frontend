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
      const rawError = err.message || ''
      if (rawError.toLowerCase().includes('fetch failed')) {
        setError('Connection failed. Please check your internet connection or try again later.')
      } else {
        setError(rawError || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-800 to-zinc-900 px-4 text-white">
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden xl:block">
        <div className="absolute -top-32 left-[calc(50%-45rem)] h-[35rem] w-[35rem] rounded-full bg-emerald-400/15 blur-[120px]" />
        <div className="absolute top-1/4 right-[calc(50%-48rem)] h-[40rem] w-[40rem] rounded-full bg-cyan-400/15 blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-[calc(50%-40rem)] h-[35rem] w-[35rem] rounded-full bg-lime-400/10 blur-[120px]" />
      </div>

      <div className="absolute inset-0 -z-10 bg-zinc-950/40 backdrop-blur-[4px]" />

      <form 
        onSubmit={handleRegister} 
        className="w-full max-w-md rounded-3xl border border-zinc-500/30 bg-zinc-900/75 p-8 backdrop-blur-[80px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <h1 className="mb-6 text-3xl font-black text-zinc-100">Create Account</h1>

        {error && (
          <div className="mb-4 rounded-xl border-2 border-red-500 bg-red-950/90 p-3 text-sm text-red-200 font-semibold shadow-md">
            {error}
          </div>
        )}

        <input
          className="mb-3 w-full rounded-xl bg-zinc-950/50 p-3 text-zinc-100 placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500/50 transition font-medium"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="mb-3 w-full rounded-xl bg-zinc-950/50 p-3 text-zinc-100 placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500/50 transition font-medium"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="mb-6 w-full rounded-xl bg-zinc-950/50 p-3 text-zinc-100 placeholder-zinc-500 outline-none border border-zinc-700 focus:border-emerald-500/50 transition font-medium"
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 p-3 font-bold text-black cursor-pointer disabled:opacity-50 hover:bg-emerald-400 transition shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>

        <div className="mt-4 text-center text-sm font-medium">
          <Link href="/auth/login" className="text-zinc-400 hover:text-white transition">
            Already have an account? <span className="text-emerald-400 font-semibold hover:underline">Login</span>
          </Link>
        </div>
      </form>
    </div>
  )
}