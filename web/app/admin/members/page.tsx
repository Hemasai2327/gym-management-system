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
  const [userRole, setUserRole] = useState<string>('manager');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchMembers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.role) {
        setUserRole(payload.role);
      }
    } catch (e) {
      console.error('Failed to parse token payload', e);
    }

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });
      
      if (status) queryParams.append('status', status);

      const res = await fetch(`http://localhost:3001/members?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }

      const data = await res.json();
      // Handle the new paginated format
      if (data && data.data) {
        setMembers(data.data);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        // Fallback for previous format just in case
        setMembers(data);
      }
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  }, [router, currentPage, status]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // ===========================
  // FILTER LOGIC
  // ===========================
  // Filter logic is now moved to the backend, so we just display the fetched members.
  // We keep this variable for consistency
  const filteredMembers = members;

  if (loading && members.length === 0) {
    return <p className="text-gray-500">Loading members...</p>;
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Members</h1>

        <div className="flex gap-2">
          <button
            onClick={async () => {
              const token = localStorage.getItem('token');
              const res = await fetch('http://localhost:3001/members/export', {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'members.csv';
                a.click();
                window.URL.revokeObjectURL(url);
              } else {
                alert('Failed to export members');
              }
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Export to CSV
          </button>
          
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
      </div>

      <div className="overflow-x-auto">
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
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m: Member) => (
                <tr key={m._id} className="border-b hover:bg-gray-50/50">
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
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    {userRole === 'superadmin' && (
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this member?')) {
                            const token = localStorage.getItem('token');
                            await fetch(`http://localhost:3001/members/${m._id}`, {
                              method: 'DELETE',
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });
                            fetchMembers();
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        const amount = prompt('Enter payment amount:');
                        if (amount && !isNaN(Number(amount))) {
                          const token = localStorage.getItem('token');
                          await fetch(`http://localhost:3001/payments`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              memberId: m._id,
                              memberName: m.name,
                              amount: Number(amount)
                            })
                          });
                          alert('Payment recorded!');
                        }
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

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
