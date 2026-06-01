'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRestaurants, createReservation } from '@/lib/api';
import { Restaurant, Table } from '@/types';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  Building, 
  TreePine, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ArrowLeft,
  Map as MapIcon,
  Star,
  Utensils
} from 'lucide-react';
import Image from 'next/image';

const getImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return '/images/placeholder.jpg';
  if (imageName.startsWith('http')) return imageName;
  return `https://uklkuliner-production-f8f2.up.railway.app/uploads/${imageName}`;
};

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurants = await getRestaurants();
        const found = restaurants.find((r: Restaurant) => r.id === parseInt(id as string));
        setRestaurant(found);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError('Gagal mengambil data restoran');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedTable) {
      setError('Pilih meja terlebih dahulu');
      return;
    }
    if (!reservationDate) {
      setError('Pilih tanggal reservasi');
      return;
    }
    if (!reservationTime) {
      setError('Pilih jam reservasi');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
    setBookingLoading(true);
    setError('');
    try {
      const fullDateTime = `${reservationDate}T${reservationTime}:00`;
      await createReservation({
        restaurantId: restaurant!.id,
        tableId: selectedTable.id,
        reservationDate: fullDateTime
      });
      setSuccess('Booking berhasil!');
      setTimeout(() => router.push('/dashboard/user'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking gagal');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-gray-200 rounded-full mb-6" />
            <div className="h-96 bg-gray-200 rounded-2xl mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-2xl" />
                <div className="h-80 bg-gray-200 rounded-2xl" />
              </div>
              <div className="h-[600px] bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <AlertCircle size={64} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Restoran tidak ditemukan</p>
          <Link href="/restaurants" className="inline-block mt-4 text-amber-500 hover:text-amber-600 font-medium">
            Kembali ke Daftar Restoran
          </Link>
        </motion.div>
      </div>
    );
  }

  const availableTables = restaurant.tables.filter(t => t.status === 'AVAILABLE');
  const indoorTables = availableTables.filter(t => t.locationType === 'INDOOR');
  const outdoorTables = availableTables.filter(t => t.locationType === 'OUTDOOR');

  const timeSlots = [];
  for (let i = 8; i <= 23; i++) {
    const hour = i.toString().padStart(2, '0');
    timeSlots.push(`${hour}:00`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tombol Kembali */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-all duration-300 group bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Kembali ke Daftar Restoran</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 group"
        >
          <div className="relative h-64 md:h-96">
            <Image
              src={getImageUrl(restaurant.image)}
              alt={restaurant.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Utensils size={14} />
                  <span className="text-xs">Restaurant</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star size={14} />
                  <span className="text-xs">4.8 Rating</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm mb-3">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {restaurant.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {restaurant.openTime} - {restaurant.closeTime}
                </span>
                {restaurant.closedDay !== '-' && (
                  <span className="flex items-center gap-1 text-red-300">
                    <AlertCircle size={16} />
                    Tutup: {restaurant.closedDay}
                  </span>
                )}
              </div>
              <p className="text-white/90 max-w-2xl text-sm md:text-base line-clamp-2">{restaurant.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Kolom Kiri - Meja & Maps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daftar Meja */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Users size={22} className="text-amber-500" />
                  Pilih Meja
                </h2>
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {availableTables.length} meja tersedia
                </span>
              </div>

              {/* Indoor Tables */}
              {indoorTables.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Building size={18} className="text-blue-500" />
                    Indoor
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {indoorTables.map((table, idx) => (
                      <motion.button
                        key={table.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTable(table)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                          selectedTable?.id === table.id
                            ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200'
                            : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'
                        }`}
                      >
                        <div className="font-bold text-gray-800 text-lg">Meja {table.tableNumber}</div>
                        <div className="text-xs text-gray-500 mt-1">{table.capacity} orang</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Outdoor Tables */}
              {outdoorTables.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <TreePine size={18} className="text-green-500" />
                    Outdoor
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {outdoorTables.map((table, idx) => (
                      <motion.button
                        key={table.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTable(table)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                          selectedTable?.id === table.id
                            ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200'
                            : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30'
                        }`}
                      >
                        <div className="font-bold text-gray-800 text-lg">Meja {table.tableNumber}</div>
                        <div className="text-xs text-gray-500 mt-1">{table.capacity} orang</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {indoorTables.length === 0 && outdoorTables.length === 0 && (
                <p className="text-center text-gray-500 py-8">Tidak ada meja tersedia saat ini</p>
              )}
            </motion.div>

            {/* Google Maps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapIcon size={22} className="text-amber-500" />
                Lokasi Restoran
              </h2>
              <div className="rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.location)}&output=embed`}
                  className="w-full h-64 md:h-80"
                  allowFullScreen
                  loading="lazy"
                  title="Google Maps"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                <MapPin size={14} />
                {restaurant.location}
              </p>
            </motion.div>
          </div>

          {/* Kolom Kanan - Form Booking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar size={22} className="text-amber-500" />
                Booking Meja
              </h2>

              {selectedTable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                >
                  <p className="text-sm text-gray-600 mb-1">Meja terpilih:</p>
                  <p className="font-bold text-gray-800 text-lg">
                    Meja {selectedTable.tableNumber}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">📍 {selectedTable.locationType}</span>
                    <span className="text-gray-600">👥 {selectedTable.capacity} orang</span>
                  </div>
                </motion.div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tanggal Reservasi
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Jam Reservasi
                  </label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none transition-all duration-300"
                    >
                      <option value="">Pilih Jam</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600 text-sm"
                >
                  <CheckCircle size={16} />
                  {success}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={handleBooking}
                disabled={bookingLoading || !selectedTable}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
              >
                {bookingLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Memproses...
                  </div>
                ) : (
                  'Konfirmasi Booking'
                )}
              </motion.button>

              {/* Informasi Pembayaran */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <CreditCard size={16} className="text-amber-500" />
                  Informasi Pembayaran
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">DP:</span>
                    <span className="font-semibold text-gray-700">Rp {restaurant.dpAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-medium text-gray-700">{restaurant.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Rekening:</span>
                    <span className="font-medium text-gray-700">{restaurant.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Atas Nama:</span>
                    <span className="font-medium text-gray-700">{restaurant.accountName}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}