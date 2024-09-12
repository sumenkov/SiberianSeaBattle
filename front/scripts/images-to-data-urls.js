#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const shipsPath = path.resolve(__dirname, '..', 'src', 'assets', 'ships');
const shipsDir = fs.readdirSync(shipsPath);

const jsTemplate =
    "const dataUrl = '#';\n" +
    "export default dataUrl;"

for (const shipFile of shipsDir) {
    if (shipFile.endsWith('.png')) {
        try {
            const imagePath = shipsPath + '/' + shipFile;
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

