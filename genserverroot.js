import fs from 'node:fs'

const content = "export const serverRoot = \""+process.argv[2]+"\""

fs.writeFile('src/serverRoot.js', content, err => {
    if (err) {
        console.error(err);
    }
});
