'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CreditCard, 
  Building, 
  TreePine,
  Users,
  Calendar,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { getRestaurants, deleteRestaurant } from '@/lib/api';

const getImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return '/images/placeholder.jpg';
  if (imageName.startsWith('http')) return imageName;
  return `https://uklkuliner-production-f8f2.up.railway.app/uploads/${imageName}`;
};

export default function AdminRestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || (role !== 'ADMIN' && role !== 'admin')) {
      router.push('/login');
      return;
    }

    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurants();
        const found = data.find((r: any) => r.id === parseInt(id as string));
        if (found) {
          setRestaurant(found);
        } else {
          setError('Restoran tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal mengambil data restoran');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus restoran ini?')) return;
    try {
      await deleteRestaurant(restaurant.id);
      alert('Restoran berhasil dihapus');
      router.push('/dashboard/admin/restaurants');
    } catch (error) {
      alert('Gagal menghapus restoran');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
          {error || 'Restoran tidak ditemukan'}
        </div>
        <Link href="/dashboard/admin/restaurants" className="inline-block mt-4 text-amber-600">
          Kembali ke Daftar Restoran
        </Link>
      </div>
    );
  }

  const availableTables = restaurant.tables?.filter((t: any) => t.status === 'AVAILABLE') || [];
  const indoorTables = availableTables.filter((t: any) => t.locationType === 'INDOOR');
  const outdoorTables = availableTables.filter((t: any) => t.locationType === 'OUTDOOR');

  return (
    <div className="p-6">
      {/* Tombol Kembali */}
      <div className="mb-4">
        <Link
          href="/dashboard/admin/restaurants"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-500 transition"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar Restoran
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="relative h-48 md:h-64">
          <Image
            src={getImageUrl(restaurant.image)}
            alt={restaurant.name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-white/80 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {restaurant.location}
            </p>
          </div>
        </div>
      </div>

      {/* Informasi Restoran */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Kolom Kiri - Detail */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building size={20} className="text-amber-500" />
              Informasi Restoran
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Nama</span>
                <span className="font-medium text-gray-800">{restaurant.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Lokasi</span>
                <span className="font-medium text-gray-800">{restaurant.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Deskripsi</span>
                <span className="font-medium text-gray-800">{restaurant.description || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Jam Operasional</span>
                <span className="font-medium text-gray-800">{restaurant.openTime} - {restaurant.closeTime}</span>
              </div>
              {restaurant.closedDay !== '-' && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Hari Tutup</span>
                  <span className="font-medium text-red-500">{restaurant.closedDay}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-amber-500" />
              Informasi Pembayaran
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">DP</span>
                <span className="font-semibold text-gray-800">Rp {restaurant.dpAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Bank</span>
                <span className="font-medium text-gray-800">{restaurant.bankName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">No. Rekening</span>
                <span className="font-medium text-gray-800">{restaurant.bankAccount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Atas Nama</span>
                <span className="font-medium text-gray-800">{restaurant.accountName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Meja */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-amber-500" />
              Daftar Meja
              <span className="text-sm text-gray-400 ml-auto">{availableTables.length} meja</span>
            </h2>

            {/* Indoor Tables */}
            {indoorTables.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Building size={16} className="text-blue-500" />
                  Indoor
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {indoorTables.map((table: any) => (
                    <div key={table.id} className="p-3 rounded-xl border border-gray-200 text-center">
                      <div className="font-bold text-gray-800">Meja {table.tableNumber}</div>
                      <div className="text-xs text-gray-500 mt-1">{table.capacity} orang</div>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Tersedia
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outdoor Tables */}
            {outdoorTables.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <TreePine size={16} className="text-green-500" />
                  Outdoor
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {outdoorTables.map((table: any) => (
                    <div key={table.id} className="p-3 rounded-xl border border-gray-200 text-center">
                      <div className="font-bold text-gray-800">Meja {table.tableNumber}</div>
                      <div className="text-xs text-gray-500 mt-1">{table.capacity} orang</div>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Tersedia
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {indoorTables.length === 0 && outdoorTables.length === 0 && (
              <p className="text-center text-gray-500 py-8">Belum ada meja untuk restoran ini</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3">
            <Link
              href={`/dashboard/admin/restaurants/${restaurant.id}/edit`}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
            >
              <Edit size={18} />
              Edit Restoran
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
            >
              <Trash2 size={18} />
              Hapus Restoran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}