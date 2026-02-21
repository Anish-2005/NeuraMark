// components/CreateRoomModal.jsx
"use client"

import { AnimatePresence, motion } from "framer-motion"

type CreateRoomModalProps = {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  inputBg: string;
  cardBg: string;
  showCreateRoomModal: boolean;
  setShowCreateRoomModal: (show: boolean) => void;
  newRoomName: string;
  setNewRoomName: (name: string) => void;
  newRoomType: string;
  setNewRoomType: (type: string) => void;
  createNewRoom: () => void;
};

export default function CreateRoomModal({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  inputBg,
  cardBg,
  showCreateRoomModal,
  setShowCreateRoomModal,
  newRoomName,
  setNewRoomName,
  newRoomType,
  setNewRoomType,
  createNewRoom
}: CreateRoomModalProps) {
  return (
    <AnimatePresence>
      {showCreateRoomModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 skeu-modal-backdrop flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateRoomModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="skeu-modal w-full max-w-md p-8 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-5 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
              Create New Room
            </h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="roomName" className="block text-sm font-semibold mb-2 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Room Name
                </label>
                <input
                  type="text"
                  id="roomName"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="skeu-input w-full rounded-xl text-sm"
                  placeholder="Enter room name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Room Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="public"
                      checked={newRoomType === "public"}
                      onChange={(e) => setNewRoomType(e.target.value)}
                      className="mr-2"
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Public</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="private"
                      checked={newRoomType === "private"}
                      onChange={(e) => setNewRoomType(e.target.value)}
                      className="mr-2"
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Private</span>
                  </label>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  {newRoomType === "public"
                    ? "Anyone can join with the room code"
                    : "Users need approval to join"}
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoomModal(false)}
                  className="skeu-btn-secondary px-5 py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createNewRoom}
                  disabled={!newRoomName.trim()}
                  className="skeu-btn-primary px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Room
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}