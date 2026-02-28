'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';

interface Member {
  _id: string;
  membershipEndDate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchMembers = async () => {
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
        console.error('Failed to load members', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [router]);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  // ===========================
  // MEMBER STATUS CALCULATIONS
  // ===========================

  const today = new Date();

  const activeMembers = members.filter(
    (m) => new Date(m.membershipEndDate) >= today
  );

  const expiredMembers = members.filter(
    (m) => new Date(m.membershipEndDate) < today
  );

  const expiringSoonMembers = members.filter((m) => {
    const expiry = new Date(m.membershipEndDate);
    const diffDays =
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays > 0 && diffDays <= 7;
  });

  // ===========================
  // DASHBOARD UI
  // ===========================

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={members.length}
          icon={<Users size={22} />}
          onClick={() => router.push('/admin/members')}
        />

        <StatCard
          title="Active Members"
          value={activeMembers.length}
          icon={<UserCheck size={22} />}
          onClick={() => router.push('/admin/members?status=active')}
        />

        <StatCard
          title="Expired Members"
          value={expiredMembers.length}
          icon={<UserX size={22} />}
          onClick={() => router.push('/admin/members?status=expired')}
        />

        <StatCard
          title="Expiring Soon"
          value={expiringSoonMembers.length}
          icon={<Clock size={22} />}
          onClick={() => router.push('/admin/members?status=expiring')}
        />
      </div>
    </>
  );
}
