'use client'

import { useState, useEffect } from 'react'
import { adminService, UserResponse } from '../src/services/adminService'

export default function UsersTable() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getUsers()
      .then(setUsers)
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, { newRole })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u))
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <div className="text-zinc-500 p-6">Loading users...</div>

  return (
    <div className="rounded-2xl border border-emerald-400/10 bg-zinc-950/50 backdrop-blur-xl overflow-hidden divide-y divide-emerald-400/10">
      {users.map((u) => (
        <div key={u.id} className="flex items-center justify-between p-6">
          <span className="text-zinc-200">{u.username}</span>
          <select
            value={u.role}
            onChange={(e) => handleRoleChange(u.id, e.target.value)}
            className="bg-slate-950/80 border border-white/10 px-3 py-1 rounded-lg text-zinc-200 cursor-pointer"
          >
            <option value="USER">USER</option>
            <option value="MODERATOR">MODERATOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      ))}
    </div>
  )
}