'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import SidebarTabs from '../../components/sidebarTabs'
import FilesTable from '../../components/filesTable'
import UsersTable from '../../components/usersTable'
import FileRequestsTable from '../../components/fileRequestTable'
import DashboardHeader from '../../components/dashboardHeader'
import { fileService, type FileItem, type AccessRequest } from '../../src/services/fileService'
import { adminService } from '../../src/services/adminService'
import { authService } from '../../src/services/authService'

export type User = {
  username: string
  role: string
}

export type UserResponse = {
  id: string
  username: string
  role: string
  email: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'shared' | 'users' | 'requests'>('all')

  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  
  const [files, setFiles] = useState<FileItem[]>([])
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [usersList, setUsersList] = useState<UserResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    let isMounted = true
    async function loadUser() {
      try {
        const userData = await authService.getMe()
        if (isMounted) {
          setUser({
            username: userData.username,
            role: userData.role
          })
        }
      } catch (err) {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadUser()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (!user && activeTab !== 'all') {
      setActiveTab('all')
    }
  }, [user, activeTab])

  useEffect(() => {
    let isMounted = true
    
    async function loadDashboardData() {
      setError(null)
      try {
        if (selectedUser) {
          const targetUser = await fileService.searchUserByUsername(selectedUser)
          const userFiles = await fileService.getUserFiles(targetUser.username)
          if (isMounted) setFiles(userFiles)
          return
        }

        switch (activeTab) {
          case 'all': {
            const publicFiles = await fileService.getPublicFiles()
            if (isMounted) setFiles(publicFiles)
            break
          }
          case 'my': {
            if (!user) return
            const myFiles = await fileService.getMyFiles()
            if (isMounted) setFiles(myFiles)
            break
          }
          case 'shared': {
            if (!user) return
            const sharedFiles = await fileService.getSharedWithMe()
            if (isMounted) setFiles(sharedFiles)
            break
          }
          case 'requests': {
            if (!user) return
            const pendingRequests = await fileService.getPendingRequests()
            if (isMounted) setRequests(pendingRequests)
            break
          }
          case 'users': {
            if (isAdmin) {
              const users = await adminService.getUsers()
              const mappedUsers = users.map((u: any) => ({
                id: u.id,
                username: u.username,
                role: u.role,
                email: u.email || ''
              }))
              if (isMounted) setUsersList(mappedUsers)
            }
            break
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Wystąpił błąd podczas pobierania danych z serwera.')
        }
      }
    }

    async function fetchRequestsInBackground() {
      if (!user || activeTab === 'requests' || activeTab === 'users') return
      try {
        const pendingRequests = await fileService.getPendingRequests()
        if (isMounted) setRequests(pendingRequests)
      } catch (err) {
        console.error(err)
      }
    }

    if (!loading) {
      loadDashboardData()
      fetchRequestsInBackground()
    }

    return () => { isMounted = false }
  }, [activeTab, selectedUser, user, isAdmin, loading])

  const handleApproveRequest = async (requestId: string, fileId: string, targetUserId: string) => {
    if (!user) return
    try {
      let finalUserId = targetUserId

      if (isNaN(Number(finalUserId)) && !finalUserId.includes('-')) {
        const resolvedUser = await fileService.searchUserByUsername(targetUserId)
        finalUserId = resolvedUser.id
      }

      await fileService.grantAccess(fileId, finalUserId)
      
      setRequests((prev) => 
        prev.filter((r) => 
          r.id !== requestId && 
          !(r.fileId === fileId && ((r as any).requesterUsername === targetUserId || r.requestedBy === targetUserId))
        )
      )
    } catch (err: any) {
      setError(err.message || 'Nie udało się zatwierdzić prośby.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-200 p-8 flex items-center justify-center">
        <div className="animate-pulse font-medium">Weryfikacja sesji użytkownika...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen text-zinc-100 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-800 to-zinc-900">
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden xl:block">
        <div className="absolute -top-32 left-[calc(50%-45rem)] h-[35rem] w-[35rem] rounded-full bg-emerald-400/15 blur-[120px]" />
        <div className="absolute top-1/4 right-[calc(50%-48rem)] h-[40rem] w-[40rem] rounded-full bg-cyan-400/15 blur-[120px]" />
        <div className="absolute bottom-[-10rem] left-[calc(50%-40rem)] h-[35rem] w-[35rem] rounded-full bg-lime-400/10 blur-[120px]" />
      </div>

      <div className="absolute inset-0 -z-10 bg-zinc-950/40 backdrop-blur-[4px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        
        {error && (
          <div className="mb-6 rounded-2xl border-2 border-red-500 bg-red-950/90 backdrop-blur-[80px] p-4 text-sm text-red-200 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <span className="font-bold">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white ml-2 transition">✕</button>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-zinc-500/30 bg-zinc-900/75 backdrop-blur-[80px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-zinc-100">
          <DashboardHeader user={user} setUser={setUser} router={router} />
        </div>

        <div className="mb-6 rounded-2xl border border-zinc-500/30 bg-zinc-900/75 backdrop-blur-[80px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-zinc-100">
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

        <div className="rounded-2xl border border-zinc-500/30 bg-zinc-900/75 backdrop-blur-[80px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-zinc-100">
          {activeTab === 'users' && isAdmin && (
            <UsersTable usersList={usersList} setUsersList={setUsersList} />
          )}

          {activeTab === 'requests' && user && (
            <FileRequestsTable
              requests={requests}
              setRequests={setRequests}
              onApprove={handleApproveRequest}
            />
          )}

          {activeTab !== 'users' && activeTab !== 'requests' && (
            <FilesTable
              files={files}
              isAdmin={isAdmin}
              setAllFiles={setFiles}
              currentUsername={user?.username}
              pendingRequests={requests}
            />
          )}
        </div>
      </div>
    </main>
  )
}