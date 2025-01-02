/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';


const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['onnxruntime-node'],
      },
    webpack: (config) => {

        // Ignore node-specific modules when bundling for the browser
        // https://webpack.js.org/configuration/resolve/#resolvealias
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        };
        return config;
      },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'oaidalleapiprodscus.blob.core.windows.net',
                port: '',
                pathname: '/private/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})(nextConfig);
