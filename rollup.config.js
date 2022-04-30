import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import htmlTemplate from 'rollup-plugin-generate-html-template';

const banner = `/*!
  Peity Vanila JS
 */
`;

export default [
  {
    input: "src/index.js",
    output: {
      name: "peity_vanilla",
      file: "dist/peity_vanilla.js",
      format: "umd",
      sourcemap: true,
      banner: banner
    },
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        presets: [['@babel/preset-env', {targets: 'defaults'}]]
      }),
      htmlTemplate({
        template: 'src/index.html',
        target: 'dist/index.html',
      })
    ]
  }
];