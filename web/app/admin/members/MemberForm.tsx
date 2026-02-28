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
  const [monthlyFee, setMonthlyFee] = useState(initialData?.monthlyFee ?? 0);

  const [startDate, setStartDate] = useState(
    initialData?.startDate?.substring(0, 10) ?? ''
  );

  const [duration, setDuration] = useState<number>(
    initialData?.duration ?? 1
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
    const token = localStorage.getItem('token');
    if (!token) return;

    const url = initialData
      ? `http://localhost:3001/members/${initialData._id}`
      : `http://localhost:3001/members`;

    await fetch(url, {
      method: initialData ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        monthlyFee,
        startDate,
        duration,
        membershipEndDate: expiryDate,
      }),
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-xl font-bold">
          {initialData ? 'Edit Member' : 'Add Member'}
        </h2>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Monthly Fee"
          value={monthlyFee}
          onChange={(e) => setMonthlyFee(Number(e.target.value))}
        />

        {/* START DATE */}
        <div>
          <label className="text-sm text-gray-500">Start Date</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* DURATION */}
        <div>
          <label className="text-sm text-gray-500">Duration</label>
          <select
            className="border p-2 w-full"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
        </div>

        {/* EXPIRY DATE (READ ONLY) */}
        <div>
          <label className="text-sm text-gray-500">Expiry Date</label>
          <input
            type="date"
            className="border p-2 w-full bg-gray-100"
            value={expiryDate}
            readOnly
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-orange-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
