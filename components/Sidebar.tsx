'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  UtensilsCrossed,
  Table,
  Coffee,
  Home,
} from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  role: 'user' | 'admin';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const userMenu = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Home', href: '/dashboard/user', icon: LayoutDashboard },
    { name: 'Reservasi Saya', href: '/dashboard/user/reservations', icon: Calendar },
    { name: 'Daftar Restoran', href: '/restaurants', icon: Coffee },
    { name: 'Profil', href: '/dashboard/user/profile', icon: User },
  ];

  const adminMenu = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Home', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Kelola Restoran', href: '/dashboard/admin/restaurants', icon: UtensilsCrossed },
    { name: 'Kelola Meja', href: '/dashboard/admin/tables', icon: Table },
    { name: 'Kelola Reservasi', href: '/dashboard/admin/reservations', icon: Calendar },
  ];

  const menu = role === 'admin' ? adminMenu : userMenu;
  const displayRole = role === 'admin' ? 'Admin' : 'User';

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-80 min-h-screen shadow-2xl"
    >
      <div className="absolute inset-0">
        <Image
          src="/sidebarbg2.png"
          alt="Sidebar Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="w-full bg-white/10 backdrop-blur-sm border-b border-white/10">
          <div className="w-full flex justify-center items-center py-4">
            <div className="relative w-36 h-36">
              <Image
                src="/logoputih.png"
                alt="Seatify Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <nav className="w-full flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menu.map((item, idx) => {
              const isActive = pathname === item.href;

              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + idx * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-5 py-3.5 text-[15px] transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-md backdrop-blur-sm font-semibold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.li>
              );
            })}

            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="mt-6 pt-4 border-t border-white/20"
            >
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-[15px] text-white/80 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
              >
                <LogOut size={20} />
                <span className="font-medium">Log Out</span>
              </button>
            </motion.li>
          </ul>
        </nav>

        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
            <span className="text-xs font-medium text-white/80 capitalize">{displayRole}</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}