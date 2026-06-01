'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getRestaurants, updateRestaurant } from '@/lib/api';

export default function EditRestaurantPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    dpAmount: '',
    bankName: '',
    bankAccount: '',
    accountName: '',
    openTime: '',
    closeTime: '',
    closedDay: '',
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurants = await getRestaurants();
        const restaurant = restaurants.find((r: any) => r.id === parseInt(id as string));
        if (restaurant) {
          setFormData({
            name: restaurant.name || '',
            location: restaurant.location || '',
            description: restaurant.description || '',
            dpAmount: restaurant.dpAmount || '',
            bankName: restaurant.bankName || '',
            bankAccount: restaurant.bankAccount || '',
            accountName: restaurant.accountName || '',
            openTime: restaurant.openTime || '',
            closeTime: restaurant.closeTime || '',
            closedDay: restaurant.closedDay || '-',
          });
        } else {
          setError('Restoran tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal mengambil data restoran');
      } finally {
        setFetching(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateRestaurant(parseInt(id as string), {
        ...formData,
        dpAmount: parseInt(formData.dpAmount) || 0,
      });
      router.push('/dashboard/admin/restaurants');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengupdate restoran');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/restaurants" className="text-gray-500 hover:text-amber-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Restoran</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Restoran *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi *</label>
            <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DP (Rp)</label>
            <input type="number" name="dpAmount" value={formData.dpAmount} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening</label>
            <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
            <input type="text" name="accountName" value={formData.accountName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Buka</label>
            <input type="time" name="openTime" value={formData.openTime} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Tutup</label>
            <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hari Tutup</label>
            <select name="closedDay" value={formData.closedDay} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="-">Tidak Ada</option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <Link href="/dashboard/admin/restaurants" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}