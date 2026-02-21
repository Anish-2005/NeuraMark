// components/PendingRequestsModal.jsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X, Clock } from "lucide-react"
import Image from "next/image"

type PendingRequest = {
  id: string;
  userDetails: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  };
  requestedAt?: {
    toDate?: () => Date;
  };
};

type PendingRequestsModalProps = {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  cardBg: string;
  showPendingRequestsModal: boolean;
  setShowPendingRequestsModal: (show: boolean) => void;
  pendingRequests: PendingRequest[];
  handleJoinRequest: (id: string, action: "approve" | "reject") => void;
};

export default function PendingRequestsModal({
  isDark,
  textColor,
  secondaryText,
  borderColor,
  cardBg,
  showPendingRequestsModal,
  setShowPendingRequestsModal,
  pendingRequests,
  handleJoinRequest
}: PendingRequestsModalProps) {
  return (
    <AnimatePresence>
      {showPendingRequestsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 skeu-modal-backdrop flex items-center justify-center z-50 p-4"
          onClick={() => setShowPendingRequestsModal(false)}
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
                  <Clock className="w-5 h-5" style={{ color: 'var(--accent-warning)' }} />
                </div>
                <h3 className="text-lg font-bold skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                  Pending Requests ({pendingRequests.length})
                </h3>
              </div>
              <button
                onClick={() => setShowPendingRequestsModal(false)}
                className="skeu-btn-icon rounded-lg"
              >
                <X size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Clock size={32} style={{ color: 'var(--text-muted)' }} className="mb-2" />
                  <p style={{ color: 'var(--text-muted)' }}>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="skeu-inset flex items-center justify-between p-4 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        {request.userDetails.photoURL ? (
                          <div className="skeu-inset p-0.5 rounded-full">
                            <Image
                              src={request.userDetails.photoURL || "/placeholder.svg"}
                              alt={request.userDetails.displayName || request.userDetails.email || "User photo"}
                              width={36}
                              height={36}
                              className="rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="skeu-inset h-10 w-10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {request.userDetails.displayName?.charAt(0) || request.userDetails.email?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {request.userDetails.displayName || request.userDetails.email}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Requested {request.requestedAt?.toDate?.()?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleJoinRequest(request.id, "approve")}
                          className="skeu-btn-primary px-3 py-1.5 rounded-lg text-xs"
                          style={{ background: 'linear-gradient(180deg, var(--accent-success) 0%, #4a8a5e 100%)' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleJoinRequest(request.id, "reject")}
                          className="skeu-btn-danger px-3 py-1.5 rounded-lg text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}