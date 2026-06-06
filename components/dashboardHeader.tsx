'use client'

import Link from 'next/link'
import { authService } from '../src/services/authService'

export default function DashboardHeader({
  user,
  setUser,
  router,
  selectedUser,
}: any) {
  async function handleLogout() {
    try {
      await authService.logout()
      if (setUser) setUser(null)
      if (router) router.push('/')
    } catch (err) {
      console.error('Błąd podczas wylogowywania:', err)
    }
  }

  return (
    <div className="mb-10 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-black text-emerald-400">
          Dashboard
        </h1>

        <div className="mt-3 h-[2px] w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-transparent opacity-80" />

        {selectedUser && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
            Viewing user:
            <span className="font-semibold text-cyan-200">
              {selectedUser}
            </span>

            <button
              onClick={() => setUser?.(null) || router?.push?.('/')}
              className="ml-2 cursor-pointer text-xs text-cyan-200 underline hover:text-white"
            >
              clear
            </button>
          </div>
        )}
      </div>

      {!user ? (
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="cursor-pointer rounded bg-emerald-500 px-4 py-2 text-black font-semibold hover:bg-emerald-400"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="cursor-pointer rounded border border-white/10 px-4 py-2 hover:bg-white/5"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/account"
            className="cursor-pointer rounded-full bg-emerald-500 px-4 py-2 text-black font-semibold hover:bg-emerald-400"
          >
            Account
          </Link>

          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-full border border-red-500/30 px-4 py-2 text-red-300 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}