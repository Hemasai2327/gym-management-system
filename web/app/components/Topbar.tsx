import { Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
      <input
        placeholder="Search..."
        className="bg-slate-100 px-4 py-2 rounded w-80 outline-none"
      />
      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" />
        <div className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
}
