module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/airbnb"],
  rules: {
    plugins: ["prettier"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    quotes: ["error", "double"],
    "no-plusplus": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
