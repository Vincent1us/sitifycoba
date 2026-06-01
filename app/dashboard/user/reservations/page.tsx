'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowLeft,
  AlertCircle,
  Upload
} from 'lucide-react';
import { getMyReservations, getRestaurants, cancelReservation, uploadPaymentProof } from '@/lib/api';

interface Reservation {
  id: number;
  restaurantId: number;
  reservationDate: string;
  paymentStatus: string;
  paymentProof?: string;
}

interface Restaurant {
  id: number;
  name: string;
  location: string;
}

export default function UserReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [reservationsData, restaurantsData] = await Promise.all([
        getMyReservations(),
        getRestaurants(),
      ]);
      setReservations(reservationsData || []);
      setRestaurants(restaurantsData || []);
    } catch (error) {
      console.error('Gagal fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantName = (id: number) => {
    const resto = restaurants.find(r => r.id === id);
    return resto ? resto.name : 'Restoran tidak ditemukan';
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) return;
    setCancelling(id);
    try {
      await cancelReservation(id);
      fetchData();
      alert('Reservasi berhasil dibatalkan');
    } catch (error) {
      alert('Gagal membatalkan reservasi');
    } finally {
      setCancelling(null);
    }
  };

  const handleUploadPayment = async (reservationId: number, file?: File) => {
    if (!file) return;
    setUploading(reservationId);
    try {
      await uploadPaymentProof(reservationId, file);
      alert('Bukti pembayaran berhasil diupload!');
      fetchData();
    } catch (error) {
      alert('Gagal upload bukti pembayaran');
    } finally {
      setUploading(null);
    }
  };

  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus?.toUpperCase()) {
      case 'CONFIRMED':
        return { icon: CheckCircle, text: 'Terkonfirmasi', color: 'bg-green-100 text-green-700' };
      case 'PENDING':
      case 'WAITING_CONFIRMATION':
        return { icon: Clock, text: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' };
      case 'REJECTED':
        return { icon: XCircle, text: 'Ditolak', color: 'bg-red-100 text-red-700' };
      case 'PAID':
        return { icon: CheckCircle, text: 'Lunas', color: 'bg-blue-100 text-blue-700' };
      default:
        return { icon: Clock, text: paymentStatus || 'Diproses', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isActive = (date: string, paymentStatus: string) => {
    return new Date(date) >= new Date() && 
           paymentStatus?.toUpperCase() !== 'REJECTED' &&
           paymentStatus?.toUpperCase() !== 'CANCELLED';
  };

  const activeReservations = reservations.filter(r => isActive(r.reservationDate, r.paymentStatus));
  const pastReservations = reservations.filter(r => !isActive(r.reservationDate, r.paymentStatus));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Reservasi Saya</h1>
      <p className="text-gray-500 text-sm mb-6">Lihat dan kelola semua reservasi Anda</p>

      {/* Reservasi Aktif */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-green-500" />
          Reservasi Aktif ({activeReservations.length})
        </h2>

        {activeReservations.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada reservasi aktif</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeReservations.map((res) => {
              const status = getStatusBadge(res.paymentStatus);
              const StatusIcon = status.icon;
              const showUpload = res.paymentStatus?.toUpperCase() === 'PENDING' || 
                                 res.paymentStatus?.toUpperCase() === 'WAITING_CONFIRMATION';
              const isCancellable = res.paymentStatus?.toUpperCase() !== 'CONFIRMED' &&
                                    res.paymentStatus?.toUpperCase() !== 'REJECTED' &&
                                    res.paymentStatus?.toUpperCase() !== 'PAID';
              
              return (
                <div key={res.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{getRestaurantName(res.restaurantId)}</h3>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(res.reservationDate)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.text}
                      </span>
                      <Link href={`/restaurant/${res.restaurantId}`} className="text-amber-600 text-sm hover:text-amber-700">
                        Detail Restoran
                      </Link>
                      {isCancellable && (
                        <button
                          onClick={() => handleCancel(res.id)}
                          disabled={cancelling === res.id}
                          className="text-red-500 text-sm hover:text-red-600 disabled:opacity-50"
                        >
                          {cancelling === res.id ? '...' : 'Batalkan'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {showUpload && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <label className="block text-xs text-gray-500 mb-2">Upload Bukti Pembayaran:</label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id={`file-${res.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadPayment(res.id, e.target.files?.[0])}
                        />
                        <button
                          onClick={() => document.getElementById(`file-${res.id}`)?.click()}
                          disabled={uploading === res.id}
                          className="flex items-center gap-1 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                        >
                          <Upload size={14} />
                          {uploading === res.id ? 'Mengupload...' : 'Pilih File'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Riwayat Reservasi */}
      {pastReservations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-gray-500" />
            Riwayat Reservasi ({pastReservations.length})
          </h2>
          <div className="space-y-3">
            {pastReservations.map((res) => {
              const status = getStatusBadge(res.paymentStatus);
              const StatusIcon = status.icon;
              return (
                <div key={res.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{getRestaurantName(res.restaurantId)}</h3>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(res.reservationDate)}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}