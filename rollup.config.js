import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  {
    input: 'lib/index.js',
    output: [
      {
        format: 'umd',
        file: pkg.browser,
        name: 'quickiter',
        exports: 'named'
      }
    ],
    plugins: [
      resolve(),
      commonjs({
        namedExports: {
          'lib/index.js': [
            'iter',
            'map',
            'filter',
            'concat',
            'zip',
            'Iter'
          ]
        }
      })
    ]
  },
  {
    input: 'lib/index.js',
    output: {
      format: 'umd',
      file: 'dist/quickiter.min.js',
      name: 'quickiter',
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  }
]
