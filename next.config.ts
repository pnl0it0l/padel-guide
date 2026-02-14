import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

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

export default withNextIntl(nextConfig);
