// components/MembersModal.jsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X, UserPlus, UserMinus, Users } from "lucide-react"
import Image from "next/image"

type Member = {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role: "admin" | "moderator" | "member";
};

type Room = {
  isGlobal?: boolean;
};

type User = {
  uid: string;
};

interface MembersModalProps {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  cardBg: string;
  showMembersModal: boolean;
  setShowMembersModal: (show: boolean) => void;
  currentRoomMembers: Member[];
  currentRoom: Room | null;
  user: User | null;
  canManageMembers: boolean;
  canManageRoles: boolean;
  makeUserModerator: (id: string) => void;
  removeUserModerator: (id: string) => void;
  removeUserFromRoom: (id: string) => void;
}

export default function MembersModal({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  cardBg,
  showMembersModal,
  setShowMembersModal,
  currentRoomMembers,
  currentRoom,
  user,
  canManageMembers,
  canManageRoles,
  makeUserModerator,
  removeUserModerator,
  removeUserFromRoom
}: MembersModalProps) {
  return (
    <AnimatePresence>
      {showMembersModal && currentRoom && !currentRoom.isGlobal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 skeu-modal-backdrop flex items-center justify-center z-50 p-4"
          onClick={() => setShowMembersModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="skeu-modal w-full max-w-lg p-8 rounded-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="skeu-inset p-2 rounded-xl mr-3">
                  <Users className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <h3 className="text-xl font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Room Members
                </h3>
                <span className="skeu-badge ml-3 text-[10px]">
                  {currentRoomMembers.length}
                </span>
              </div>
              <button
                onClick={() => setShowMembersModal(false)}
                className="skeu-btn-icon rounded-lg"
              >
                <X size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {currentRoomMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="skeu-inset flex items-center justify-between p-4 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      {member.photoURL ? (
                        <div className="skeu-inset p-0.5 rounded-full">
                          <Image
                            src={member.photoURL || "/placeholder.svg"}
                            alt={member.displayName || member.email || "Room member"}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="skeu-inset h-10 w-10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {member.displayName?.charAt(0) || member.email?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {member.displayName || member.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          {member.role === "admin" && (
                            <span className="skeu-badge text-[10px]">Admin</span>
                          )}
                          {member.role === "moderator" && (
                            <span className="skeu-badge text-[10px]" style={{ background: 'linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-primary-dark) 100%)' }}>Moderator</span>
                          )}
                          {member.role === "member" && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Member</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {canManageMembers && member.id !== user?.uid && member.role !== "admin" && (
                      <div className="flex space-x-2">
                        {canManageRoles && member.role === "member" && (
                          <button
                            onClick={() => makeUserModerator(member.id)}
                            className="skeu-btn-icon rounded-lg"
                            title="Make moderator"
                            style={{ color: 'var(--accent-primary)' }}
                          >
                            <UserPlus size={14} />
                          </button>
                        )}
                        {canManageRoles && member.role === "moderator" && (
                          <button
                            onClick={() => removeUserModerator(member.id)}
                            className="skeu-btn-icon rounded-lg"
                            title="Remove moderator"
                          >
                            <UserMinus size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => removeUserFromRoom(member.id)}
                          className="skeu-btn-icon rounded-lg"
                          title="Remove from room"
                          style={{ color: 'var(--accent-danger)' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}