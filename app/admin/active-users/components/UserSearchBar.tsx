import React from 'react';
import { RefreshCw, X } from 'lucide-react';

interface UserSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  fetchAllData: () => void;
  loading: boolean;
}

export default function UserSearchBar({ searchQuery, setSearchQuery, fetchAllData, loading }: UserSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="skeu-input w-full sm:w-64 px-4 py-2 rounded-lg text-sm"
          style={{ color: 'var(--text-primary)' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        onClick={fetchAllData}
        className="skeu-btn-primary flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm"
        disabled={loading}
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}
