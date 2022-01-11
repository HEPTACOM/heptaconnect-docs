const fs = require('fs');
const path = require('path');

const list_files = function(dirPath, result = undefined) {
    result = result || [];

    if (!fs.existsSync(dirPath)) {
        return result;
    }

    fs.readdirSync(dirPath).forEach(function(file) {
        const realpath = path.join(dirPath, path.sep, file);

        if (fs.statSync(realpath).isDirectory() && !file.startsWith('.')) {
            result.push(...list_files(realpath, result));
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

    const content = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    fs.writeFileSync(file, content.replace(/replace-this-with-now/g, now));
}
