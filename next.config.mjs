/** @type {import('next').NextConfig} */

// Content-Security-Policy: self + GA (fremtidssikret) + 'unsafe-inline' til den
// inline JSON-LD og de mange inline-styles. next/font self-hoster, så font-src
// 'self'. frame-ancestors/base-uri/object-src strammer mod clickjacking/injection.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const sikkerhedsHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: sikkerhedsHeaders }];
  },
  async redirects() {
    return [
      // www → apex (kun kendt host, så HostStacks health check ikke rammes)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.camsilo.dk" }],
        destination: "https://camsilo.dk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
