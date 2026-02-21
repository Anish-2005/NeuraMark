// components/MobileRoomList.jsx
"use client"

import { Users, EyeOff, MessageCircle, Plus, Key, X, Search } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

type Room = {
  id: string;
  name: string;
  members?: any[];
  code?: string;
  isGlobal?: boolean;
};

type MobileRoomListProps = {
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

export default function MobileRoomList({
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
}: MobileRoomListProps) {
  return (
    <AnimatePresence>
      {showRoomList && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 skeu-modal-backdrop z-40"
          onClick={() => setShowRoomList(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="absolute bottom-0 left-0 right-0 skeu-modal rounded-t-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Chat Rooms
                </h2>
                <button
                  onClick={() => setShowRoomList(false)}
                  className="skeu-btn-icon rounded-lg"
                >
                  <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                </button>
              </div>

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

            <hr className="skeu-divider mx-4 my-0" />

            <div className="flex-1 overflow-y-auto p-3">
              {filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                  <MessageCircle className="w-12 h-12 mb-4" style={{ color: 'var(--text-muted)' }} />
                  <p className="mb-2 font-bold" style={{ color: 'var(--text-primary)' }}>No rooms available</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Create a new room or join with a code</p>
                  <div className="flex space-x-3 w-full">
                    <button
                      onClick={() => {
                        setShowCreateRoomModal(true)
                        setShowRoomList(false)
                      }}
                      className="skeu-btn-primary flex-1 py-2.5 rounded-xl text-sm"
                    >
                      Create Room
                    </button>
                    <button
                      onClick={() => {
                        setShowJoinRoomModal(true)
                        setShowRoomList(false)
                      }}
                      className="skeu-btn-primary flex-1 py-2.5 rounded-xl text-sm"
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
                        onClick={() => {
                          setCurrentRoom(room)
                          setShowRoomList(false)
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${currentRoom?.id === room.id ? 'skeu-card-static' : 'skeu-inset'
                          }`}
                        style={currentRoom?.id === room.id ? {
                          boxShadow: 'var(--shadow-elevated)',
                          borderColor: 'var(--accent-primary)',
                          borderWidth: '2px'
                        } : undefined}
                      >
                        <div className="flex items-center">
                          <div className="skeu-inset flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{room.name}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {room.members?.length || 0} members
                              </span>
                              {room.code && (
                                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{room.code}</span>
                              )}
                            </div>
                          </div>
                          {room.isGlobal && (
                            <span className="skeu-badge text-[10px]">
                              Global
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}