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
            result = list_files(realpath, result);
        } else {
            result.push(realpath);
        }
    });

    return result;
}

const now = Number(new Date()).toString();

for (const file of list_files('site').filter(a => a.endsWith('.html'))) {
    const content = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    fs.writeFileSync(file, content.replace(/replace-this-with-now/g, now));
}
