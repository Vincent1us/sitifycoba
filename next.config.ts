/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asset.kompas.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uklkuliner-production-f8f2.up.railway.app',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
      // TAMBAHKAN INI UNTUK AVATAR PROFIL
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;