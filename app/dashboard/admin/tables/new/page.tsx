'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createTable, getRestaurants } from '@/lib/api';

export default function NewTablePage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    locationType: 'INDOOR',
    status: 'AVAILABLE',
    restaurantId: '',
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createTable({
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
        locationType: formData.locationType,
        status: formData.status,
        restaurantId: parseInt(formData.restaurantId),
      });
      router.push('/dashboard/admin/tables');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambah meja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/tables" className="text-gray-500 hover:text-amber-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Meja</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restoran *</label>
            <select name="restaurantId" required value={formData.restaurantId} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="">Pilih Restoran</option>
              {restaurants.map((resto) => (
                <option key={resto.id} value={resto.id}>{resto.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Meja *</label>
            <input type="number" name="tableNumber" required value={formData.tableNumber} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas (orang) *</label>
            <input type="number" name="capacity" required value={formData.capacity} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Meja</label>
            <select name="locationType" value={formData.locationType} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="INDOOR">Indoor</option>
              <option value="OUTDOOR">Outdoor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="AVAILABLE">Tersedia</option>
              <option value="BOOKED">Dipesan</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Meja'}
          </button>
          <Link href="/dashboard/admin/tables" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}