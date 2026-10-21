import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/privacy", destination: "/privacy-policy", permanent: true }];
  },
  async headers() {
    return ["/account/:path*", "/employer/:path*", "/admin/:path*", "/candidates/:path*", "/login", "/register", "/signup", "/post-job", "/forgot-password", "/reset-password"].map(source => ({
      source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }));
  },
};

export default nextConfig;
