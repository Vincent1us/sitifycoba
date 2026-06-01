'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <>
      {/* Navbar Container */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <nav
          style={{
            width: isScrolled ? '70%' : 'calc(100% - 3rem)',
            maxWidth: isScrolled ? '900px' : '1400px',
            height: '72px',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'white',
            boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
            borderRadius: '100px',
            transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Logo - Diperkecil */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <div
              style={{
                position: 'relative',
                width: isScrolled ? '130px' : '150px',
                height: '100%',
                transition: '0.3s',
              }}
            >
              <Image
                src="/seatify5.png"
                alt="Seatify Logo"
                fill
                style={{
                  objectFit: 'contain',
                  objectPosition: 'left center',
                }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isScrolled ? '1.5rem' : '2rem', transition: '0.3s' }} className="desktop-links">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  style={{
                    textDecoration: 'none',
                    color: '#4b5563',
                    fontWeight: 500,
                    transition: '0.3s',
                    fontSize: isScrolled ? '0.875rem' : '0.95rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: isScrolled ? '0.5rem 1.25rem' : '0.625rem 1.5rem',
                    borderRadius: '100px',
                    fontWeight: 700,
                    fontSize: isScrolled ? '0.875rem' : '0.95rem',
                    textDecoration: 'none',
                    transition: '0.3s',
                    boxShadow: 'rgba(245, 158, 11, 0.2) 0px 4px 12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Daftar
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/user"
                  style={{
                    textDecoration: 'none',
                    color: '#4b5563',
                    fontWeight: 500,
                    fontSize: isScrolled ? '0.875rem' : '0.95rem',
                    transition: '0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}
                >
                  Booking Saya
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: isScrolled ? '0.5rem 1.25rem' : '0.625rem 1.5rem',
                    borderRadius: '100px',
                    fontWeight: 700,
                    fontSize: isScrolled ? '0.875rem' : '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: '0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Keluar
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#f59e0b',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>

      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            left: '1.5rem',
            right: '1.5rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  style={{ padding: '0.75rem', textAlign: 'center', textDecoration: 'none', color: '#4b5563', borderRadius: '12px' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '0.75rem',
                    textAlign: 'center',
                    borderRadius: '100px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/user"
                  style={{ padding: '0.75rem', textAlign: 'center', textDecoration: 'none', color: '#4b5563' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Booking Saya
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.75rem',
                    textAlign: 'center',
                    borderRadius: '100px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Keluar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}