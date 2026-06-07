'use client'

import { useState, useEffect } from 'react'
import { fileService } from '../src/services/fileService'
import { ShieldAlert, Info } from 'lucide-react'

interface AccessRequestModalProps {
  isOpen: boolean
  onClose: () => void
  fileId: string
  fileName: string
  initialAlreadySent: boolean
}

export default function AccessRequestModal({ isOpen, onClose, fileId, fileName, initialAlreadySent }: AccessRequestModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isCached, setIsCached] = useState(false)
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)

  const cookieName = currentUsername ? `sent_requests_${currentUsername}` : null

  useEffect(() => {
    if (isOpen) {
      async function fetchCurrentUser() {
        try {
          const res = await fetch('/api/auth/me')
          if (res.ok) {
            const data = await res.json()
            if (data && data.username) {
              setCurrentUsername(data.username)
            }
          }
        } catch (err) {
          console.error('Failed to fetch user context for cookies', err)
        }
      }
      fetchCurrentUser()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setSuccess(false)
      setError(null)
      
      if (cookieName) {
        const cookies = document.cookie.split('; ')
        const cookie = cookies.find(row => row.startsWith(`${cookieName}=`))
        if (cookie) {
          const val = cookie.split('=')[1]
          const ids = val ? val.split(',') : []
          if (ids.includes(fileId)) {
            setIsCached(true)
            return
          }
        }
      }
      setIsCached(initialAlreadySent)
    }
  }, [isOpen, fileId, initialAlreadySent, cookieName])

  if (!isOpen) return null

  const handleRequest = async () => {
    setLoading(true)
    setError(null)
    try {
      await fileService.requestAccess(fileId)
      
      if (cookieName) {
        const cookies = document.cookie.split('; ')
        const cookie = cookies.find(row => row.startsWith(`${cookieName}=`))
        let ids: string[] = []
        if (cookie) {
          const val = cookie.split('=')[1]
          ids = val ? val.split(',') : []
        }
        if (!ids.includes(fileId)) {
          ids.push(fileId)
        }
        document.cookie = `${cookieName}=${ids.join(',')}; max-age=31536000; path=/`
      }
      
      setSuccess(true)
      setIsCached(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send access request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Access Request</h3>
        
        {success && (
          <div>
            <p className="text-zinc-300 text-sm mb-6">
              Your request to access the file <span className="text-emerald-400 font-medium">{fileName}</span> has been successfully sent.
            </p>
            <div className="flex justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition">
                Close
              </button>
            </div>
          </div>
        )}

        {isCached && !success && (
          <div>
            <div className="mb-4 rounded-xl bg-blue-500/10 p-3 text-sm text-blue-400 border border-blue-500/20 flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              <span className="font-medium">Request already sent.</span>
            </div>
            <p className="text-zinc-300 text-sm mb-6">
              Please wait for the owner of <span className="text-white font-medium">{fileName}</span> to approve your request. You do not need to resubmit it.
            </p>
            <div className="flex justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm transition">
                Close
              </button>
            </div>
          </div>
        )}

        {!success && !isCached && (
          <div>
            <p className="text-zinc-300 text-sm mb-4">
              You do not have permission to download <span className="text-white font-medium">{fileName}</span>. Would you like to request access from the owner?
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={onClose} disabled={loading} className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm transition">
                Cancel
              </button>
              <button onClick={handleRequest} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition">
                {loading ? 'Sending...' : 'Request Access'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}