const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

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

console.log('Optimize SVG files');

for (const file of list_files('site/assets/uml').filter(a => a.endsWith('.svg'))) {
    console.log(file);

    const content = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    const optimized = optimize(content, {
        path: file
    });
    fs.writeFileSync(file, optimized.data);
}
