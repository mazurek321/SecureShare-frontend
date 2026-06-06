'use client'

import { useState } from 'react'
import { Download, ShieldAlert, Trash2, User } from 'lucide-react'
import { fileService, FileItem, AccessRequest } from '../src/services/fileService'
import { adminService } from '../src/services/adminService'
import AccessRequestModal from './AccessRequestModal'

interface FilesTableProps {
  files: FileItem[]
  isAdmin: boolean
  setAllFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  currentUsername?: string
  pendingRequests?: AccessRequest[]
}

export default function FilesTable({ files = [], isAdmin, setAllFiles, currentUsername, pendingRequests = [] }: FilesTableProps) {
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null)
  const [tableError, setTableError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ id: string; name: string; alreadySent: boolean } | null>(null)

  const checkIsAlreadyRequested = (fileId: string) => {
    const hasPending = pendingRequests.some((req) => String(req.fileId) === String(fileId))
    if (hasPending) return true

    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split('; ')
      const cookie = cookies.find(row => row.startsWith('sent_requests='))
      if (cookie) {
        const val = cookie.split('=')[1]
        const ids = val ? val.split(',') : []
        return ids.includes(fileId)
      }
    }
    return false
  }

  const handleDownload = async (file: FileItem) => {
    setActionLoadingId(file.id)
    setTableError(null)
    try {
      const blob = await fileService.downloadFile(file.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name || file.originalFilename || 'file'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err: any) {
      const errMsg = err.message || 'Download failed.'
      
      if (errMsg.includes('Brak uprawnień') || errMsg.includes('403') || errMsg.includes('Status: 403')) {
        setSelectedFile({
          id: file.id,
          name: file.name || file.originalFilename,
          alreadySent: checkIsAlreadyRequested(file.id)
        })
        setIsModalOpen(true)
      } else {
        setTableError(errMsg)
      }
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure?')) return
    setActionLoadingId(fileId)
    setTableError(null)
    try {
      await fileService.deleteFile(fileId)
      setAllFiles((prev) => (Array.isArray(prev) ? prev.filter((f) => f.id !== fileId) : []))
    } catch (err: any) {
      setTableError(err.message || 'Delete failed.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleAdminDelete = async (fileId: string) => {
    if (!confirm('Are you sure?')) return
    setActionLoadingId(fileId)
    setTableError(null)
    try {
      await adminService.deleteFile(fileId)
      setAllFiles((prev) => (Array.isArray(prev) ? prev.filter((f) => f.id !== fileId) : []))
    } catch (err: any) {
      setTableError(err.message || 'Delete failed.')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Files library</h2>
      </div>

      {tableError && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{tableError}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm text-left text-zinc-300">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Owner</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!files || files.length === 0 ? (
              <tr>
                <td className="p-4 text-zinc-500" colSpan={3}>No files found</td>
              </tr>
            ) : (
              files.map((f) => {
                const fileOwner = typeof f.owner === 'object' && f.owner !== null 
                  ? (f.owner as any).username 
                  : (f.owner || (f as any).ownerUsername || 'Unknown')

                const isMyFile = currentUsername && String(fileOwner).toLowerCase() === String(currentUsername).toLowerCase()

                return (
                  <tr key={f.id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                    <td className="p-3 font-medium text-white max-w-[200px] truncate">{f.name || f.originalFilename}</td>
                    <td className="p-3 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-zinc-500" />
                        <span className={isMyFile ? 'text-emerald-400' : 'text-zinc-300'}>
                          {fileOwner} {isMyFile && '(You)'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDownload(f)} disabled={actionLoadingId !== null} className="cursor-pointer p-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-30">
                          <Download className="h-4 w-4" />
                        </button>
                        {isMyFile ? (
                          <button onClick={() => handleDelete(f.id)} disabled={actionLoadingId !== null} className="cursor-pointer p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) :
                        isAdmin && (
                          <button onClick={() => handleAdminDelete(f.id)} disabled={actionLoadingId !== null} className="cursor-pointer p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedFile && (
        <AccessRequestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedFile(null)
          }}
          fileId={selectedFile.id}
          fileName={selectedFile.name}
          initialAlreadySent={selectedFile.alreadySent}
        />
      )}
    </div>
  )
}