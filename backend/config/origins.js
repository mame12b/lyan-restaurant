const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

  const baseOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173', // Vite default
    'https://lyan-restaurant.vercel.app',
    'https://lyan-restaurant-10e01qkw6-mame-beletes-projects.vercel.app'
  ];

  const allowedOrigins = Array.from(new Set([...baseOrigins, ...envOrigins]));

  const isAllowedVercelOrigin = (origin) => {
    try {
      const { hostname } = new URL(origin);
      return hostname.includes('lyan-restaurant') && hostname.endsWith('.vercel.app');
    } catch (error) {
      return false;
    }
  };

  return { allowedOrigins, isAllowedVercelOrigin };
};

export default getAllowedOrigins;
