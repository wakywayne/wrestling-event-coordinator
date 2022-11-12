/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { appDir: true }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

if (process.env.ANALYZE === 'true') {
  module.exports = withBundleAnalyzer()
} else {
  module.exports = nextConfig
}

