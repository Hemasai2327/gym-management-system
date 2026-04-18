'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, CreditCard, Dumbbell } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transition-all">
      <div className="p-6 text-2xl font-black bg-slate-950 text-white flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-2 rounded-lg text-white shadow-lg shadow-orange-500/20">
          <Dumbbell size={24} strokeWidth={2.5} />
        </div>
        <span className="tracking-tight">Strive</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                isActive
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'hover:bg-slate-900 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-white'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-medium group"
        >
          <LogOut size={20} className="group-hover:text-red-400" /> Logout
        </button>
      </div>
    </aside>
  );
}
