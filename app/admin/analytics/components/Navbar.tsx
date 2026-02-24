import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/app/components/Logo';
import { BarChart2, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  cardBg: string;
  borderColor: string;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, textColor, secondaryText, cardBg, borderColor }) => (
  <nav className="skeu-navbar sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16 md:h-20">
        {/* Left Section */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link
            href="/dashboard"
            className="skeu-btn-icon rounded-lg"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </Link>
          <LogoIcon size={32} />
          <div>
            <h1 className="text-lg sm:text-2xl font-bold skeu-text-embossed tracking-tight truncate max-w-[140px] sm:max-w-xs"
              style={{ color: 'var(--text-primary)' }}
            >
              Learning Analytics
            </h1>
            <p className="text-xs hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
              KPI &amp; KRA Dashboard
            </p>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <div className="skeu-card-static p-2 rounded-xl"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-primary-dark) 100%)'
                : 'linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-primary-dark) 100%)'
            }}
          >
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
