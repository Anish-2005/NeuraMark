import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, ChevronUp, ChevronDown } from 'lucide-react';
import KPICharts from './KPICharts';

interface UserAnalyticsCardProps {
  user: any;
  isDark: boolean;
  textColor: string;
  secondaryText: string;
  borderColor: string;
  expandedUser: string | null;
  toggleUserExpand: (userId: string) => void;
  userKpiData: any[];
  userKraData: any[];
  yearlyProgressData: any[];
  hasProgress: boolean;
}

const UserAnalyticsCard: React.FC<UserAnalyticsCardProps> = ({
  user,
  isDark,
  textColor,
  secondaryText,
  borderColor,
  expandedUser,
  toggleUserExpand,
  userKpiData,
  userKraData,
  yearlyProgressData,
  hasProgress,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="skeu-card-static p-5 rounded-xl border border-skeu"
  >
    <div className="flex items-center justify-between">
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
          <div className="skeu-inset h-12 w-12 rounded-full flex items-center justify-center">
            <User size={20} style={{ color: 'var(--text-secondary)' }} />
          </div>
        )}
        <div>
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email}</div>
        </div>
      </div>
      <button
        onClick={() => toggleUserExpand(user.id)}
        className="skeu-btn-icon p-2 rounded-lg"
        style={{ color: 'var(--accent-primary)' }}
      >
        {expandedUser === user.id ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
    </div>
    {expandedUser === user.id && (
      <div className="mt-6">
        <KPICharts
          userKpiData={userKpiData}
          userKraData={userKraData}
          yearlyProgressData={yearlyProgressData}
          COLORS={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]}
        />
      </div>
    )}
  </motion.div>
);

export default UserAnalyticsCard;
