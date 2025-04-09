import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://bento.me/aurelienlouvel",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
