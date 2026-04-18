'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MemberForm from './MemberForm';
import { Member } from './types';

function MembersContent() {
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
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Members</h1>
          <p className="text-slate-500 mt-1">Manage and track your gym members</p>
        </div>

        <div className="flex gap-3">
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
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            Export CSV
          </button>
          
          <button
            onClick={() => {
              setEditingMember(null);
              setShowForm(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
          >
            + Add Member
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Expiry</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m: Member) => (
                  <tr key={m._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-800">{m.name}</td>
                    <td className="px-6 py-4 text-slate-500">{m.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {m.membershipEndDate.substring(0, 10)}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-3 text-right">
                      <button
                        onClick={() => {
                          setEditingMember(m);
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
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
                          className="text-red-500 hover:text-red-700 font-medium transition-colors"
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
                        className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default function MembersPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <MembersContent />
    </Suspense>
  );
}
