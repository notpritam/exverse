/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Content is code and prerendered; images are local + optimized.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // On /Volumes/X9, filesystem events don't fire — poll in dev so HMR still works.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = { poll: 800, aggregateTimeout: 300 };
    }
    return config;
  },
};

export default nextConfig;
