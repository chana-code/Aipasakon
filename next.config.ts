import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // isomorphic-dompurify pulls in jsdom, which reads a bundled .css asset from disk at
  // runtime. Bundling it breaks server page-data collection (ENOENT default-stylesheet.css),
  // so keep it external and require it from node_modules instead.
  serverExternalPackages: ['isomorphic-dompurify', 'jsdom'],
};

export default nextConfig;
