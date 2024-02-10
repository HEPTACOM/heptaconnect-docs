const fs = require('fs');
const path = require('path');
const md5 = require('md5');

const list_files = function(dirPath, result = undefined) {
    result = result || [];

    if (!fs.existsSync(dirPath)) {
        return result;
    }

    fs.readdirSync(dirPath).forEach(function(file) {
        const realpath = path.join(dirPath, path.sep, file);

        if (fs.statSync(realpath).isDirectory() && !file.startsWith('.')) {
            for (const file of list_files(realpath, result).filter(r => result.indexOf(r) === -1)) {
                result.push(file);
            }
        } else {
            result.push(realpath);
        }
    });

    return result;
}

const now = Number(new Date()).toString();

console.log('Replace cache-break in HTML');

for (const file of list_files('site').filter(a => a.endsWith('.html'))) {
    console.log(file);

    let content = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    content = content.replace('/replace-this-with-now/g', now);
    content = content.replace(/href="([^?"]+)\?break=replace-this-with-hash"/g, (all, referencedPath) => {
        const directory = path.dirname(file);
        const referencedFile = path.join(directory, referencedPath);
        const referencedFileContent = fs.readFileSync(referencedFile, { encoding: 'utf8', flag: 'r' });
        const fileHash = md5(referencedFileContent);

        return all.replace('replace-this-with-hash', fileHash);
    });
    fs.writeFileSync(file, content);
}
