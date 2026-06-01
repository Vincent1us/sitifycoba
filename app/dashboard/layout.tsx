'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole')?.toLowerCase() || 'user';
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setRole(userRole === 'admin' ? 'admin' : 'user');
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      {/* KONTEN - DENGAN JARAK YANG BAGUS */}
      <main className="flex-1 min-h-screen bg-gray-50">
        <div className="p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}