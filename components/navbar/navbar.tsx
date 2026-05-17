'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

export function Navbar() {
  const user = useAuthStore((state) => state.user)

  return (
    <nav className="border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-green-400" />

          <span className="text-lg font-bold">SecureShare</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/files">Files</Link>

          {user?.role === 'ADMIN' && (
            <Link href="/admin">Admin</Link>
          )}
        </div>
      </div>
    </nav>
  )
}