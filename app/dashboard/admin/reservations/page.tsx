'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CheckCircle, Clock, XCircle, Eye, Image as ImageIcon } from 'lucide-react';
import { getAllReservations, getRestaurants, confirmReservation, rejectReservation } from '@/lib/api';

const API_BASE_URL = 'https://uklkuliner-production-f8f2.up.railway.app';

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || (role !== 'ADMIN' && role !== 'admin')) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [resData, restData] = await Promise.all([getAllReservations(), getRestaurants()]);
        console.log('Reservations data:', resData);
        setReservations(resData || []);
        setRestaurants(restData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const getRestaurantName = (id: number) => {
    const resto = restaurants.find(r => r.id === id);
    return resto ? resto.name : 'Restoran tidak ditemukan';
  };

  const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/uploads/${path}`;
  };

  const handleConfirm = async (id: number) => {
    if (!confirm('Konfirmasi reservasi ini?')) return;
    setActionLoading(id);
    try {
      await confirmReservation(id);
      alert('Reservasi dikonfirmasi');
      const [resData] = await Promise.all([getAllReservations()]);
      setReservations(resData || []);
    } catch (error) {
      alert('Gagal mengkonfirmasi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Tolak reservasi ini?')) return;
    setActionLoading(id);
    try {
      await rejectReservation(id);
      alert('Reservasi ditolak');
      const [resData] = await Promise.all([getAllReservations()]);
      setReservations(resData || []);
    } catch (error) {
      alert('Gagal menolak');
    } finally {
      setActionLoading(null);
    }
  };

  // PERBAIKAN: Gunakan paymentStatus, bukan status
  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus?.toUpperCase()) {
      case 'CONFIRMED':
        return <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle size={12} /> Terkonfirmasi</span>;
      case 'PENDING':
      case 'WAITING_CONFIRMATION':
        return <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><Clock size={12} /> Menunggu</span>;
      case 'REJECTED':
        return <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle size={12} /> Ditolak</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{paymentStatus || 'Diproses'}</span>;
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Reservasi</h1>
        <p className="text-gray-500 text-sm mt-1">Lihat, konfirmasi, atau tolak reservasi pelanggan</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Restoran</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Tanggal & Waktu</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Bukti Bayar</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">Belum ada reservasi</td></tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{getRestaurantName(res.restaurantId)}</p>
                      <p className="text-xs text-gray-500">ID: {res.id}</p>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{formatDate(res.reservationDate)}</td>
                    <td className="p-4">{getStatusBadge(res.paymentStatus)}</td>
                    <td className="p-4">
                      {res.paymentProof ? (
                        <button
                          onClick={() => window.open(getFullImageUrl(res.paymentProof), '_blank')}
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-xs"
                        >
                          <ImageIcon size={14} />
                          Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Belum upload</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/admin/reservations/${res.id}`} className="text-blue-600 hover:text-blue-700">
                          <Eye size={18} />
                        </Link>
                        {res.paymentStatus !== 'CONFIRMED' && res.paymentStatus !== 'REJECTED' && (
                          <>
                            <button
                              onClick={() => handleConfirm(res.id)}
                              disabled={actionLoading === res.id}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 disabled:opacity-50"
                            >
                              {actionLoading === res.id ? '...' : 'Terima'}
                            </button>
                            <button
                              onClick={() => handleReject(res.id)}
                              disabled={actionLoading === res.id}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 disabled:opacity-50"
                            >
                              {actionLoading === res.id ? '...' : 'Tolak'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}