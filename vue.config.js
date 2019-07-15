const { readFileSync } = require("fs");

module.exports = {
  devServer: {
    port: 8000,
    public: "sforzando.local:443",
    https: {
      key: readFileSync("/ca/devilbox-ca.key"),
      cert: readFileSync("/ca/devilbox-ca.crt"),
      ca: readFileSync("/ca/devilbox-ca.srl")
    },
    hot: true,
    disableHostCheck: true
  }
};
