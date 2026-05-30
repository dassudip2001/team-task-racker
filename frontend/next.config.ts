import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
