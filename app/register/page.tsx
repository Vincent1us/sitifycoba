'use client';
import { useState } from 'react';
import { register } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(name, email, password);
      setSuccess('Register berhasil! Silakan login.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Register gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-20 pb-10">
      {/* Background Image HD dengan Shadow Putih */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <Image
          src="/coverregis.png"
          alt="Background"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay gradasi soft agar tidak terlalu blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/30"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md mb-2">
                Daftar Akun
              </h2>
              <p className="text-white/60 text-sm drop-shadow-sm">
                Bergabung dan booking restoran favoritmu
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 text-red-200 p-3 rounded-xl mb-4 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-green-500/20 backdrop-blur-sm border border-green-400/40 text-green-200 p-3 rounded-xl mb-4 text-sm text-center"
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label className="block text-white/80 text-sm font-medium mb-1.5 drop-shadow-sm">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-10 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label className="block text-white/80 text-sm font-medium mb-1.5 drop-shadow-sm">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-10 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label className="block text-white/80 text-sm font-medium mb-1.5 drop-shadow-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-10 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Daftar
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="text-center text-white/60 text-sm mt-6 drop-shadow-sm"
            >
              Sudah punya akun?{' '}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition">
                Masuk di sini
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}