'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, RefreshCw } from 'lucide-react';
import { getRestaurants } from '@/lib/api';
import { Restaurant } from '@/types';
import Sidebar from '@/components/Sidebar';

// Fungsi helper untuk mendapatkan URL gambar
const getImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return '/images/placeholder.jpg';
  if (imageName.startsWith('http')) return imageName;
  return `https://uklkuliner-production-f8f2.up.railway.app/uploads/${imageName}`;
};

export default function AllRestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole')?.toLowerCase() || 'user';
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setRole(userRole === 'admin' ? 'admin' : 'user');
    fetchRestaurants();
  }, [router]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const data = await getRestaurants();
      console.log('Fetched restaurants:', data);
      setRestaurants(data || []);
      setFilteredRestaurants(data || []);
    } catch (error) {
      console.error('Gagal fetch restoran:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        (resto) =>
          resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resto.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery, restaurants]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role={role} />
        <main className="flex-1">
          <div className="p-6 md:p-8">
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />
      
      {/* MAIN CONTENT - MEPET KE SIDEBAR DENGAN JARAK */}
      <main className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Semua Restoran</h1>
              <p className="text-gray-500 mt-2">Temukan restoran favorit Anda dan booking meja sekarang</p>
            </div>
            <button
              onClick={fetchRestaurants}
              className="flex items-center gap-2 text-gray-500 hover:text-amber-500 transition"
              title="Refresh data"
            >
              <RefreshCw size={18} />
              <span className="text-sm hidden sm:inline">Refresh</span>
            </button>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari restoran atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{filteredRestaurants.length}</span> restoran
            </p>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <Search size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tidak ada restoran yang ditemukan</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((resto, idx) => (
                <motion.div
                  key={resto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(resto.image)}
                      alt={resto.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full">
                        {resto.tables?.filter(t => t.status === 'AVAILABLE').length || 0} meja tersedia
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{resto.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin size={14} />
                      {resto.location}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{resto.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        {resto.openTime} - {resto.closeTime}
                      </div>
                      <Link
                        href={`/restaurant/${resto.id}`}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition"
                      >
                        Lihat Meja
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}