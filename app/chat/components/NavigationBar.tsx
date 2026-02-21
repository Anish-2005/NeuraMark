// components/NavigationBar.jsx
"use client"

import { useAuth } from "@/app/context/AuthContext"
import { Moon, Sun, Users, Clock, ChevronLeft, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

type NavigationBarProps = {
  isDark: boolean
  textColor: string
  secondaryText: string
  borderColor: string
  hoverBg: string
  toggleTheme: () => void
  isSuperAdmin: boolean
  currentRoom: { name: string; type: string; isGlobal?: boolean } | null
  pendingRequests: any[]
  canManageRequests: boolean
  showRoomList: boolean
  setShowRoomList: (show: boolean) => void
  setSidebarOpen: (open: boolean) => void
  setShowPendingRequestsModal: (show: boolean) => void
  setShowMembersModal: (show: boolean) => void
}

export default function NavigationBar({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  hoverBg,
  toggleTheme,
  isSuperAdmin,
  currentRoom,
  pendingRequests,
  canManageRequests,
  showRoomList,
  setShowRoomList,
  setSidebarOpen,
  setShowPendingRequestsModal,
  setShowMembersModal,
}: NavigationBarProps) {
  const { user } = useAuth()

  return (
    <nav className="skeu-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="skeu-btn-icon rounded-lg"
              aria-label="Back to Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="skeu-inset p-1 rounded-lg">
                <Image src="/emblem.png" alt="Logo" width={28} height={28} className="rounded shrink-0" priority />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Study Chat
                </h1>
                {currentRoom && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{currentRoom.name}</p>
                )}
              </div>
              {isSuperAdmin && (
                <span className="skeu-badge text-[10px]">
                  ADMIN
                </span>
              )}
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {currentRoom &&
              canManageRequests &&
              currentRoom.type === "private" &&
              pendingRequests.length > 0 && (
                <button
                  onClick={() => setShowPendingRequestsModal(true)}
                  className="skeu-btn-secondary flex items-center text-sm px-3 py-2 rounded-lg relative"
                  style={{ color: 'var(--accent-warning)' }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Requests</span>
                  <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    style={{ background: 'var(--accent-danger)' }}
                  >
                    {pendingRequests.length}
                  </span>
                </button>
              )}

            {currentRoom && !currentRoom.isGlobal && (
              <button
                onClick={() => setShowMembersModal(true)}
                className="skeu-btn-secondary flex items-center text-sm px-3 py-2 rounded-lg"
                style={{ color: 'var(--accent-primary)' }}
              >
                <Users className="w-4 h-4 mr-2" />
                <span>Members</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="skeu-btn-icon rounded-lg"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }} style={{ color: 'var(--accent-warning)' }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }} style={{ color: 'var(--accent-primary)' }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="flex items-center space-x-2 ml-2 pl-3 skeu-divider-v">
              {user?.photoURL ? (
                <div className="skeu-inset p-0.5 rounded-full">
                  <Image
                    src={user.photoURL || "/placeholder.svg"}
                    alt={user.displayName || "User"}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="skeu-inset h-8 w-8 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm hidden lg:inline font-medium" style={{ color: 'var(--text-secondary)' }}>
                {user?.displayName || user?.email?.split("@")[0]}
              </span>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="skeu-btn-icon rounded-lg"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" style={{ color: 'var(--accent-warning)' }} /> : <Moon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />}
            </button>

            <button
              onClick={() => setSidebarOpen(true)}
              className="skeu-btn-icon rounded-lg"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}