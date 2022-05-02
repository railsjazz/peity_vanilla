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
        file: "dist/peity-vanilla.es2017-esm.js",
        format: "es",
        banner,
      },
      {
        name: "peity",
        file: "dist/peity-vanilla.js",
        format: "umd",
        sourcemap: true,
        banner: banner,
      },
      {
        name: "peity",
        file: "dist/peity-vanilla.min.js",
        format: "iife",
        banner: banner,
        plugins: [terser()]
      },
    ],
    plugins: [
      resolve(),
    ],
    watch: {
      include: "src/**",
    },
  },
];
