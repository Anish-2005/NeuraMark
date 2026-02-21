import React from 'react';
import { User, CheckCircle, BookOpen, Calendar } from 'lucide-react';

interface AdminStatsCardsProps {
  usersCount: number;
  activeLearners: number;
  subjectsCount: number;
  newThisWeek: number;
}

export default function AdminStatsCards({ usersCount, activeLearners, subjectsCount, newThisWeek }: AdminStatsCardsProps) {
  const stats = [
    { icon: User, label: 'Total Users', value: usersCount, accent: 'var(--accent-primary)' },
    { icon: CheckCircle, label: 'Active Learners', value: activeLearners, accent: 'var(--accent-success)' },
    { icon: BookOpen, label: 'Subjects Available', value: subjectsCount, accent: 'var(--accent-secondary)' },
    { icon: Calendar, label: 'New This Week', value: newThisWeek, accent: 'var(--accent-warning)' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="skeu-card-static rounded-xl p-6 border border-skeu">
          <div className="flex items-center">
            <div className="skeu-inset p-2.5 rounded-xl">
              <stat.icon className="w-6 h-6" style={{ color: stat.accent }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
