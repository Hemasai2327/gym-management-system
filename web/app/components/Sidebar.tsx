'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold">IronGate Gym</div>

      <nav className="flex-1 px-4 space-y-2">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-800"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link
          href="/admin/members"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-800"
        >
          <Users size={18} /> Members
        </Link>
      </nav>

      <button
        onClick={logout}
        className="p-4 flex items-center gap-2 text-red-400 hover:bg-slate-800"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
