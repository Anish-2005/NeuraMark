// components/RoomSettingsModal.jsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X, Shield } from "lucide-react"

type RoomSettingsModalProps = {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  inputBg: string;
  cardBg: string;
  showRoomSettings: boolean;
  setShowRoomSettings: (show: boolean) => void;
  currentRoom: {
    id: string;
    name: string;
    code: string;
    type: string;
    members?: Array<{ id: string; displayName?: string; email?: string }>;
    admin?: string;
    isGlobal?: boolean;
  } | null;
  currentRoomMembers: Array<{ id: string; displayName?: string; email?: string }>;
  user: { uid: string } | null;
  isSuperAdmin: boolean;
  newAdminId: string;
  setNewAdminId: (id: string) => void;
  canManageRoles: boolean;
  transferAdmin: () => void;
  deleteRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
};

export default function RoomSettingsModal({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  inputBg,
  cardBg,
  showRoomSettings,
  setShowRoomSettings,
  currentRoom,
  currentRoomMembers,
  user,
  isSuperAdmin,
  newAdminId,
  setNewAdminId,
  canManageRoles,
  transferAdmin,
  deleteRoom,
  leaveRoom
}: RoomSettingsModalProps) {
  return (
    <AnimatePresence>
      {showRoomSettings && currentRoom && !currentRoom.isGlobal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 skeu-modal-backdrop flex items-center justify-center z-50 p-4"
          onClick={() => setShowRoomSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="skeu-modal w-full max-w-md p-8 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-6">
              <div className="skeu-inset p-2 rounded-xl mr-3">
                <Shield className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h3 className="text-xl font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                Room Settings
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold mb-3 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Room Information
                </h4>
                <div className="skeu-inset p-4 rounded-xl space-y-2">
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>Name:</span> {currentRoom.name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>Code:</span>{' '}
                    <span className="font-mono">{currentRoom.code}</span>
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>Type:</span> {currentRoom.type}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>Members:</span> {currentRoom.members?.length || 0}
                  </p>
                </div>
              </div>

              {canManageRoles && (
                <div>
                  <h4 className="text-sm font-bold mb-3 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                    Transfer Admin Rights
                  </h4>
                  <select
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                    className="skeu-select w-full rounded-xl text-sm"
                  >
                    <option value="">Select new admin</option>
                    {currentRoomMembers
                      ?.filter((member) => member.id !== user?.uid)
                      .map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.displayName || member.email}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <hr className="skeu-divider" />

              <div className="space-y-3">
                {(currentRoom.admin === user?.uid || isSuperAdmin) && (
                  <button
                    onClick={() => deleteRoom(currentRoom.id)}
                    className="skeu-btn-danger w-full py-3 text-sm rounded-xl"
                  >
                    Delete Room
                  </button>
                )}
                <button
                  onClick={() => leaveRoom(currentRoom.id)}
                  className="skeu-btn-secondary w-full py-3 text-sm rounded-xl"
                >
                  Leave Room
                </button>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoomSettings(false)}
                  className="skeu-btn-secondary px-5 py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                {canManageRoles && newAdminId && (
                  <button
                    type="button"
                    onClick={transferAdmin}
                    className="skeu-btn-primary px-5 py-2.5 rounded-xl text-sm"
                  >
                    Transfer Admin
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}