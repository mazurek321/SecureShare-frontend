'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Download, Clock, Trash2 } from 'lucide-react'

type FileItem = {
  id: number
  name: string
  status: 'SAFE' | 'SCANNING' | 'PRIVATE_REQUEST' | 'PENDING' | 'APPROVED'
  owner: string
}

type User = {
  email: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'shared' | 'users'>('all')
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const isAdmin = user?.role === 'ADMIN'

  const users = ['Anna', 'Marek', 'Kasia', 'John', 'Ola']

  const userFilesMap: Record<string, FileItem[]> = {
    Anna: [
      { id: 101, name: 'anna-cv.pdf', status: 'SAFE', owner: 'Anna' },
      { id: 102, name: 'anna-notes.txt', status: 'SAFE', owner: 'Anna' },
    ],
    Marek: [{ id: 201, name: 'marek-project.zip', status: 'SAFE', owner: 'Marek' }],
    Kasia: [{ id: 301, name: 'kasia-design.fig', status: 'SAFE', owner: 'Kasia' }],
    John: [{ id: 401, name: 'john-report.pdf', status: 'SAFE', owner: 'John' }],
    Ola: [{ id: 501, name: 'ola-assets.zip', status: 'SAFE', owner: 'Ola' }],
  }

  const [allFiles, setAllFiles] = useState<FileItem[]>([
    { id: 1, name: 'my-report.pdf', status: 'SAFE', owner: 'Ja' },
    { id: 2, name: 'design.png', status: 'SCANNING', owner: 'Ja' },
    { id: 3, name: 'secret.pdf', status: 'PRIVATE_REQUEST', owner: 'Ja' },
    { id: 4, name: 'team-share.pdf', status: 'SAFE', owner: 'Ja' },
    { id: 5, name: 'confidential.pdf', status: 'PENDING', owner: 'Ja' },
    { id: 6, name: 'client-doc.pdf', status: 'APPROVED', owner: 'Anna' },
  ])

  const [usersList, setUsersList] = useState([
    { email: 'anna@mail.com', role: 'USER' },
    { email: 'marek@mail.com', role: 'USER' },
    { email: 'kasia@mail.com', role: 'USER' },
    { email: 'admin@mail.com', role: 'ADMIN' },
  ])

  const filteredUsers = users.filter((u) =>
    u.toLowerCase().includes(search.toLowerCase())
  )

  const files =
    selectedUser
      ? userFilesMap[selectedUser] || []
      : activeTab === 'all'
      ? allFiles
      : activeTab === 'my'
      ? allFiles.filter((f) => f.owner === 'Ja')
      : activeTab === 'shared'
      ? allFiles.filter((f) => f.owner !== 'Ja')
      : allFiles

  const handleDownload = (file: FileItem) => {
    const blob = new Blob([`Fake download content for ${file.name}`], {
      type: 'text/plain',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const requestAccess = (file: FileItem) => {
    alert(`Access requested: ${file.name}`)
  }

  const deleteFile = (fileId: number) => {
    setAllFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getButton = (file: FileItem) => {
    if (file.status === 'PRIVATE_REQUEST') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            requestAccess(file)
          }}
          className="cursor-pointer rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300 hover:bg-yellow-500/20"
        >
          Request access
        </button>
      )
    }

    if (file.status === 'PENDING') {
      return (
        <button className="cursor-pointer text-orange-300">
          <Clock className="h-5 w-5" />
        </button>
      )
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleDownload(file)
        }}
        className="cursor-pointer text-zinc-400 hover:text-white"
      >
        <Download className="h-4 w-4" />
      </button>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-900/60 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-green-400">Dashboard</h1>
            <div className="mt-3 h-[2px] w-full bg-gradient-to-r from-green-400 via-emerald-300 to-transparent opacity-80" />
          </div>

          {!user ? (
            <div className="flex gap-4">
              <Link href="/auth/login" className="cursor-pointer rounded bg-green-500 px-4 py-2 text-black font-semibold">
                Login
              </Link>
              <Link href="/auth/register" className="cursor-pointer rounded border border-white/10 px-4 py-2">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/account" className="cursor-pointer rounded-full bg-green-500 px-4 py-2 text-black font-semibold">
                Account
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  setUser(null)
                  router.push('/')
                }}
                className="cursor-pointer rounded-full border border-red-500/30 px-4 py-2 text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/15 px-4 py-3 text-green-300">
            <p>
              Viewing files owned by{' '}
              <span className="font-semibold text-green-200">{selectedUser}</span>
            </p>

            <button
              onClick={() => setSelectedUser(null)}
              className="cursor-pointer text-xs text-zinc-300 underline hover:text-white"
            >
              Clear
            </button>
          </div>
        )}

        {user && (
          <div className="mb-6 flex items-center justify-between border-b border-white/10">
            <div className="flex gap-6">
              <button
                onClick={() => {
                  setActiveTab('all')
                  setSelectedUser(null)
                }}
                className={activeTab === 'all' ? 'cursor-pointer text-green-300 border-b-2 border-green-400 pb-3' : 'cursor-pointer text-zinc-500 pb-3'}
              >
                All files
              </button>

              <button
                onClick={() => {
                  setActiveTab('my')
                  setSelectedUser(null)
                }}
                className={activeTab === 'my' ? 'cursor-pointer text-green-300 border-b-2 border-green-400 pb-3' : 'cursor-pointer text-zinc-500 pb-3'}
              >
                My files
              </button>

              <button
                onClick={() => {
                  setActiveTab('shared')
                  setSelectedUser(null)
                }}
                className={activeTab === 'shared' ? 'cursor-pointer text-green-300 border-b-2 border-green-400 pb-3' : 'cursor-pointer text-zinc-500 pb-3'}
              >
                Shared for me
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('users')
                    setSelectedUser(null)
                  }}
                  className={activeTab === 'users' ? 'cursor-pointer text-yellow-300 border-b-2 border-yellow-400 pb-3' : 'cursor-pointer text-zinc-500 pb-3'}
                >
                  Users
                </button>
              )}
            </div>

            <div className="relative w-72">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
              />

              {search && (
                <div className="absolute mt-2 w-full rounded-xl border border-white/10 bg-zinc-950">
                  {filteredUsers.map((u) => (
                    <div
                      key={u}
                      onClick={() => {
                        setSelectedUser(u)
                        setSearch('')
                      }}
                      className="cursor-pointer px-4 py-3 hover:bg-white/10"
                    >
                      {u}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && isAdmin ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 divide-y divide-white/10">
            {usersList.map((u) => (
              <div key={u.email} className="flex items-center justify-between p-6">
                <span>{u.email}</span>

                <select
                  value={u.role}
                  onChange={(e) =>
                    setUsersList((prev) =>
                      prev.map((usr) =>
                        usr.email === u.email
                          ? { ...usr, role: e.target.value }
                          : usr
                      )
                    )
                  }
                  className="cursor-pointer bg-black border border-white/20 px-2 py-1"
                >
                  <option value="USER">USER</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-zinc-800/50 divide-y divide-white/10">
            {files.length === 0 ? (
              <div className="p-6 text-zinc-400">No files</div>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-6 hover:bg-white/5"
                >
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-zinc-400">by {file.owner}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getButton(file)}

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFile(file.id)
                        }}
                        className="cursor-pointer text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}