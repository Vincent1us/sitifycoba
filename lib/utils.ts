export const getImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return '/images/placeholder.jpg';
  if (imageName.startsWith('http')) return imageName;
  return `https://uklkuliner-production-f8f2.up.railway.app/uploads/${imageName}`;
};