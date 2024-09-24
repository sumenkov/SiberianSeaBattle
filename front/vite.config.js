const { defineConfig } = require("vite");

defineConfig(({ command, mode }) => {

    return {
        server: {
            open: './index.html',
        },
        build: {
            lib: {
                entry: './index.ts'
            },
            outDir: './dist'
        }
    }
});
