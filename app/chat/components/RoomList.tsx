"use client"

import {
  Users,
  EyeOff,
  MessageCircle,
  Plus,
  Key,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

type Room = {
  id: string;
  name: string;
  isGlobal?: boolean;
  members?: any[];
  code?: string;
  type?: string;
};

type RoomListProps = {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  hoverBg: string;
  inputBg: string;
  cardBg: string;
  filteredRooms: Room[];
  currentRoom: Room | null;
  setCurrentRoom: (room: Room) => void;
  setShowRoomList: (show: boolean) => void;
  setShowCreateRoomModal: (show: boolean) => void;
  setShowJoinRoomModal: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showRoomList: boolean;
};

export default function RoomList({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  hoverBg,
  inputBg,
  cardBg,
  filteredRooms,
  currentRoom,
  setCurrentRoom,
  setShowRoomList,
  setShowCreateRoomModal,
  setShowJoinRoomModal,
  searchQuery,
  setSearchQuery,
  showRoomList
}: RoomListProps) {
  const [collapsed, setCollapsed] = useState(false)

  interface HandleRoomClick {
    (room: Room): void;
  }

  const handleRoomClick: HandleRoomClick = (room) => {
    setCurrentRoom(room)
    if (window.innerWidth < 768) {
      setShowRoomList(false)
    }
  }

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <>
      {/* Toggle Collapse Button - Desktop only */}
      <div className="hidden md:flex items-center">
        <button
          onClick={toggleCollapse}
          className="skeu-btn-icon mr-2 rounded-full"
          title={collapsed ? "Expand Room List" : "Collapse Room List"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          ) : (
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          )}
        </button>
      </div>

      {/* Room List Panel - Shown on desktop unless collapsed */}
      {!collapsed && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="hidden md:flex w-80 flex-shrink-0 skeu-card-static rounded-2xl mr-4 flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5" style={{ background: 'var(--surface-overlay)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold skeu-text-embossed flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MessageCircle className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                Chat Rooms
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowJoinRoomModal(true)}
                  className="skeu-btn-icon rounded-lg"
                  title="Join room"
                  style={{ color: 'var(--accent-success)' }}
                >
                  <Key className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowCreateRoomModal(true)}
                  className="skeu-btn-icon rounded-lg"
                  title="Create room"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-3" style={{ color: 'var(--text-muted)', width: 16, height: 16 }} />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="skeu-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <hr className="skeu-divider mx-0 my-0" />

          {/* Room List */}
          <div className="flex-1 overflow-y-auto p-3">
            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageCircle className="w-12 h-12 mb-4" style={{ color: 'var(--text-muted)' }} />
                <p className="mb-2 font-bold" style={{ color: 'var(--text-primary)' }}>No rooms found</p>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Create or join a room to get started</p>
                <div className="flex flex-col space-y-3 w-full">
                  <button
                    onClick={() => setShowCreateRoomModal(true)}
                    className="skeu-btn-primary py-3 rounded-xl text-sm font-bold"
                  >
                    Create Room
                  </button>
                  <button
                    onClick={() => setShowJoinRoomModal(true)}
                    className="skeu-btn-primary py-3 rounded-xl text-sm font-bold"
                    style={{ background: 'linear-gradient(180deg, var(--accent-success) 0%, #4a8a5e 100%)' }}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredRooms.map((room) => (
                  <li key={room.id}>
                    <button
                      onClick={() => handleRoomClick(room)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${currentRoom?.id === room.id
                          ? 'skeu-card-static'
                          : 'skeu-inset'
                        }`}
                      style={currentRoom?.id === room.id ? {
                        boxShadow: 'var(--shadow-elevated)',
                        borderColor: 'var(--accent-primary)',
                        borderWidth: '2px'
                      } : undefined}
                    >
                      <div className="flex items-start">
                        <div className="skeu-inset flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{room.name}</p>
                            {room.isGlobal && (
                              <span className="skeu-badge text-[10px] ml-2">
                                Global
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {room.members?.length || 0} members
                            </span>
                            {room.code && (
                              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{room.code}</span>
                            )}
                            {room.type === "private" && <EyeOff className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
