'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Users, Upload } from 'lucide-react'

type User = {
  email: string
  role: string
}

type FileItem = {
  id: number
  name: string
}

type ShareMap = Record<number, string[]>

type AccessLevel = 'public' | 'logged' | 'request'

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)

  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [shareInput, setShareInput] = useState('')
  const [shares, setShares] = useState<ShareMap>({
    1: ['Anna', 'Marek'],
  })

  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('request')

  const router = useRouter()

  const [myFiles, setMyFiles] = useState<FileItem[]>([
    { id: 1, name: 'private-notes.pdf' },
    { id: 2, name: 'invoice.docx' },
  ])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/dashboard')
  }

  const handleUploadConfirm = () => {
    if (!uploadFile) return

    const newFile: FileItem = {
      id: Date.now(),
      name: uploadFile.name,
    }

    setMyFiles((prev) => [newFile, ...prev])

    setUploadFile(null)
    setUploadOpen(false)
    setAccessLevel('request')
  }

  const handleDeleteMyFile = (id: number) => {
    setMyFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const addPerson = () => {
    if (!selectedFile || !shareInput.trim()) return

    setShares((prev) => {
      const current = prev[selectedFile.id] || []
      return {
        ...prev,
        [selectedFile.id]: [...current, shareInput.trim()],
      }
    })

    setShareInput('')
  }

  const removePerson = (fileId: number, name: string) => {
    setShares((prev) => ({
      ...prev,
      [fileId]: (prev[fileId] || []).filter((p) => p !== name),
    }))
  }

  if (!user) {
    return <div className="p-10 text-white">You are not logged in.</div>
  }

  return (
    <main className="min-h-screen bg-zinc-900/60 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer text-sm text-zinc-400 hover:text-white transition"
          >
            ← Back to dashboard
          </button>

          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 transition"
          >
            Logout
          </button>
        </div>

        <h1 className="mb-8 text-4xl font-black">Account</h1>

        <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-md p-6 shadow-lg shadow-black/30">
          <h2 className="mb-4 text-xl font-bold">Account information</h2>

          <p className="text-zinc-400 text-sm">Email</p>
          <p className="mb-4 font-semibold">{user.email}</p>

          <p className="text-zinc-400 text-sm">Role</p>
          <p className="font-semibold text-green-400">{user.role}</p>
        </div>

        <div
          onClick={() => setUploadOpen(true)}
          className="mb-8 cursor-pointer rounded-2xl border border-green-500/20 bg-green-500/10 p-6 hover:bg-green-500/15 transition backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <Upload className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-lg font-bold">Upload file</p>
              <p className="text-sm text-zinc-400">
                Add new file to your account
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-md divide-y divide-white/10 shadow-lg shadow-black/30">
          {myFiles.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFile(f)}
              className="flex cursor-pointer items-center justify-between p-6 hover:bg-white/5 transition"
            >
              <div>
                <p className="font-semibold">{f.name}</p>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                  <Users className="h-3 w-3" />
                  Click to manage sharing
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteMyFile(f.id)
                }}
                className="cursor-pointer text-red-400 hover:text-red-300 transition"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedFile && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="w-[520px] rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold">
              Share file: {selectedFile.name}
            </h2>

            <div className="mb-4 flex gap-2">
              <input
                value={shareInput}
                onChange={(e) => setShareInput(e.target.value)}
                placeholder="Enter username"
                className="cursor-pointer flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-green-500/50"
              />

              <button
                onClick={addPerson}
                className="cursor-pointer rounded-xl bg-green-500 px-4 py-2 text-black font-semibold hover:bg-green-400 transition"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {(shares[selectedFile.id] || []).map((person) => (
                <div
                  key={person}
                  className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-2"
                >
                  <span>{person}</span>

                  <button
                    onClick={() => removePerson(selectedFile.id, person)}
                    className="cursor-pointer text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedFile(null)}
              className="cursor-pointer mt-6 w-full rounded-xl bg-green-500 py-2 text-black font-semibold hover:bg-green-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {uploadOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setUploadOpen(false)}
        >
          <div
            className="w-[520px] rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold">Upload file</h2>

            <div className="mb-5">
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={(e) =>
                  setUploadFile(e.target.files?.[0] || null)
                }
              />

              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition"
              >
                <Upload className="mb-2 h-6 w-6 text-green-400" />

                <p className="font-semibold">
                  {uploadFile ? 'Change file' : 'Choose file'}
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Click to select a file from your device
                </p>
              </label>

              {uploadFile && (
                <p className="mt-2 text-sm text-green-400">
                  Selected: {uploadFile.name}
                </p>
              )}
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-sm text-zinc-400">
                Who can access this file?
              </p>

              {[
                {
                  value: 'public',
                  title: 'Public',
                  desc: 'Anyone can view this file',
                },
                {
                  value: 'logged',
                  title: 'Logged-in users',
                  desc: 'Only authenticated users can access',
                },
                {
                  value: 'request',
                  title: 'Access on request',
                  desc: 'Requires approval before access',
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer block rounded-xl border p-3 transition ${
                    accessLevel === opt.value
                      ? 'border-green-500/40 bg-green-500/10'
                      : 'border-white/10 bg-black/20'
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={accessLevel === opt.value}
                    onChange={() =>
                      setAccessLevel(opt.value as AccessLevel)
                    }
                  />

                  <p className="font-semibold">{opt.title}</p>
                  <p className="text-xs text-zinc-400">{opt.desc}</p>
                </label>
              ))}
            </div>

            <button
              onClick={handleUploadConfirm}
              className="cursor-pointer w-full rounded-xl bg-green-500 py-2 text-black font-semibold hover:bg-green-400 transition"
            >
              Confirm upload
            </button>

            <button
              onClick={() => setUploadOpen(false)}
              className="cursor-pointer mt-2 w-full rounded-xl bg-zinc-800 py-2 hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  )
}