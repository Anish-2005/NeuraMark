// components/Sidebar.jsx
"use client"

import { User, X, MessageCircle, Users, Plus, Key, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type SidebarProps = {
  isDark: boolean
  textColor: string
  secondaryText: string
  borderColor: string
  hoverBg: string
  cardBg: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  user: {
    photoURL?: string
    displayName?: string
    email?: string
  }
  logout: () => void
  setShowJoinRoomModal: (show: boolean) => void
  setShowCreateRoomModal: (show: boolean) => void
  currentRoom?: {
    type?: string
    isGlobal?: boolean
  }
  pendingRequests: any[]
  setShowPendingRequestsModal: (show: boolean) => void
  setShowMembersModal: (show: boolean) => void
  canManageRequests: boolean
  currentRoomMembers?: any[]
}

export default function Sidebar({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  hoverBg,
  cardBg,
  sidebarOpen,
  setSidebarOpen,
  user,
  logout,
  setShowJoinRoomModal,
  setShowCreateRoomModal,
  currentRoom,
  pendingRequests,
  setShowPendingRequestsModal,
  setShowMembersModal,
  canManageRequests,
  currentRoomMembers = [],
}: SidebarProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 skeu-modal-backdrop z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] skeu-sidebar flex flex-col"
            style={{ background: 'var(--surface-raised)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center space-x-3">
                <div className="skeu-inset p-1 rounded-lg">
                  <Image src="/emblem.png" alt="Logo" width={28} height={28} className="rounded-sm shrink-0" />
                </div>
                <h2 className="text-lg font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>Menu</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="skeu-btn-icon rounded-lg"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            <hr className="skeu-divider mx-4" />

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="block skeu-btn-secondary text-sm font-medium py-3 px-4 rounded-xl"
                style={{
                  color: pathname === "/dashboard" ? 'var(--accent-primary)' : 'var(--text-primary)',
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/chat"
                onClick={() => setSidebarOpen(false)}
                className="block skeu-btn-secondary text-sm font-medium py-3 px-4 rounded-xl"
                style={{
                  color: pathname === "/chat" ? 'var(--accent-primary)' : 'var(--text-primary)',
                }}
              >
                Chat
              </Link>

              <hr className="skeu-divider" />

              {/* Room Controls */}
              <button
                onClick={() => {
                  setShowJoinRoomModal(true)
                  setSidebarOpen(false)
                }}
                className="skeu-btn-primary w-full flex items-center px-4 py-3 rounded-xl text-sm"
                style={{ background: 'linear-gradient(180deg, var(--accent-success) 0%, #4a8a5e 100%)' }}
              >
                <Key className="w-4 h-4 mr-2" />
                Join Room
              </button>

              <button
                onClick={() => {
                  setShowCreateRoomModal(true)
                  setSidebarOpen(false)
                }}
                className="skeu-btn-primary w-full flex items-center px-4 py-3 rounded-xl text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </button>

              {currentRoom &&
                canManageRequests &&
                currentRoom.type === "private" &&
                pendingRequests.length > 0 && (
                  <button
                    onClick={() => {
                      setShowPendingRequestsModal(true)
                      setSidebarOpen(false)
                    }}
                    className="skeu-btn-secondary w-full flex items-center px-4 py-3 rounded-xl text-sm"
                    style={{ color: 'var(--accent-warning)' }}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Requests ({pendingRequests.length})</span>
                  </button>
                )}

              {currentRoom && !currentRoom.isGlobal && (
                <button
                  onClick={() => {
                    setShowMembersModal(true)
                    setSidebarOpen(false)
                  }}
                  className="skeu-btn-secondary w-full flex items-center px-4 py-3 rounded-xl text-sm"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span>Members ({currentRoomMembers.length})</span>
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 space-y-3">
              <hr className="skeu-divider" />
              <div className="flex items-center space-x-3 mb-3">
                {user?.photoURL ? (
                  <div className="skeu-inset p-0.5 rounded-full">
                    <Image
                      src={user.photoURL || "/placeholder.svg"}
                      alt={user.displayName || "User"}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="skeu-inset w-10 h-10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                    {user?.displayName || user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="skeu-btn-danger w-full py-3 text-sm rounded-xl"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}