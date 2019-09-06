const { readFileSync, existsSync } = require("fs")

const IS_DEVILBOX = existsSync("/ca/")

module.exports = IS_DEVILBOX
  ? {
      devServer: {
        public: "sforzando.local:443",
        https: {
          key: readFileSync("/ca/devilbox-ca.key"),
          cert: readFileSync("/ca/devilbox-ca.crt"),
          ca: readFileSync("/ca/devilbox-ca.srl")
        },
        hot: true,
        disableHostCheck: true
      }
    }
  : {
      productionSourceMap: false
    }
