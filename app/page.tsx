'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Search,
  Armchair,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
} from 'lucide-react';

import { getRestaurants } from '@/lib/api';
import { Restaurant } from '@/types';

import RestaurantCard from '@/components/RestaurantCard';
import TestimonialCard from '@/components/TestimonialCard';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testimonialStartIndex, setTestimonialStartIndex] = useState(0);
  const itemsPerPage = 3;

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setAllRestaurants(data || []);
      } catch (error) {
        console.error('Gagal fetch restoran:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = allRestaurants.filter(
      (resto) =>
        resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resto.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setShowResults(true);
  };

  const handleSeeAllRestaurants = (e: React.MouseEvent) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      router.push('/login?redirect=/restaurants');
    }
  };

  const testimonials = [
    {
      id: 1,
      name: 'Budi Santoso',
      role: 'Food Blogger',
      comment: 'Seatify memberikan pengalaman booking restoran yang luar biasa!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      name: 'Siti Aminah',
      role: 'Ibu Rumah Tangga',
      comment: 'Sangat praktis untuk booking meja keluarga. Rekomended!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 3,
      name: 'Reza Pratama',
      role: 'Food Enthusiast',
      comment: 'Status meja realtime, tidak pernah kecewa.',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: 4,
      name: 'Dewi Kartika',
      role: 'Event Organizer',
      comment: 'Solusi terbaik untuk acara gathering kantor.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      id: 5,
      name: 'Andi Wijaya',
      role: 'Travel Blogger',
      comment: 'Pas banget buat cari restoran pas liburan!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
      id: 6,
      name: 'Rina Safitri',
      role: 'Mahasiswa',
      comment: 'Gampang banget pakenya, langsung jadi!',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
  ];

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const visibleTestimonials = testimonials.slice(
    testimonialStartIndex,
    testimonialStartIndex + itemsPerPage
  );

  const nextTestimonial = () => {
    setTestimonialStartIndex(
      (prev) => (prev + itemsPerPage) % testimonials.length
    );
  };

  const prevTestimonial = () => {
    setTestimonialStartIndex((prev) => {
      const newIndex = prev - itemsPerPage;

      if (newIndex < 0) {
        return Math.max(0, testimonials.length - itemsPerPage);
      }

      return newIndex;
    });
  };

  const features = [
    {
      icon: Search,
      title: 'Cari Restoran',
      description:
        'Temukan restoran favorit dengan mudah berdasarkan nama atau lokasi',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Armchair,
      title: 'Pilih Meja',
      description:
        'Lihat ketersediaan meja indoor & outdoor secara realtime',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Calendar,
      title: 'Booking Online',
      description:
        'Reservasi cepat tanpa ribet, langsung dapat konfirmasi',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      icon: ShieldCheck,
      title: 'Terpercaya',
      description:
        'Sistem reservasi aman, data terjamin, dan terpercaya',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Restoran Partner', icon: TrendingUp },
    { value: '10K+', label: 'Pengguna Aktif', icon: Users },
    { value: '98%', label: 'Kepuasan Pelanggan', icon: Star },
    { value: '1 Menit', label: 'Booking Cepat', icon: Clock },
  ];

  return (
    <>
      {/* HERO SECTION - DENGAN SHADOW HITAM LEBIH KUAT */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: heroOpacity }}
        >
          <Image
            src="/cover1.png"
            alt="Restaurant Background"
            fill
            priority
            className="object-cover object-[center_20%]"
          />

          {/* OVERLAY HITAM LEBIH GELAP AGAR TEKS TERBACA */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-white to-transparent" />
        </motion.div>

        <div className="relative z-10 flex min-h-[85vh] sm:min-h-[90vh] flex-col justify-end pb-8 sm:pb-10 md:pb-14 lg:pb-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-md sm:max-w-xl md:max-w-lg lg:max-w-md ml-4 sm:ml-8 md:ml-16 lg:ml-20 xl:ml-32">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2] sm:leading-[1.15] tracking-tight"
              >
                <span className="text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                  Booking Meja
                </span>

                <br />

                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                  Restoran Favorit
                </span>

                <br />

                <span className="text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                  Jadi Lebih Mudah
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-3 sm:mt-4 md:mt-6 max-w-md text-sm sm:text-base text-white/90 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              >
                Cari restoran terbaik, pilih meja indoor atau outdoor dengan
                status realtime, lalu booking langsung tanpa perlu antri.
              </motion.p>
            </div>
          </div>
        </div>

        <div className="h-16 sm:h-20" />
      </section>

      {/* STATISTIK SECTION */}
      <section className="bg-white pt-20 sm:pt-28 pb-10 sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-3 sm:p-5 text-center shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100"
              >
                <div className="mx-auto mb-2 sm:mb-3 flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
                  <stat.icon size={18} className="text-amber-600" />
                </div>

                <div className="text-lg sm:text-2xl font-bold text-gray-800">
                  {stat.value}
                </div>

                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR SECTION - SAMA SEPERTI SEBELUMNYA */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[550px]">
                <Image
                  src="/barista.png"
                  alt="Barista"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </motion.div>

            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-left mb-8"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Layanan{' '}
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                    Unggulan
                  </span>
                </h2>

                <p className="mt-2 text-gray-500 text-sm">
                  Nikmati kemudahan booking restoran dengan fitur-fitur terbaik
                </p>
              </motion.div>

              <div className="grid gap-4 sm:gap-5">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="group flex gap-4 sm:gap-5 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-md transition-all duration-300 hover:shadow-xl border border-gray-100"
                  >
                    <div
                      className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon size={22} className="text-white" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESTORAN POPULER */}
      <section className="bg-white py-12 sm:py-20 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Restoran{' '}
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Populer
                </span>
              </h2>
              <p className="mt-2 text-gray-500 text-xs sm:text-sm">
                Pilihan restoran terbaik yang sering dipesan
              </p>
            </motion.div>

            <Link
              href="/restaurants"
              onClick={handleSeeAllRestaurants}
              className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-600 font-medium text-sm transition mt-3 sm:mt-0"
            >
              Lihat Semua Restoran
              <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 sm:h-80 animate-pulse rounded-xl sm:rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {allRestaurants.slice(0, 3).map((resto, idx) => (
                <RestaurantCard
                  key={resto.id}
                  restaurant={resto}
                  onClick={() =>
                    (window.location.href = `/restaurant/${resto.id}`)
                  }
                  index={idx}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="bg-white py-12 sm:py-20 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-6 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Apa Kata{' '}
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                Pengguna
              </span>
              ?
            </h2>

            <p className="mt-2 text-gray-500 text-xs sm:text-sm">
              Ribuan pengguna telah merasakan kemudahan booking melalui Seatify
            </p>
          </motion.div>

          <div className="relative">
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 rounded-full bg-white p-1.5 sm:p-2 shadow-xl text-gray-600 hover:bg-amber-500 hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleTestimonials.map((t, idx) => (
                <TestimonialCard key={t.id} {...t} index={idx} />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 sm:translate-x-4 rounded-full bg-white p-1.5 sm:p-2 shadow-xl text-gray-600 hover:bg-amber-500 hover:text-white transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-6 sm:mt-8 flex justify-center gap-1 sm:gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setTestimonialStartIndex(idx * itemsPerPage)
                }
                className={`h-1 rounded-full transition-all duration-500 ${
                  Math.floor(testimonialStartIndex / itemsPerPage) === idx
                    ? 'bg-amber-500 w-4 sm:w-6'
                    : 'bg-gray-300 w-1.5 sm:w-1.5 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// Komponen Users
function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}