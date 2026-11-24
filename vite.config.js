"use strict";

const target = "http://127.0.0.1:" + (process.env.PORT || 3000);
const apiProxy = { "/api": { target: target, changeOrigin: true } };

module.exports = {
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy }
};
