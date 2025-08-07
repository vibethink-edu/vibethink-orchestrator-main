/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@radix-ui/react-icons'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '../../src'),
    };
    return config;
  },
}

module.exports = nextConfig 