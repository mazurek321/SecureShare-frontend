'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Upload, X, FileUp, Download } from 'lucide-react'
import { fileService } from '../../src/services/fileService'
import { authService, AuthResponse } from '../../src/services/authService'

type FileItem = {
  id: number | string
  originalFilename: string
}

type AccessLevel = 'public' | 'request'

export default function AccountPage() {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [myFiles, setMyFiles] = useState<FileItem[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('request')
  const [isPublic, setIsPublic] = useState<boolean>(false)
  
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleAccessLevelChange = (val: AccessLevel) => {
    setAccessLevel(val)
    setIsPublic(val === 'public')
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await authService.getMe()
        setUser(userData)
      } catch (err: any) {
        router.push('/auth/login')
      }
    }
    loadUser()
  }, [router])

  useEffect(() => {
    if (user) {
      fetchMyFiles()
    }
  }, [user])

  async function fetchMyFiles() {
    try {
      const files = await fileService.getMyFiles()
      setMyFiles(Array.isArray(files) ? files : [])
    } catch (err: any) {
      setPageError(err.message || 'Failed to fetch files.')
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
      setPageError(null)
    }
  }

  const handleUploadConfirm = async () => {
    if (!uploadFile) return
    setLoading(true)
    setPageError(null)

    try {
      const backendAccessLevel = accessLevel === 'public' ? 'PUBLIC' : 'PRIVATE_REQUEST'
      await fileService.uploadFile(uploadFile, backendAccessLevel, isPublic)
      
      setUploadFile(null)
      setUploadOpen(false)
      setAccessLevel('request')
      setIsPublic(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      await fetchMyFiles()
    } catch (err: any) {
      setPageError(err.message || 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (file: FileItem) => {
    setActionLoadingId(file.id)
    setPageError(null)
    try {
      const blob = await fileService.downloadFile(file.id.toString())
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.originalFilename || 'file'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err: any) {
      setPageError(err.message || 'Download failed.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteMyFile = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    setPageError(null)

    try {
      await fileService.deleteFile(id.toString())
      setMyFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (err: any) {
      setPageError(err.message || 'Delete failed.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-400 p-8 flex items-center justify-center">
        Weryfikacja sesji konta...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-900/60 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="cursor-pointer text-sm text-zinc-400 hover:text-white transition">
            &larr; Back to dashboard
          </button>
          <button onClick={handleLogout} className="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 transition">
            Logout
          </button>
        </div>

        <h1 className="mb-8 text-4xl font-black">Account</h1>

        {pageError && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
            {pageError}
          </div>
        )}

        <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-md p-6 shadow-lg shadow-black/30">
          <h2 className="mb-4 text-xl font-bold">Account information</h2>
          <p className="text-zinc-400 text-sm">Username</p>
          <p className="mb-4 font-semibold">{user.username}</p>
          <p className="text-zinc-400 text-sm">Role</p>
          <p className="font-semibold text-green-400">{user.role || 'USER'}</p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="w-full text-left mb-8 cursor-pointer rounded-2xl border border-green-500/20 bg-green-500/10 p-6 hover:bg-green-500/15 transition backdrop-blur-md outline-none focus:border-green-500/40"
        >
          <div className="flex items-center gap-3">
            <Upload className="h-6 w-6 text-green-400" />
            <div>
              <p className="text-lg font-bold">Upload file</p>
              <p className="text-sm text-zinc-400">Add new file to your account</p>
            </div>
          </div>
        </button>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-md divide-y divide-white/10 shadow-lg shadow-black/30 overflow-hidden">
          <div className="p-4 bg-white/5 font-semibold text-sm text-zinc-300 px-6">My Files Inventory</div>
          {myFiles.length === 0 ? (
            <div className="p-6 text-zinc-400 text-sm">You haven't uploaded any files yet.</div>
          ) : (
            myFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <p className="font-semibold text-zinc-100">{f.originalFilename}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={actionLoadingId !== null}
                    onClick={() => handleDownload(f)}
                    className="cursor-pointer text-zinc-300 hover:text-white transition p-2 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    disabled={actionLoadingId !== null}
                    onClick={() => handleDeleteMyFile(f.id)}
                    className="cursor-pointer text-red-400 hover:text-red-300 transition p-2 rounded hover:bg-red-500/10 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {uploadOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50" onClick={() => !loading && setUploadOpen(false)}>
          <div className="w-[520px] rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload new file</h2>
              <button disabled={loading} onClick={() => setUploadOpen(false)} className="text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-5">
              <input id="fileInput" type="file" ref={fileInputRef} className="hidden" disabled={loading} onChange={handleFileChange} />
              <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/40 p-6 hover:bg-white/5 transition border-zinc-700 hover:border-green-500/40">
                <FileUp className="mb-2 h-8 w-8 text-green-400" />
                <p className="font-semibold">{uploadFile ? 'Change file' : 'Choose a file'}</p>
              </label>
              {uploadFile && <p className="mt-2 text-sm text-green-400 text-center">Selected: {uploadFile.name}</p>}
            </div>
            
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer text-zinc-300">
                <input type="checkbox" disabled={accessLevel === 'public'} checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-green-500" />
                Allow others to view
              </label>
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-sm text-zinc-400">Access Policy:</p>
              {[
                { value: 'public', title: 'Public', desc: 'Anyone can view' },
                { value: 'request', title: 'Private', desc: 'Specify who can view or dont allow anyone to view.' }
              ].map((opt) => (
                <label key={opt.value} className={`cursor-pointer block rounded-xl border p-3 ${accessLevel === opt.value ? 'border-green-500/40 bg-green-500/10' : 'border-white/10 bg-black/20'}`}>
                  <input type="radio" className="hidden" checked={accessLevel === opt.value} onChange={() => handleAccessLevelChange(opt.value as AccessLevel)} />
                  <p className="font-semibold text-sm">{opt.title}</p>
                  <p className="text-xs text-zinc-400">{opt.desc}</p>
                </label>
              ))}
            </div>
            <button disabled={loading || !uploadFile} onClick={handleUploadConfirm} className="w-full rounded-xl bg-green-500 py-2.5 text-black font-semibold hover:bg-green-400 transition text-sm">
              {loading ? 'Uploading...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}