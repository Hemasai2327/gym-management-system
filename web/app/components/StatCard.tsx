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
      className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
