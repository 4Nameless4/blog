/** @type {import('next').NextConfig} */
const os = require("os");
let {
  NODE_ENV,
  server,
  server_production,
  staticResourceServer,
  staticResourceServer_production,
  key1,
  key2,
  iv,
} = process.env;

function getIpAddress() {
  var ifaces = os.networkInterfaces();

  for (var dev in ifaces) {
    let iface = ifaces[dev];

    for (let i = 0; i < iface.length; i++) {
      let { family, address, internal } = iface[i];

      if (family === "IPv4" && address !== "127.0.0.1" && !internal) {
        return address;
      }
    }
  }
}

const ip = getIpAddress();

server = server.replace(/localhost/g, ip);
staticResourceServer = staticResourceServer.replace(/localhost/g, ip);

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
    key1,
    key2,
    iv,
  },
};

module.exports = nextConfig;
