import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para desarrollo
  experimental: {
    // Turbopack ahora es estable
  },
  
  // Configuración de Turbopack estable
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de webpack
  webpack: (config, { dev, isServer }) => {
    // Alias para @ que apunta a src/
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    
    // Optimizar para desarrollo
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    // Configuración para SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Configuración de output
  output: 'standalone',
  
  // Configuración de trailing slash
  trailingSlash: false,
  
  // Configuración de powered by header
  poweredByHeader: false,
};

export default nextConfig; 