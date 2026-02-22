/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // AR.js/Three.js can be sensitive to strict mode re-renders
  transpilePackages: ['three'],
};

module.exports = nextConfig;
