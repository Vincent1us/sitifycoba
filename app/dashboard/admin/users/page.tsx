'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Search,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAllUsers, deleteUser } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token || (role !== 'ADMIN' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err?.response?.data?.message || 'Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${name}"?`)) return;
    setDeleting(id);
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      alert('User berhasil dihapus');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    if (role?.toLowerCase() === 'admin') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">Admin</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">User</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola User</h1>
        <p className="text-gray-500 text-sm mt-1">Lihat dan kelola semua pengguna Seatify</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total User</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Admin</p>
              <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role?.toLowerCase() === 'admin').length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">User Biasa</p>
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role?.toLowerCase() !== 'admin').length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
          {error}
          <button onClick={fetchUsers} className="ml-3 text-red-700 underline">Coba Lagi</button>
        </div>
      )}

      {/* Tabel User */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <Users size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Tidak ada data user</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Nama</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Bergabung</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-gray-600 text-sm">{user.id}</td>
                    <td className="p-4 font-medium text-gray-800">{user.name || '-'}</td>
                    <td className="p-4 text-gray-600 text-sm flex items-center gap-1">
                      <Mail size={14} className="text-gray-400" />
                      {user.email}
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4 text-gray-500 text-sm flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/admin/users/${user.id}`}
                          className="text-blue-500 hover:text-blue-600 transition p-1"
                          title="Detail User"
                        >
                          <Eye size={18} />
                        </Link>
                        {user.role?.toLowerCase() !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id, user.name || user.email)}
                            disabled={deleting === user.id}
                            className="text-red-500 hover:text-red-600 transition disabled:opacity-50 p-1"
                            title="Hapus User"
                          >
                            {deleting === user.id ? '...' : <Trash2 size={18} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info jika endpoint belum tersedia */}
      {error && error.includes('404') && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700">
            ℹ️ Endpoint API untuk kelola user mungkin belum tersedia di backend.
            Hubungi backend developer untuk menambahkan endpoint:
            <br />
            - <code className="bg-yellow-100 px-1 rounded">GET /admin/users</code> - Mendapatkan semua user
            <br />
            - <code className="bg-yellow-100 px-1 rounded">DELETE /admin/users/{'{id}'}</code> - Menghapus user
          </p>
        </div>
      )}
    </div>
  );
}