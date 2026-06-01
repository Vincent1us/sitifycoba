'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UtensilsCrossed, Table, Calendar, Users, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getRestaurants, getAllReservations, getTables } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalTables: 0,
    totalReservations: 0,
    totalUsers: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (role !== 'ADMIN' && role !== 'admin') {
      router.push('/dashboard/user');
      return;
    }
    
    const email = localStorage.getItem('userEmail') || 'admin@seatify.com';
    setAdminName(email.split('@')[0]);

    const fetchData = async () => {
      try {
        const [restaurants, reservations, tables] = await Promise.all([
          getRestaurants(),
          getAllReservations(),
          getTables(),
        ]);
        
        const pending = reservations?.filter((r: any) => r.status === 'pending').length || 0;
        const confirmed = reservations?.filter((r: any) => r.status === 'confirmed').length || 0;
        
        setStats({
          totalRestaurants: restaurants?.length || 0,
          totalTables: tables?.length || 0,
          totalReservations: reservations?.length || 0,
          totalUsers: 0,
          pendingReservations: pending,
          confirmedReservations: confirmed,
        });
      } catch (error) {
        console.error('Gagal fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const menuCards = [
    { title: 'Kelola Restoran', count: stats.totalRestaurants, icon: UtensilsCrossed, href: '/dashboard/admin/restaurants', color: 'from-amber-500 to-orange-500' },
    { title: 'Kelola Meja', count: stats.totalTables, icon: Table, href: '/dashboard/admin/tables', color: 'from-blue-500 to-blue-600' },
    { title: 'Kelola Reservasi', count: stats.totalReservations, icon: Calendar, href: '/dashboard/admin/reservations', color: 'from-green-500 to-green-600' },
    { title: 'Kelola User', count: stats.totalUsers, icon: Users, href: '/dashboard/admin/users', color: 'from-purple-500 to-purple-600' },
  ];

  const statusCards = [
    { title: 'Menunggu', count: stats.pendingReservations, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Terkonfirmasi', count: stats.confirmedReservations, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Dibatalkan', count: stats.totalReservations - stats.pendingReservations - stats.confirmedReservations, icon: XCircle, color: 'bg-red-100 text-red-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Selamat Datang, {adminName}!</h1>
        <p className="text-gray-500 mt-1">Kelola seluruh operasional Seatify di sini</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {menuCards.map((item) => (
          <Link key={item.title} href={item.href} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
              <item.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{item.count}</p>
            <p className="text-xs text-gray-500">{item.title}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statusCards.map((item) => (
          <div key={item.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{item.count}</p>
              <p className="text-xs text-gray-500">{item.title}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
              <item.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={22} className="text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-800">Aksi Cepat</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/admin/restaurants/new" className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition">+ Tambah Restoran</Link>
          <Link href="/dashboard/admin/tables/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition">+ Tambah Meja</Link>
          <Link href="/dashboard/admin/reservations" className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition">Lihat Semua Reservasi</Link>
        </div>
      </div>
    </div>
  );
}