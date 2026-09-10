const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

// CesiumJS ships its Workers/Assets/Widgets/ThirdParty as static files that must be
// served from the same app (or an allow-listed origin). We copy them into /public
// at build time and point Cesium at that path via CESIUM_BASE_URL, so the "God's Eye"
// 3D globe no longer depends on loading Cesium.js from an external CDN (which was
// previously blocked by the Content-Security-Policy below and caused the globe to
// silently fail to render).
// Resolve via require.resolve rather than a hardcoded node_modules path, since in an
// npm/yarn workspace (monorepo) "cesium" is typically hoisted up to the repo root's
// node_modules rather than living inside frontend/node_modules.
const cesiumPackageJson = require.resolve("cesium/package.json");
const cesiumSource = path.join(path.dirname(cesiumPackageJson), "Build", "Cesium");
const cesiumBaseUrl = "cesium-static";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    NEXT_PUBLIC_APP_ENV: process.env.APP_ENV || "production",
    // Optional: set this to enable Cesium World Terrain / Bing imagery via Cesium ion.
    // Without it, the God's Eye view falls back to OpenStreetMap imagery + flat
    // ellipsoid terrain, which needs no API key at all.
    NEXT_PUBLIC_CESIUM_ION_TOKEN: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || "",
  },
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
              "worker-src 'self' blob:; child-src 'self' blob:; " +
              "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; " +
              "font-src 'self' data:; connect-src 'self' ws: wss: https:; " +
              "frame-src 'self' https://www.youtube.com; object-src 'none';",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self)" },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    config.externals.push("pbf");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, net: false, tls: false, http: false, https: false,
      zlib: false, stream: false, crypto: false, buffer: false,
      process: false, url: false, querystring: false, assert: false,
    };

    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            { from: path.join(cesiumSource, "Workers"), to: `../public/${cesiumBaseUrl}/Workers` },
            { from: path.join(cesiumSource, "ThirdParty"), to: `../public/${cesiumBaseUrl}/ThirdParty` },
            { from: path.join(cesiumSource, "Assets"), to: `../public/${cesiumBaseUrl}/Assets` },
            { from: path.join(cesiumSource, "Widgets"), to: `../public/${cesiumBaseUrl}/Widgets` },
          ],
        }),
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
