const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@vibethink/ui'],
};

module.exports = withNextIntl(nextConfig);
