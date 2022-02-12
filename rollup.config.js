import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/esm/index.js',
        format: 'esm'
      },
      {
        file: 'lib/cjs/index.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'lib/umd/index.js',
        format: 'umd',
        name: 'PipeCore',
        plugins: [terser()]
      },
      {
        file: 'lib/iife/index.min.js',
        format: 'iife',
        name: 'PipeCore',
        plugins: [terser()]
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'types/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts()
    ]
  }
];
