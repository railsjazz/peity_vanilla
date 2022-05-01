import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { version } from "./package.json";
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
