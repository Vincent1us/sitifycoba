'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Calendar, ShieldCheck, User as UserIcon } from 'lucide-react';
import { getUserById } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token || (role !== 'ADMIN' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    
    const fetchUser = async () => {
      try {
        const data = await getUserById(parseInt(id as string));
        setUser(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Gagal mengambil data user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string) => {
    if (role?.toLowerCase() === 'admin') {
      return <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">Admin</span>;
    }
    return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">User</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/admin/users" className="text-gray-500 hover:text-amber-500 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Detail User</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
          {error || 'User tidak ditemukan'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/users" className="text-gray-500 hover:text-amber-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Detail User</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="px-6 pb-6">
          <div className="flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
              <UserIcon size={40} className="text-white" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{user.name || 'Pengguna'}</h2>
            <div className="flex justify-center mt-2">
              {getRoleBadge(user.role)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail size={18} className="text-amber-500" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium text-gray-700">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar size={18} className="text-amber-500" />
              <div>
                <p className="text-xs text-gray-400">Bergabung Sejak</p>
                <p className="font-medium text-gray-700">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <ShieldCheck size={18} className="text-amber-500" />
              <div>
                <p className="text-xs text-gray-400">Status Akun</p>
                <p className="font-medium text-green-600">Aktif</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href={`/dashboard/admin/users/${user.id}/edit`}
              className="text-amber-600 text-sm font-medium hover:text-amber-700 transition flex items-center gap-1"
            >
              Edit Profil User →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}