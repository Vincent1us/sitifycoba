'use client';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </motion.div>
  );
}