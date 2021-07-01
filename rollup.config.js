import nodeResolve from 'rollup-plugin-node-resolve';
import {terser} from "rollup-plugin-terser";

export default {
    input: './index.js',
    output: {
        file: './lib/xeokit-bim-viewer.es.js',
        format: 'es',
        name: 'bundle'
    },
    plugins: [
        nodeResolve(),
        // terser()
    ]
}