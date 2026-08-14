/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: {
    appIsrStatus: false,
  },
  allowedDevOrigins: ['192.168.0.42'],
};

export default nextConfig;
