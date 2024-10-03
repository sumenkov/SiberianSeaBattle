#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const shipsPath = path.resolve(__dirname, '..', 'src', 'assets', 'ships');
const otherAssetsPath = path.resolve(__dirname, '..', 'src', 'assets');
const shipsDir = fs.readdirSync(shipsPath);
const otherAssetsDir = fs.readdirSync(otherAssetsPath);

const jsTemplate =
    "const dataUrl = '#';\n" +
    "export default dataUrl;"

const handler = (file, path) => {
    if (file.endsWith('.png')) {
        try {
            const imagePath = path + '/' + file;
            const tsOutputPath = imagePath + '.b64.ts';
            const content = fs.readFileSync(imagePath);
            const b64 = Buffer.from(content).toString('base64');
            fs.writeFileSync(
                tsOutputPath,
                jsTemplate.replace('#', 'data:image/png;base64,' + b64)
            );
            console.log(imagePath + '\n  -->\n' + tsOutputPath);
        }
        catch (error) {
            console.log('Failed to convert.');
            console.error(error);
        }
    }
}

for (const file of shipsDir) {
    handler(file, shipsPath);
}

for (const file of otherAssetsDir) {
    handler(file, otherAssetsPath);
}

