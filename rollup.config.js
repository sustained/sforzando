import vue from "rollup-plugin-vue"
import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"

export default [
  {
    input: "src/index.js",
    output: {
      format: "esm",
      file: "dist/library.esm.js"
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      }),
      vue()
    ]
  },
  {
    input: "src/index.js",
    output: {
      format: "cjs",
      file: "dist/library.ssr.js"
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      }),
      vue()
    ]
  },
  {
    input: "src/wrapper.js",
    output: {
      format: "iife",
      file: "dist/library.js"
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      }),
      vue()
    ]
  }
]
