const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const isProjectPage =
  process.env.GITHUB_ACTIONS === 'true' && repositoryName && !repositoryName.endsWith('.github.io');
const basePath = isProjectPage ? `/${repositoryName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.GITHUB_ACTIONS === 'true' ? 'export' : 'standalone',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.GITHUB_ACTIONS === 'true',
  },
};

export default nextConfig;
