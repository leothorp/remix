/** @type {import('@remix-run/shared-internals').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  server: "./server.ts",
  serverConditions: ["deno", "worker"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["module", "main"],
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
