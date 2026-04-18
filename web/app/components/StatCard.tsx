'use client';

import React from 'react';
interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 group-hover:text-orange-600 transition-colors">{title}</p>
        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-extrabold mt-4 text-slate-800 tracking-tight">{value}</p>
    </div>
  );
}
