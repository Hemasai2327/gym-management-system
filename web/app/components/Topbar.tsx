import { Bell, Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-20 sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          placeholder="Search members, payments..."
          className="bg-slate-100 pl-10 pr-4 py-2.5 rounded-xl w-96 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-orange-500 transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-rose-500 text-white rounded-xl flex items-center justify-center font-bold shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105 group-hover:rotate-3">
            A
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-bold text-slate-700">Admin User</p>
            <p className="text-slate-400 text-xs font-medium">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
