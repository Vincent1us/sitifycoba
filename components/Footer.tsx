'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  Award,
  Users,
  Coffee,
  Heart,
  Globe
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Kolom 1: Brand & Deskripsi - Hanya Logo */}
          <div>
            <div className="mb-4">
              <div className="relative w-42 h-22">
                <Image
                  src="/logoputih.png"
                  alt="Seatify Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Platform booking restoran online terpercaya di Indonesia. 
              Temukan restoran favorit, pilih meja indoor/outdoor, 
              dan reservasi dalam hitungan menit.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors duration-300">
                <Globe size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors duration-300">
                <Mail size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors duration-300">
                <Heart size={16} className="text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Fitur Cepat */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Coffee size={18} className="text-amber-400" />
              Fitur Seatify
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/restaurants" className="text-sm text-gray-400 hover:text-amber-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-125 transition"></span>
                  Cari Restoran
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-sm text-gray-400 hover:text-amber-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-125 transition"></span>
                  Meja Indoor & Outdoor
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-sm text-gray-400 hover:text-amber-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-125 transition"></span>
                  Booking Online
                </Link>
              </li>
              <li>
                <Link href="/dashboard/user" className="text-sm text-gray-400 hover:text-amber-400 transition flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-125 transition"></span>
                  Riwayat Reservasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Informasi Kontak */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Users size={18} className="text-amber-400" />
              Hubungi Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Jl. Ijen No. 1, Kota Malang, Jawa Timur, Indonesia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-amber-400 flex-shrink-0" />
                <span>(0341) 1234567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-amber-400 flex-shrink-0" />
                <span>info@seatify.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-amber-400 flex-shrink-0" />
                <span>Senin - Minggu: 08.00 - 22.00</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Newsletter & Statistik */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              Bergabung dengan Kami
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Dapatkan promo menarik dan info restoran terbaru langsung ke emailmu!
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500 placeholder:text-gray-500"
              />
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 rounded-r-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center gap-1">
                <Send size={16} className="text-white" />
              </button>
            </div>
            
            {/* Statistik sederhana */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
              <div className="text-center">
                <p className="text-xl font-bold text-white">500+</p>
                <p className="text-xs text-gray-500">Restoran</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">10K+</p>
                <p className="text-xs text-gray-500">User Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Seatify. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-amber-400 transition">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-amber-400 transition">
                Syarat & Ketentuan
              </Link>
              <Link href="/faq" className="text-gray-500 hover:text-amber-400 transition">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}