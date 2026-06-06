'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface SidebarTabsProps {
  activeTab: 'all' | 'my' | 'shared' | 'users' | 'requests'
  setActiveTab: (tab: 'all' | 'my' | 'shared' | 'users' | 'requests') => void
  isAdmin: boolean
  search: string
  setSearch: (value: string) => void
  selectedUser: string | null
  setSelectedUser: (user: string | null) => void
  user: { username: string; role: string } | null
}

export default function SidebarTabs({
  activeTab,
  setActiveTab,
  isAdmin,
  search,
  setSearch,
  selectedUser,
  setSelectedUser,
  user,
}: SidebarTabsProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return []
    return [search.trim()]
  }, [search])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return

      setOpen(false)
      setIndex(0)
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (u: string) => {
    setSelectedUser(u)
    setSearch('')
    setOpen(false)
    setIndex(0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = search.trim()
      if (query) {
        handleSelect(query)
      }
      return
    }

    if (!open) return

    if (e.key === 'ArrowDown') {
      setIndex((p) => Math.min(p + 1, filteredUsers.length - 1))
    }

    if (e.key === 'ArrowUp') {
      setIndex((p) => Math.max(p - 1, 0))
    }

    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const availableTabs = useMemo(() => {
    const tabs = [{ id: 'all', label: 'All files' }]
    if (user) {
      tabs.push(
        { id: 'my', label: 'My files' },
        { id: 'shared', label: 'Shared for me' },
        { id: 'requests', label: 'Requests' }
      )
    }
    return tabs
  }, [user])

  const dropdownPosition = useMemo(() => {
    if (!open || !wrapperRef.current) return { top: 0, left: 0 }
    const rect = wrapperRef.current.getBoundingClientRect()
    return {
      top: rect.bottom + (typeof window !== 'undefined' ? window.scrollY : 0),
      left: rect.left + (typeof window !== 'undefined' ? window.scrollX : 0),
    }
  }, [open, search])

  return (
    <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
      <div className="flex flex-col gap-3">
        {selectedUser && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300 w-fit backdrop-blur">
            <span className="text-zinc-500">Selected user:</span>
            <span className="text-white font-medium">{selectedUser}</span>
            <button
              onClick={() => setSelectedUser(null)}
              className="ml-2 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any)
                setSelectedUser(null)
              }}
              className={`pb-3 border-b-2 transition text-sm cursor-pointer ${
                activeTab === tab.id && !selectedUser
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-white hover:border-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {isAdmin && user && (
            <button
              onClick={() => {
                setActiveTab('users')
                setSelectedUser(null)
              }}
              className={`pb-3 border-b-2 transition text-sm cursor-pointer ${
                activeTab === 'users' && !selectedUser
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-white hover:border-white/30'
              }`}
            >
              | Users
            </button>
          )}
        </div>
      </div>

      {user && (
        <div ref={wrapperRef} className="relative w-80 z-50">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setOpen(true)
              setIndex(0)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search user's public files..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:ring-2 focus:ring-white/10 outline-none transition"
          />

          {open &&
            search.trim() &&
            typeof window !== 'undefined' &&
            createPortal(
              <div
                ref={dropdownRef}
                className="fixed w-80 overflow-hidden rounded-xl border border-white/10 bg-[#15161a]/95 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] z-[999999]"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                }}
              >
                <div className="px-3 py-2 text-xs text-zinc-500 border-b border-white/5">
                  Press Enter to search
                </div>

                {filteredUsers.map((u: string, i: number) => (
                  <div
                    key={u}
                    onClick={() => handleSelect(u)}
                    className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between ${
                      i === index
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>Search for: "{u}"</span>
                  </div>
                ))}
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  )
}