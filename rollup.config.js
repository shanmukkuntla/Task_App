import babel from '@rollup/plugin-babel';

export default {
    input: 'src/index.jsx',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
    plugins: [
        babel({
            babelHelpers: 'bundled'
        })
    ]
};