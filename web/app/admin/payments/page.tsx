'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Payment } from './types';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }

      const data: Payment[] = await res.json();
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (loading) {
    return <p className="text-gray-500">Loading payments...</p>;
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Payment History</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Member Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Amount ($)</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50/50">
                  <td className="p-3">{p.memberName}</td>
                  <td className="p-3">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td className="p-3 font-medium text-green-600">${p.amount}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
