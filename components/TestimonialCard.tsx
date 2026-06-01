'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
  index: number;
}

export default function TestimonialCard({ name, role, comment, rating, avatar, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 ring-2 ring-orange-200">
          <Image src={avatar} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-orange-500">{role}</p>
        </div>
      </div>
      <div className="flex text-yellow-400 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
      <p className="text-gray-600 italic">"{comment}"</p>
    </motion.div>
  );
}