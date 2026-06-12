/** @type {import('next').NextConfig} */
const nextConfig = {
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
