import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/about/:path*",
        destination: "https://assets.alexya.ng/about/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
