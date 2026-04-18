'use client';

import { useMemo, useState } from 'react';
import { Member } from './types';

export interface MemberFormProps {
  initialData?: Member;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MemberForm({
  initialData,
  onSuccess,
  onCancel,
}: MemberFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [monthlyFee, setMonthlyFee] = useState(initialData?.monthlyFee ?? 1499);

  const [startDate, setStartDate] = useState(
    initialData?.startDate?.substring(0, 10) || new Date().toISOString().substring(0, 10)
  );
  
  const [error, setError] = useState('');

  const [duration, setDuration] = useState<number>(
    initialData?.duration ?? 1
  );

  const [paymentMode, setPaymentMode] = useState<string>(
    (initialData as any)?.paymentMode || 'Cash'
  );

  const expiryDate = useMemo(() => {
    if (!startDate || !duration) {
      return initialData?.membershipEndDate?.substring(0, 10) ?? '';
    }

    const date = new Date(startDate);
    date.setMonth(date.getMonth() + duration);
    return date.toISOString().substring(0, 10);
  }, [startDate, duration, initialData?.membershipEndDate]);

  const submit = async () => {
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const url = initialData
        ? `http://localhost:3001/members/${initialData._id}`
        : `http://localhost:3001/members`;

      const res = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          monthlyFee: Number(monthlyFee),
          startDate,
          duration: Number(duration),
          paymentMode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(Array.isArray(errorData.message) ? errorData.message[0] : errorData.message || 'Failed to save member.');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Network error: Unable to save member.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-5 text-slate-800">
        <h2 className="text-2xl font-black tracking-tight border-b border-slate-100 pb-4">
          {initialData ? 'Edit Member' : 'Add Member'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
            <input
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Email Address</label>
            <input
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Phone Number</label>
              <input
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Total Fee</label>
              <input
                type="number"
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                placeholder="50"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Start Date</label>
              <input
                type="date"
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all font-medium text-slate-700"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Duration</label>
              <select
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all font-medium text-slate-700"
                value={duration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDuration(val);
                  if (val === 1) setMonthlyFee(1499);
                  else if (val === 3) setMonthlyFee(6999);
                  else if (val === 6) setMonthlyFee(8999);
                  else if (val === 12) setMonthlyFee(11999);
                }}
              >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Payment Mode</label>
              <select
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all font-medium text-slate-700"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI (App)</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Calculated Expiry (Auto)</label>
              <input
                type="date"
                className="w-full p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed select-none font-medium"
                value={expiryDate}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all shadow-md shadow-orange-500/20"
          >
            Save Member
          </button>
        </div>
      </div>
    </div>
  );
}
