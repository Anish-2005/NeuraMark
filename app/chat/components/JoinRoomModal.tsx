// components/JoinRoomModal.jsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Key } from "lucide-react"

type JoinRoomModalProps = {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  inputBg: string;
  cardBg: string;
  showJoinRoomModal: boolean;
  setShowJoinRoomModal: (show: boolean) => void;
  joinRoomCode: string;
  setJoinRoomCode: (code: string) => void;
  joinRoomByCode: () => void;
};

export default function JoinRoomModal({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  inputBg,
  cardBg,
  showJoinRoomModal,
  setShowJoinRoomModal,
  joinRoomCode,
  setJoinRoomCode,
  joinRoomByCode
}: JoinRoomModalProps) {
  return (
    <AnimatePresence>
      {showJoinRoomModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 skeu-modal-backdrop flex items-center justify-center z-50 p-4"
          onClick={() => setShowJoinRoomModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="skeu-modal w-full max-w-md p-8 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-5">
              <Key className="w-5 h-5 mr-2" style={{ color: 'var(--accent-primary)' }} />
              <h3 className="text-lg font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                Join Room with Code
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="roomCode" className="block text-sm font-semibold mb-2 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Room Code
                </label>
                <input
                  type="text"
                  id="roomCode"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                  className="skeu-input w-full rounded-xl font-mono text-center text-lg tracking-widest"
                  placeholder="XXXXXX"
                  maxLength={6}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Enter the 6-character room code to join
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinRoomModal(false)}
                  className="skeu-btn-secondary px-5 py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={joinRoomByCode}
                  disabled={joinRoomCode.length !== 6}
                  className="skeu-btn-primary px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: joinRoomCode.length === 6 ? 'linear-gradient(180deg, var(--accent-success) 0%, #4a8a5e 100%)' : undefined }}
                >
                  Join Room
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}