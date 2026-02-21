import React from 'react';
import Image from 'next/image';
import { User, Mail, Calendar, Clock, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface UserTableProps {
  filteredUsers: any[];
  expandedUser: string | null;
  toggleUserExpand: (id: string) => void;
  formatDate: (date: Date | null) => string;
  userProgress: any;
  renderProgressData: (userId: string) => React.ReactElement;
}

export default function UserTable({ filteredUsers, expandedUser, toggleUserExpand, formatDate, userProgress, renderProgressData }: UserTableProps) {
  return (
    <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
      <thead>
        <tr className="skeu-inset">
          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              User
            </div>
          </th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </div>
          </th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Joined
            </div>
          </th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Last Active
            </div>
          </th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Progress
            </div>
          </th>
          <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Details
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <React.Fragment key={user.id}>
            <tr className="transition-all hover:opacity-80" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.photoURL ? (
                      <div className="skeu-inset p-0.5 rounded-full">
                        <Image
                          src={user.photoURL}
                          alt={user.name}
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="skeu-inset h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user.name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      ID: {user.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{formatDate(user.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{formatDate(user.updatedAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`skeu-badge text-xs ${userProgress[user.id] && Object.keys(userProgress[user.id]).length > 0
                    ? ''
                    : 'opacity-60'
                  }`}>
                  {userProgress[user.id] && Object.keys(userProgress[user.id]).length > 0 ? 'Active' : 'No Progress'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => toggleUserExpand(user.id)}
                  className="skeu-btn-icon p-1.5 rounded-lg"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {expandedUser === user.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </td>
            </tr>
            {expandedUser === user.id && (
              <tr>
                <td colSpan={6} className="px-6 py-4 skeu-inset">
                  {renderProgressData(user.id)}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
