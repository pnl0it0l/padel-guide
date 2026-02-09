import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.padelguide.pt",
          },
        ],
        destination: "https://padelguide.pt/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
