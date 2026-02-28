'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MemberForm from './MemberForm';
import { Member } from './types';

export default function MembersPage() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get('status');

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const fetchMembers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/members', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }

      const data: Member[] = await res.json();
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // ===========================
  // FILTER LOGIC
  // ===========================

  const today = new Date();

  const filteredMembers = members.filter((m) => {
    const expiry = new Date(m.membershipEndDate);

    if (status === 'active') return expiry >= today;
    if (status === 'expired') return expiry < today;
    if (status === 'expiring') {
      const diff =
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 7;
    }

    return true;
  });

  if (loading) {
    return <p className="text-gray-500">Loading members...</p>;
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Members</h1>

        <button
          onClick={() => {
            setEditingMember(null);
            setShowForm(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Add Member
        </button>
      </div>

      <table className="w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Expiry</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredMembers.map((m) => (
            <tr key={m._id} className="border-b">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.email}</td>
              <td className="p-2">
                {m.membershipEndDate.substring(0, 10)}
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => {
                    setEditingMember(m);
                    setShowForm(true);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <MemberForm
          initialData={editingMember ?? undefined}
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchMembers(); // ✅ refresh list after add/edit
          }}
        />
      )}
    </>
  );
}
