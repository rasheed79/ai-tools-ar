/** @type {import('next').NextConfig} */
// build: 2026-06-04
const nextConfig = {
  // Arabic URL paths work via rewrites — folder names stay ASCII (Windows-safe)
  async rewrites() {
    return [
      { source: '/ادوات/:slug', destination: '/tools/:slug' },
      { source: '/مقارنة/:pair', destination: '/compare/:pair' },
      { source: '/افضل-ادوات/:useCase', destination: '/best/:useCase' },
      { source: '/:slug-بديل', destination: '/alt/:slug' },
    ]
  },
}

module.exports = nextConfig
