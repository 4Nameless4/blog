/** @type {import('next').NextConfig} */
const {
  NODE_ENV,
  server,
  server_production,
  staticResourceServer,
  staticResourceServer_production,
} = process.env;
const nextConfig = {
  //   i18n: {
  //     defaultLocale: "zh",
  //     locales: ["zh", "en", "jp"],
  //   },
  env: {
    SERVER: NODE_ENV === "development" ? server : server_production,
    StaticSERVER:
      NODE_ENV === "development"
        ? staticResourceServer
        : staticResourceServer_production,
  },
};

module.exports = nextConfig;
