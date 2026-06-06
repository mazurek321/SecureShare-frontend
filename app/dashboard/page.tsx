'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import SidebarTabs from '../../components/sidebarTabs'
import FilesTable from '../../components/filesTable'
import UsersTable from '../../components/usersTable'
import FileRequestsTable from '../../components/fileRequestTable'
import DashboardHeader from '../../components/dashboardHeader'
import { fileService, type FileItem } from '../../src/services/fileService'
import { adminService } from '../../src/services/adminService'
import { authService } from '../../src/services/authService' // DODAJ TEN IMPORT

export type User = {
  username: string
  role: string
}

export type FileRequest = {
  id: number | string
  fileId: number | string
  fileName: string
  requestedBy: string
}

export type UserResponse = {
  id: string
  username: string
  role: string
  email?: string
}

function getCookie(name: string) {
  if (typeof window === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return null
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'shared' | 'users' | 'requests'>('all')

  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  
  const [files, setFiles] = useState<FileItem[]>([])
  const [requests, setRequests] = useState<FileRequest[]>([])
  const [usersList, setUsersList] = useState<UserResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await authService.getMe()
        setUser({
          username: userData.username,
          role: userData.role
        })
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

const isAdmin = user?.role === 'ADMIN'


  useEffect(() => {
    if (!user && activeTab !== 'all') {
      setActiveTab('all')
    }
  }, [user, activeTab])

  useEffect(() => {
    async function loadDashboardData() {
      setError(null)
      try {
        if (selectedUser) {
          const targetUser = await fileService.searchUserByUsername(selectedUser)
          const userFiles = await fileService.getUserFiles(targetUser.username)
          setFiles(userFiles)
          return
        }

        switch (activeTab) {
          case 'all': {
            const publicFiles = await fileService.getPublicFiles()
            setFiles(publicFiles)
            break
          }
          case 'my': {
            if (!user) return
            const myFiles = await fileService.getMyFiles()
            setFiles(myFiles)
            break
          }
          case 'shared': {
            if (!user) return
            const sharedFiles = await fileService.getSharedWithMe()
            setFiles(sharedFiles)
            break
          }
          case 'requests': {
            if (!user) return
            const pendingRequests = await fileService.getPendingRequests()
            setRequests(pendingRequests)
            break
          }
          case 'users': {
            if (isAdmin) {
              const users = await adminService.getUsers()
              const mappedUsers = users.map((u: any) => ({
                ...u,
                email: u.email || ''
              }))
              setUsersList(mappedUsers)
            }
            break
          }
          default:
            break
        }
      } catch (err: any) {
        setError(err.message || 'Wystąpił błąd podczas pobierania danych z serwera.')
      }
    }

    loadDashboardData()
  }, [activeTab, selectedUser, user, isAdmin])

  const handleApproveRequest = async (requestId: string | number, fileId: string | number, targetUserId: string | number) => {
    if (!user) return
    try {
      await fileService.grantAccess(fileId, targetUserId)
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
    } catch (err: any) {
      setError(err.message || 'Nie udało się zatwierdzić prośby.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-400 p-8 flex items-center justify-center">
        Weryfikacja sesji użytkownika...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950/50 text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-lime-500/10 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-md p-6 shadow-lg shadow-black/30">
          <DashboardHeader user={user} setUser={setUser} router={router} />
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-md p-6 shadow-lg shadow-black/30">
          <SidebarTabs
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setSelectedUser(null) 
              setActiveTab(tab)
            }}
            isAdmin={isAdmin}
            search={search}
            setSearch={setSearch}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            user={user}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-md p-6 shadow-lg shadow-black/30">
          {activeTab === 'users' && isAdmin ? (
            <UsersTable usersList={usersList as any} setUsersList={setUsersList as any} />
          ) : null}

          {activeTab === 'requests' && user ? (
            <FileRequestsTable
              requests={requests}
              setRequests={setRequests}
              onApprove={handleApproveRequest}
            />
          ) : null}

          {activeTab !== 'users' && activeTab !== 'requests' ? (
            <FilesTable
              files={files}
              isAdmin={isAdmin}
              setAllFiles={setFiles}
              currentUsername={user?.username}
            />
          ) : null}
        </div>
      </div>
    </main>
  )
}