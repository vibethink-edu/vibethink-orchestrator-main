/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output to avoid static generation issues
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.CORS_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
    transpilePackages: ['@radix-ui/react-icons', 'lucide-react', '@radix-ui/react-collapsible', '@vibethink/ui', '@vibethink/utils', 'react-hook-form'],
  // Removed experimental reactCompiler option that's not supported in Next.js 15.3.4
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '../../src'),
    };

    // Suprimir warnings de React 19 compatibility para componentes Radix UI
    config.ignoreWarnings = [
      { message: /Accessing element\.ref was removed in React 19/ },
      { message: /ref is now a regular prop/ },
    ];

    return config;
  },
};

module.exports = nextConfig;