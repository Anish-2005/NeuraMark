import React from 'react';
import type { JSX } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface UserMobileCardProps {
  user: any;
  expandedUser: string | null;
  toggleUserExpand: (id: string) => void;
  formatDate: (date: Date | null) => string;
  renderProgressData: (userId: string) => JSX.Element;
}

export default function UserMobileCard({ user, expandedUser, toggleUserExpand, formatDate, renderProgressData }: UserMobileCardProps) {
  return (
    <div
      key={user.id}
      className="skeu-card-static rounded-xl border border-skeu p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {user.photoURL ? (
            <div className="skeu-inset p-0.5 rounded-full">
              <Image
                src={user.photoURL}
                alt={user.name}
                width={44}
                height={44}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="skeu-inset h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => toggleUserExpand(user.id)}
          className="skeu-btn-icon p-2 rounded-lg"
        >
          {expandedUser === user.id ? (
            <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          )}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <p style={{ color: 'var(--text-muted)' }}>Joined</p>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(user.createdAt)}</p>
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)' }}>Last Active</p>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(user.updatedAt)}</p>
        </div>
      </div>
      {expandedUser === user.id && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
          {renderProgressData(user.id)}
        </div>
      )}
    </div>
  );
}
