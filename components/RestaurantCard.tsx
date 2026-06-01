'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Restaurant } from '@/types';

// Fungsi helper untuk mendapatkan URL gambar
const getImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return '/images/placeholder.jpg';
  if (imageName.startsWith('http')) return imageName;
  return `https://uklkuliner-production-f8f2.up.railway.app/uploads/${imageName}`;
};

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  index: number;
}

export default function RestaurantCard({ restaurant, onClick, index }: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 cursor-pointer"
    >
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(restaurant.image)}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
          }}
        />
        {/* Gradasi hitam dari bawah */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-bold mb-1">{restaurant.name}</h3>
        <p className="text-sm text-gray-300 mb-2 flex items-center gap-1">
          <MapPin size={14} className="text-amber-400" />
          {restaurant.location}
        </p>
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{restaurant.description}</p>
        <motion.div 
          whileHover={{ x: 5 }}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-amber-500/80 group-hover:shadow-lg transition-all duration-300"
        >
          Lihat Meja
          <ArrowRight size={14} />
        </motion.div>
      </div>
    </motion.div>
  );
}