/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Strip console.* (except errors/warnings) from the production bundle —
  // smaller JS payload and no dev logging shipped to users.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Serve modern image formats when next/image is used, and allow the
  // decorative picsum host so those bands can be migrated to next/image.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
