'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { getRestaurants, deleteTable } from '@/lib/api';

interface Table {
  id: number;
  tableNumber: number;
  capacity: number;
  locationType: string;
  status: string;
  restaurantId: number;
}

interface Restaurant {
  id: number;
  name: string;
  location: string;
  tables: Table[];
}

export default function AdminTablesPage() {
  const router = useRouter();
  const [allTables, setAllTables] = useState<Table[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || (role !== 'ADMIN' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const restaurantsData = await getRestaurants();
      console.log('Restaurants data:', restaurantsData);
      
      if (!restaurantsData || !Array.isArray(restaurantsData)) {
        setAllTables([]);
        setRestaurants([]);
        return;
      }
      
      setRestaurants(restaurantsData);
      
      // Kumpulkan semua meja dari setiap restoran
      const allTablesData: Table[] = [];
      restaurantsData.forEach((resto: Restaurant) => {
        if (resto.tables && Array.isArray(resto.tables) && resto.tables.length > 0) {
          resto.tables.forEach((table: Table) => {
            allTablesData.push({
              ...table,
              restaurantId: resto.id,
            });
          });
        }
      });
      setAllTables(allTablesData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantName = (restaurantId: number) => {
    const resto = restaurants.find(r => r.id === restaurantId);
    return resto ? resto.name : `Restoran ID: ${restaurantId}`;
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus meja ini?')) return;
    setDeleting(id);
    try {
      await deleteTable(id);
      setAllTables(allTables.filter(t => t.id !== id));
      alert('Meja berhasil dihapus');
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(error?.response?.data?.message || 'Gagal menghapus meja');
      fetchData(); // Refresh data jika gagal
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'available':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Tersedia</span>;
      case 'booked':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Dipesan</span>;
      case 'reserved':
        return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">Reserved</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{status || 'Unknown'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchData} 
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg mx-auto hover:bg-amber-600 transition"
        >
          <RefreshCw size={16} />
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Meja</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total {allTables.length} meja dari {restaurants.length} restoran
          </p>
        </div>
        <Link 
          href="/dashboard/admin/tables/new" 
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition"
        >
          <Plus size={16} />
          Tambah Meja
        </Link>
      </div>

      {allTables.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">Belum ada data meja</p>
          <Link href="/dashboard/admin/tables/new" className="inline-block mt-4 text-amber-500 hover:text-amber-600">
            Tambah meja pertama →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Restoran</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">No Meja</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Kapasitas</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Lokasi</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
              </thead>
              <tbody>
                {allTables.map((table) => (
                  <tr key={table.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-800 font-medium">
                      {getRestaurantName(table.restaurantId)}
                    </td>
                    <td className="p-4 text-gray-600">{table.tableNumber}</td>
                    <td className="p-4 text-gray-600">{table.capacity} orang</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        table.locationType === 'INDOOR' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {table.locationType}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(table.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <Link 
                          href={`/dashboard/admin/tables/${table.id}/edit`} 
                          className="text-amber-600 hover:text-amber-700 transition"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(table.id)} 
                          disabled={deleting === table.id} 
                          className="text-red-600 hover:text-red-700 transition disabled:opacity-50"
                        >
                          {deleting === table.id ? '...' : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}