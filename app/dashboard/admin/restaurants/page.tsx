'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
import { getRestaurants, deleteRestaurant, createRestaurant, updateRestaurant } from '@/lib/api';
import Image from 'next/image';

export default function AdminRestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
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
    closedDay: '-',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token || (role !== 'ADMIN' && role !== 'admin')) {
      router.push('/login');
      return;
    }
    fetchRestaurants();
  }, [router]);

  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus restoran ini?')) return;
    setDeleting(id);
    try {
      await deleteRestaurant(id);
      setRestaurants(restaurants.filter(r => r.id !== id));
      alert('Restoran berhasil dihapus');
    } catch (error) {
      alert('Gagal menghapus restoran');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (resto: any) => {
    setEditingRestaurant(resto);
    setFormData({
      name: resto.name || '',
      location: resto.location || '',
      description: resto.description || '',
      dpAmount: resto.dpAmount?.toString() || '',
      bankName: resto.bankName || '',
      bankAccount: resto.bankAccount || '',
      accountName: resto.accountName || '',
      openTime: resto.openTime || '',
      closeTime: resto.closeTime || '',
      closedDay: resto.closedDay || '-',
      image: null,
    });
    setImagePreview(resto.image ? `https://uklkuliner-production-f8f2.up.railway.app/uploads/${resto.image}` : null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const submitData: any = {};
      submitData.name = formData.name;
      submitData.location = formData.location;
      submitData.description = formData.description;
      submitData.dpAmount = parseInt(formData.dpAmount) || 0;
      submitData.bankName = formData.bankName;
      submitData.bankAccount = formData.bankAccount;
      submitData.accountName = formData.accountName;
      submitData.openTime = formData.openTime;
      submitData.closeTime = formData.closeTime;
      submitData.closedDay = formData.closedDay;

      if (editingRestaurant) {
        // UPDATE: jika ada file baru, kirim FormData
        if (formData.image) {
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('location', formData.location);
          formDataToSend.append('description', formData.description);
          formDataToSend.append('dpAmount', formData.dpAmount);
          formDataToSend.append('bankName', formData.bankName);
          formDataToSend.append('bankAccount', formData.bankAccount);
          formDataToSend.append('accountName', formData.accountName);
          formDataToSend.append('openTime', formData.openTime);
          formDataToSend.append('closeTime', formData.closeTime);
          formDataToSend.append('closedDay', formData.closedDay);
          formDataToSend.append('image', formData.image);
          await updateRestaurant(editingRestaurant.id, formDataToSend);
        } else {
          // tanpa gambar, kirim JSON biasa
          await updateRestaurant(editingRestaurant.id, submitData);
        }
        alert('Restoran berhasil diupdate!');
      } else {
        // CREATE: selalu pakai FormData untuk upload gambar
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('dpAmount', formData.dpAmount);
        formDataToSend.append('bankName', formData.bankName);
        formDataToSend.append('bankAccount', formData.bankAccount);
        formDataToSend.append('accountName', formData.accountName);
        formDataToSend.append('openTime', formData.openTime);
        formDataToSend.append('closeTime', formData.closeTime);
        formDataToSend.append('closedDay', formData.closedDay);
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }
        await createRestaurant(formDataToSend);
        alert('Restoran berhasil ditambahkan!');
      }
      
      setShowModal(false);
      setEditingRestaurant(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        dpAmount: '',
        bankName: '',
        bankAccount: '',
        accountName: '',
        openTime: '',
        closeTime: '',
        closedDay: '-',
        image: null,
      });
      setImagePreview(null);
      fetchRestaurants();
    } catch (error) {
      console.error('Error:', error);
      alert(editingRestaurant ? 'Gagal mengupdate restoran' : 'Gagal menambahkan restoran');
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
    setFormData({
      name: '',
      location: '',
      description: '',
      dpAmount: '',
      bankName: '',
      bankAccount: '',
      accountName: '',
      openTime: '',
      closeTime: '',
      closedDay: '-',
      image: null,
    });
    setImagePreview(null);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Restoran</h1>
          <p className="text-gray-500 text-sm mt-1">Tambah, edit, atau hapus restoran</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition"
        >
          <Plus size={16} />
          Tambah Restoran
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((resto) => (
          <div key={resto.id} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
            <div className="relative h-40 bg-gradient-to-r from-amber-500 to-orange-500">
              {resto.image && (
                <Image
                  src={`https://uklkuliner-production-f8f2.up.railway.app/uploads/${resto.image}`}
                  alt={resto.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-3 left-4 text-white">
                <h3 className="font-bold text-lg">{resto.name}</h3>
                <p className="text-sm text-white/80">{resto.location}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{resto.description}</p>
              <div className="flex gap-3">
                <Link href={`/restaurant/${resto.id}`} className="text-blue-600 text-sm" target="_blank">
                  <Eye size={16} />
                </Link>
                <button onClick={() => handleEdit(resto)} className="text-amber-600 text-sm">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(resto.id)} disabled={deleting === resto.id} className="text-red-600 text-sm">
                  {deleting === resto.id ? '...' : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah/Edit Restoran */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingRestaurant ? 'Edit Restoran' : 'Tambah Restoran Baru'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Restoran *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DP (Rp)</label>
                  <input
                    type="number"
                    value={formData.dpAmount}
                    onChange={(e) => setFormData({ ...formData, dpAmount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening</label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Buka</label>
                  <input
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Tutup</label>
                  <input
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hari Tutup</label>
                  <select
                    value={formData.closedDay}
                    onChange={(e) => setFormData({ ...formData, closedDay: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Restoran</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="h-32 mx-auto object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={32} className="text-gray-400" />
                        <span className="text-sm text-gray-500">Klik untuk upload gambar</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
                >
                  {uploading ? 'Menyimpan...' : (editingRestaurant ? 'Update Restoran' : 'Simpan Restoran')}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}