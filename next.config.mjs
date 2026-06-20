/** @type {import('next').NextConfig} */

// GitHub Pages 公開時はリポジトリ名がパスに付くため basePath を設定する。
// 環境変数 NEXT_PUBLIC_BASE_PATH（例: "/selfexercise"）で切り替える。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
