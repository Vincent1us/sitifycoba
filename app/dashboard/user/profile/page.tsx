'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Calendar, 
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { getProfile } from '@/lib/api';

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        
        // Generate random avatar dari Random User API (foto orang asli)
        const randomId = Math.floor(Math.random() * 100);
        const gender = Math.random() > 0.5 ? 'men' : 'women';
        setAvatarUrl(`https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`);
      } catch (error) {
        console.error('Gagal fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Profil Saya</h1>
      <p className="text-gray-500 text-sm mb-6">Informasi akun Anda</p>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="h-24 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="px-6 pb-6">
          {/* Avatar - Foto Orang Asli */}
          <div className="flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
              <Image
                src={avatarUrl}
                alt="Profile Avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{profile?.name || 'Pengguna'}</h2>
            <p className="text-gray-500 text-sm">{profile?.role || 'User'}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail size={18} className="text-amber-500" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-700">{email || 'Belum diatur'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar size={18} className="text-amber-500" />
              <div>
                <p className="text-xs text-gray-400">Bergabung Sejak</p>
                <p className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <ShieldCheck size={18} className="text-amber-500" />
              <div>
                <p className="text-xs text-gray-400">Status Akun</p>
                <p className="text-sm font-medium text-green-600">Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}