'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getReservationById, getRestaurants, confirmReservation, rejectReservation } from '@/lib/api';

export default function ReservationDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [reservation, setReservation] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await getReservationById(parseInt(id as string));
        setReservation(resData);
        
        const restaurantsData = await getRestaurants();
        const resto = restaurantsData.find((r: any) => r.id === resData.restaurantId);
        setRestaurant(resto);
      } catch (err) {
        setError('Gagal mengambil data reservasi');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      await confirmReservation(parseInt(id as string));
      setReservation({ ...reservation, status: 'confirmed' });
      alert('Reservasi dikonfirmasi');
    } catch (error) {
      alert('Gagal mengkonfirmasi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await rejectReservation(parseInt(id as string));
      setReservation({ ...reservation, status: 'rejected' });
      alert('Reservasi ditolak');
    } catch (error) {
      alert('Gagal menolak');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"><CheckCircle size={14} /> Terkonfirmasi</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700"><Clock size={14} /> Menunggu</span>;
      case 'rejected':
      case 'cancelled':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"><XCircle size={14} /> Dibatalkan</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (error || !reservation) {
    return <div className="text-center py-12 text-red-500">{error || 'Reservasi tidak ditemukan'}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/reservations" className="text-gray-500 hover:text-amber-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Detail Reservasi</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{restaurant?.name || 'Restoran'}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {restaurant?.location || 'Alamat tidak tersedia'}
              </p>
            </div>
            {getStatusBadge(reservation.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={18} className="text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">Tanggal Reservasi</p>
                  <p className="font-medium text-gray-700">{formatDate(reservation.reservationDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User size={18} className="text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">ID User</p>
                  <p className="font-medium text-gray-700">{reservation.userId}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock size={18} className="text-amber-500" />
                <div>
                  <p className="text-xs text-gray-400">Dibuat Pada</p>
                  <p className="font-medium text-gray-700">{new Date(reservation.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-amber-500 font-medium">Meja</span>
                <div>
                  <p className="text-xs text-gray-400">ID Meja</p>
                  <p className="font-medium text-gray-700">{reservation.tableId}</p>
                </div>
              </div>
            </div>
          </div>

          {reservation.status === 'pending' && (
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
              <button onClick={handleConfirm} disabled={actionLoading} className="bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50">
                {actionLoading ? 'Memproses...' : 'Konfirmasi Reservasi'}
              </button>
              <button onClick={handleReject} disabled={actionLoading} className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50">
                {actionLoading ? 'Memproses...' : 'Tolak Reservasi'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}