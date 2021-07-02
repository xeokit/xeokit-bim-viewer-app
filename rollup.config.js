import nodeResolve from 'rollup-plugin-node-resolve';
import {terser} from "rollup-plugin-terser";

export default {
    input: '@xeokit/xeokit-bim-viewer/dist/xeokit-bim-viewer.es.js',
    output: {
        file: './lib/xeokit-bim-viewer.es.js',
        format: 'es',
        name: 'bundle'
    },
    plugins: [
        nodeResolve(),
        terser()
    ]
}