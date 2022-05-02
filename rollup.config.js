import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { version } from "./package.json";
import { terser } from 'rollup-plugin-terser';

const year = new Date().getFullYear();

const banner = `/*!
  Peity Vanila JS ${version}
  Copyright © ${year} RailsJazz
  https://railsjazz.com
 */
`;

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/peity_vanilla.es2017-esm.js",
        format: "es",
        banner,
      },
      {
        name: "peity",
        file: "dist/peity_vanilla.js",
        format: "umd",
        sourcemap: true,
        banner: banner,
      },
      {
        name: "peity",
        file: "dist/peity_vanilla.min.js",
        format: "iife",
        banner: banner,
        plugins: [terser()]
      },
    ],
    plugins: [
      resolve(),
      babel({
        babelHelpers: "bundled",
        presets: [["@babel/preset-env", { targets: "defaults" }]],
      }),
    ],
    watch: {
      include: "src/**",
    },
  },
];
