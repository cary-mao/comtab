import {defineConfig} from 'vite'
import {resolve as resolveFn} from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve('lib')
        }
    },
    build: {
        lib: {
            entry: resolve('lib/comtab.ts'),
            name: 'comtab'
        },
        rollupOptions: {
            // input: resolve('index.html'),
            output: {
                globals: {
                    lodash: '_'
                }
            },
            external: ['jQuery', 'jQuery.ui', 'lodash']
        }
    }
})

/**
 * get the absolute path from __dirname to p
 * @param {string} p 
 */
function resolve (p) {
    return resolveFn(__dirname, p)
}