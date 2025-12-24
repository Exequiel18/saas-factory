/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimizaciones para producción
    reactStrictMode: true,
    
    // Configuración de imágenes
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    
    // Headers de seguridad
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                ],
            },
        ];
    },
    
    // Configuración de compilación
    swcMinify: true,
    
    // Configuración experimental (Next.js 15)
    experimental: {
        // Optimizaciones de rendimiento
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },
    
    // Configuración de tipos
    typescript: {
        // En producción, fallar si hay errores de TypeScript
        ignoreBuildErrors: false,
    },
    
    // Configuración de ESLint
    eslint: {
        // En producción, fallar si hay errores de ESLint
        ignoreDuringBuilds: false,
    },
};

export default nextConfig;
