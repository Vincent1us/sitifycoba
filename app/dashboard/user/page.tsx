'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Coffee, 
  History, 
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Upload
} from 'lucide-react';
import { getMyReservations, getRestaurants, uploadPaymentProof } from '@/lib/api';

interface Reservation {
  id: number;
  restaurantId: number;
  reservationDate: string;
  paymentStatus: string;  // ← UBAH: dari 'status' menjadi 'paymentStatus'
  paymentProof?: string;
}

interface Restaurant {
  id: number;
  name: string;
  location: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const email = localStorage.getItem('userEmail') || 'Pengguna';
    setUserName(email.split('@')[0]);

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [reservationsData, restaurantsData] = await Promise.all([
        getMyReservations(),
        getRestaurants(),
      ]);
      console.log('User reservations:', reservationsData);
      setReservations(reservationsData || []);
      setRestaurants(restaurantsData || []);
    } catch (error) {
      console.error('Gagal fetch data:', error);
    } finally {
      setLoading(false);
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

  const getRestaurantName = (id: number) => {
    const resto = restaurants.find(r => r.id === id);
    return resto ? resto.name : 'Restoran tidak ditemukan';
  };

  // PERBAIKAN: Gunakan paymentStatus
  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus?.toUpperCase()) {
      case 'CONFIRMED':
        return { icon: CheckCircle, text: 'Terkonfirmasi', color: 'bg-green-100 text-green-700' };
      case 'PENDING':
      case 'WAITING_CONFIRMATION':
        return { icon: Clock, text: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' };
      case 'REJECTED':
        return { icon: XCircle, text: 'Ditolak', color: 'bg-red-100 text-red-700' };
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

  // Filter berdasarkan paymentStatus (bukan status)
  const activeReservations = reservations.filter(
    (r) => new Date(r.reservationDate) >= new Date() && 
          r.paymentStatus?.toUpperCase() !== 'REJECTED' &&
          r.paymentStatus?.toUpperCase() !== 'CANCELLED'
  );
  const upcomingCount = activeReservations.length;
  const totalCount = reservations.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Halo, {userName}!
        </h1>
        <p className="text-gray-500 mt-1">Selamat datang di dashboard Anda</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Reservasi</p>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <History size={18} className="text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Reservasi Aktif</p>
              <p className="text-2xl font-bold text-green-600">{upcomingCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Restoran Tersedia</p>
              <p className="text-2xl font-bold text-amber-600">{restaurants.length}+</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Coffee size={18} className="text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Coffee size={18} />
          Booking Restoran Baru
          <ArrowRight size={16} />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar size={20} className="text-amber-500" />
          Reservasi Terbaru
        </h2>

        {activeReservations.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
            <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada reservasi</p>
            <Link href="/" className="inline-block mt-2 text-amber-500 hover:text-amber-600 text-sm">
              Booking sekarang →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeReservations.slice(0, 3).map((res) => {
              const status = getStatusBadge(res.paymentStatus);
              const StatusIcon = status.icon;
              // Tombol upload muncul untuk status PENDING atau WAITING_CONFIRMATION
              const showUpload = res.paymentStatus?.toUpperCase() === 'PENDING' || 
                                 res.paymentStatus?.toUpperCase() === 'WAITING_CONFIRMATION';
              
              return (
                <div key={res.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">{getRestaurantName(res.restaurantId)}</h3>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(res.reservationDate)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.text}
                      </span>
                      <Link href={`/restaurant/${res.restaurantId}`} className="text-amber-600 text-sm hover:text-amber-700">
                        Detail
                      </Link>
                    </div>
                  </div>
                  
                  {/* Upload Bukti Pembayaran */}
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

        {reservations.length > 3 && (
          <div className="mt-3 text-center">
            <Link href="/dashboard/user/reservations" className="text-amber-500 text-sm hover:text-amber-600">
              Lihat semua reservasi →
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}