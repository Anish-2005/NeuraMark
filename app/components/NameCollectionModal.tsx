// components/NameCollectionModal.js
'use client'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

type NameCollectionModalProps = {
  onComplete: () => void;
  onClose: () => void;
};

export default function NameCollectionModal({ onComplete, onClose }: NameCollectionModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { completeProfile } = useAuth();

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> { }

  interface CompleteProfileError extends Error {
    message: string;
  }

  const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await completeProfile(name.trim());
      onComplete();
    } catch (err) {
      setError((err as CompleteProfileError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 skeu-modal-backdrop flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="skeu-modal p-8 w-full max-w-md rounded-2xl"
        >
          <h2 className="text-2xl font-bold mb-4 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
            Tell us your name
          </h2>

          {error && (
            <div className="skeu-inset mb-4 p-3 rounded-xl text-sm" style={{ color: 'var(--accent-danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-semibold mb-2 skeu-text-embossed" style={{ color: 'var(--text-primary)' }}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="skeu-input w-full rounded-xl"
                placeholder="Enter your full name"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="skeu-btn-secondary px-5 py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="skeu-btn-primary px-5 py-2.5 rounded-xl text-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}