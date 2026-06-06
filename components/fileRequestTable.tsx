'use client'

import { useState } from 'react'
import { Check, ShieldAlert, User, FileText } from 'lucide-react'
import { AccessRequest } from '../src/services/fileService'

interface FileRequestsTableProps {
  requests: AccessRequest[]
  setRequests: React.Dispatch<React.SetStateAction<AccessRequest[]>>
  onApprove: (requestId: string, fileId: string, targetUserId: string) => Promise<void>
}

export default function FileRequestsTable({ requests = [], setRequests, onApprove }: FileRequestsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async (req: AccessRequest, index: number) => {
    const currentId = req.id || `fallback-id-${index}`
    setLoadingId(currentId)
    setError(null)
    try {
      const targetUserId = 
        (req as any).requesterId || 
        (req as any).requestedById || 
        (req as any).userId || 
        (req as any).requesterUsername || 
        req.requestedBy

      if (!targetUserId || targetUserId === 'undefined') {
        throw new Error('Nie udało się wyodrębnić identyfikatora użytkownika.')
      }

      await onApprove(currentId, req.fileId, targetUserId)
    } catch (err: any) {
      setError(err.message || 'Nie udało się zatwierdzić prośby.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Pending Access Requests</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 backdrop-blur-md">
        <table className="w-full text-sm text-left text-zinc-300">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Requested By</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!requests || requests.length === 0 ? (
              <tr>
                <td className="p-6 text-zinc-500 text-center" colSpan={3}>
                  No pending access requests found
                </td>
              </tr>
            ) : (
              requests.map((req, index) => {
                const rowKey = req.id ? String(req.id) : `req-${req.fileId}-${(req as any).requesterUsername || index}-${index}`
                const displayFileName = req.fileName || (req as any).originalFilename || 'Unknown File'
                const displayUsername = (req as any).requesterUsername || req.requestedBy || 'Unknown User'

                return (
                  <tr key={rowKey} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                    <td className="p-3 font-medium text-white max-w-[240px] truncate">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-zinc-500 shrink-0" />
                        <span title={displayFileName}>{displayFileName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{displayUsername}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleApprove(req, index)}
                          disabled={loadingId !== null}
                          className="cursor-pointer px-3 py-1.5 text-xs rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          {loadingId === (req.id || `fallback-id-${index}`) ? 'Granting...' : 'Grant Access'}
                        </button>
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