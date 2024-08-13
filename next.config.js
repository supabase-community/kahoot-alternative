/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/host/dashboard',
        permanent: true,
      },
      {
        source: '/host',
        destination: '/host/dashboard',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
