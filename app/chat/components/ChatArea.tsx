// components/ChatArea.jsx
"use client"

import React from "react";
import { Send, ChevronLeft, Users, Shield, Clock, Copy, Check, EyeOff, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

type ChatAreaProps = {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  hoverBg: string;
  inputBg: string;
  cardBg: string;
  currentRoom: any;
  messages: any[];
  loading: boolean;
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  user: any;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  formatTime: (timestamp: any) => string;
  getRoleBadge: (role: string) => React.ReactNode;
  getUserRole: () => string;
  canManageRequests: () => boolean;
  pendingRequests: any[];
  setShowPendingRequestsModal: (show: boolean) => void;
  setShowMembersModal: (show: boolean) => void;
  setShowRoomSettings: (show: boolean) => void;
  setShowRoomList: (show: boolean) => void;
  copiedCode: boolean;
  copyRoomCode: (code: string) => void;
  showRoomList: boolean;
};

export default function ChatArea({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  hoverBg,
  inputBg,
  cardBg,
  currentRoom,
  messages,
  loading,
  newMessage,
  setNewMessage,
  handleSendMessage,
  user,
  messagesEndRef,
  formatTime,
  getRoleBadge,
  getUserRole,
  canManageRequests,
  pendingRequests,
  setShowPendingRequestsModal,
  setShowMembersModal,
  setShowRoomSettings,
  setShowRoomList,
  copiedCode,
  copyRoomCode,
  showRoomList
}: ChatAreaProps) {
  const [showCreateRoomModal, setShowCreateRoomModal] = React.useState(false);

  return (
    <div className="flex-1 skeu-card-static rounded-2xl overflow-hidden flex flex-col">
      {!currentRoom ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="skeu-inset p-6 rounded-2xl mb-6">
            <MessageCircle className="w-16 h-16" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h3 className="text-2xl font-bold skeu-text-embossed mb-3" style={{ color: 'var(--text-primary)' }}>
            {showRoomList ? "Select a chat room" : "No room selected"}
          </h3>
          <p className="max-w-md mb-8 text-base" style={{ color: 'var(--text-muted)' }}>
            {showRoomList
              ? "Choose from your available rooms or create a new one"
              : "Browse rooms to start chatting"}
          </p>
          <div className="flex space-x-3">
            {!showRoomList && (
              <button
                onClick={() => setShowRoomList(true)}
                className="skeu-btn-primary px-6 py-3 rounded-xl text-sm font-bold"
              >
                Browse Rooms
              </button>
            )}
            <button
              onClick={() => setShowCreateRoomModal(true)}
              className="skeu-btn-secondary px-5 py-3 rounded-xl text-sm"
            >
              Create Room
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Room Header */}
          <div className="p-5 flex justify-between items-center" style={{ background: 'var(--surface-overlay)' }}>
            <div className="flex items-center">
              <button
                onClick={() => setShowRoomList(true)}
                className="md:hidden mr-3 skeu-btn-icon rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                    {currentRoom.name}
                  </h2>
                  {currentRoom.isGlobal && (
                    <span className="skeu-badge text-[10px]">Global</span>
                  )}
                  {currentRoom.type === "private" && <EyeOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                  {getRoleBadge(getUserRole())}
                </div>
                {currentRoom.code && (
                  <div className="flex items-center mt-1.5 gap-2">
                    <span className="text-xs font-mono skeu-inset px-3 py-1 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                      Code: {currentRoom.code}
                    </span>
                    <button
                      onClick={() => copyRoomCode(currentRoom.code)}
                      className="skeu-btn-icon p-1.5 rounded-lg"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent-success)' }} />
                      ) : (
                        <Copy className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              {canManageRequests() && currentRoom.type === "private" && pendingRequests.length > 0 && (
                <button
                  onClick={() => setShowPendingRequestsModal(true)}
                  className="skeu-btn-icon rounded-lg relative"
                  style={{ color: 'var(--accent-warning)' }}
                >
                  <Clock className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
                    style={{ background: 'var(--accent-danger)' }}
                  >
                    {pendingRequests.length}
                  </span>
                </button>
              )}

              {!currentRoom.isGlobal && (
                <>
                  <button
                    onClick={() => setShowMembersModal(true)}
                    className="skeu-btn-icon rounded-lg"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    <Users className="w-5 h-5" />
                  </button>
                  {getUserRole() !== "member" && (
                    <button
                      onClick={() => setShowRoomSettings(true)}
                      className="skeu-btn-icon rounded-lg"
                      style={{ color: 'var(--accent-secondary)' }}
                    >
                      <Shield className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <hr className="skeu-divider mx-0 my-0" />

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4" style={{ background: 'var(--surface-base)' }}>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="skeu-inset p-5 rounded-2xl mb-6">
                  <MessageCircle className="w-14 h-14" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No messages yet</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Send a message to start the conversation</p>
              </div>
            ) : (
              <div className="flex flex-col-reverse space-y-reverse space-y-3">
                <div ref={messagesEndRef} />
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.userId === user?.uid ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-xs sm:max-w-md rounded-xl px-4 py-3 relative ${message.userId === user?.uid
                          ? 'text-white'
                          : 'skeu-inset'
                        }`}
                      style={
                        message.userId === user?.uid
                          ? {
                            background: 'linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-primary-dark) 100%)',
                            boxShadow: 'var(--shadow-button)',
                            border: '1px solid rgba(0,0,0,0.15)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          }
                          : undefined
                      }
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          {message.photoURL ? (
                            <Image
                              src={message.photoURL || "/placeholder.svg"}
                              alt={message.displayName}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full flex items-center justify-center"
                              style={{
                                background: message.userId === user?.uid ? 'rgba(255,255,255,0.2)' : 'var(--surface-raised)',
                              }}
                            >
                              <span className="text-xs">{message.displayName.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="font-medium text-sm">
                              {message.displayName}
                            </span>
                            {message.isAdmin && (
                              <span className="skeu-badge ml-1 text-[8px] py-0">ADMIN</span>
                            )}
                            {message.isModerator && !message.isAdmin && (
                              <span className="skeu-badge ml-1 text-[8px] py-0" style={{ background: 'linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-primary-dark) 100%)' }}>MOD</span>
                            )}
                          </div>
                          <span className="text-[10px] opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm"
                          style={message.userId !== user?.uid ? { color: 'var(--text-primary)' } : undefined}
                        >
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-5" style={{ background: 'var(--surface-overlay)' }}>
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="skeu-input flex-1 px-5 py-3.5 rounded-xl text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className={`p-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 ${newMessage.trim()
                    ? 'skeu-btn-primary'
                    : 'skeu-btn-secondary'
                  }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}