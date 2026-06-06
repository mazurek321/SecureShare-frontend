'use client'

import { useState } from 'react'
import { Download, ShieldAlert, Trash2, SendHorizontal } from 'lucide-react'
import { fileService } from '../src/services/fileService'

export type FileItem = {
  id: number | string
  name: string
  originalFilename?: string
  owner: string | { id: string | number; username: string }
  isPublic?: boolean
  accessLevel?: string
  status?: string
}

interface FilesTableProps {
  files: FileItem[]
  isAdmin: boolean
  currentUsername?: string
  setAllFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
}

export default function FilesTable({ files = [], isAdmin, currentUsername, setAllFiles }: FilesTableProps) {
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null)
  const [tableError, setTableError] = useState<string | null>(null)

  const getOwnerName = (ownerField: FileItem['owner']): string => {
    if (!ownerField) return 'Unknown'
    if (typeof ownerField === 'object') {
      return ownerField.username
    }
    return ownerField
  }

  const isOwner = (file: FileItem): boolean => {
    const ownerName = getOwnerName(file.owner)
    if (ownerName === 'Ja') return true
    if (currentUsername && ownerName.toLowerCase() === currentUsername.toLowerCase()) return true
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
      a.download = file.name || file.originalFilename || 'download'
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err: any) {
      setTableError(err.message || `Nie udało się pobrać pliku ${file.name}`)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleRequestAccess = async (file: FileItem) => {
    setActionLoadingId(file.id)
    setTableError(null)
    try {
      await fileService.requestAccess(file.id)
      alert(`Wysłano prośbę o dostęp do pliku: ${file.name}`)
    } catch (err: any) {
      setTableError(err.message || 'Nie udało się wysłać prośby o dostęp.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (fileId: string | number) => {
    if (!confirm('Czy na pewno chcesz bezpowrotnie usunąć ten plik?')) return
    setActionLoadingId(fileId)
    setTableError(null)
    try {
      await fileService.deleteFile(fileId)
      setAllFiles((prev) => (Array.isArray(prev) ? prev.filter((f) => f.id !== fileId) : []))
    } catch (err: any) {
      setTableError(err.message || 'Błąd podczas usuwania pliku.')
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

      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 backdrop-blur-md">
        <table className="w-full text-sm text-left text-zinc-300">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Access Policy</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!files || files.length === 0 ? (
              <tr>
                <td className="p-6 text-zinc-500 text-center" colSpan={4}>
                  No files found in this section
                </td>
              </tr>
            ) : (
              files.map((f) => {
                const ownerName = getOwnerName(f.owner)
                const canDelete = isAdmin || isOwner(f)

                return (
                  <tr key={f.id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                    <td className="p-3 font-medium text-white max-w-[240px] truncate" title={f.name}>
                      {f.name}
                    </td>
                    <td className="p-3 text-zinc-400">
                      {ownerName}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium uppercase ${
                        f.isPublic || f.accessLevel === 'PUBLIC'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border border-white/5'
                      }`}>
                        {f.accessLevel || (f.isPublic ? 'PUBLIC' : 'RESTRICTED')}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(f)}
                          disabled={actionLoadingId !== null}
                          className="cursor-pointer p-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Pobierz plik"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        {!isOwner(f) && (
                          <button
                            onClick={() => handleRequestAccess(f)}
                            disabled={actionLoadingId !== null}
                            className="cursor-pointer px-3 py-1.5 text-xs rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <SendHorizontal className="h-3 w-3" />
                            Request Access
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleDelete(f.id)}
                            disabled={actionLoadingId !== null}
                            className="cursor-pointer p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Usuń plik"
                          >
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
    </div>
  )
}