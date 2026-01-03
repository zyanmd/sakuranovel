/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cors.caliph.my.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sakuranovel.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig