/** @type {import('next').NextConfig} */
const nextConfig = {
//   i18n: {
//     defaultLocale: "zh",
//     locales: ["zh", "en", "jp"],
//   },
  env: {
    SERVER: process.env.SERVER,
  },
};

module.exports = nextConfig;
