const { defineConfig } = require("vite");

defineConfig(({ command, mode }) => {

    //  const isDev = command === 'serve'

    return {
        server: {
            open: './index.html'
        },
        build: {
            lib: {
                entry: './index.ts'
            },
            outDir: './dist'
        }
    }
});
