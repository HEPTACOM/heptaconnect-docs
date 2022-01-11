const MarkdownIt = require('markdown-it');
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

console.log('Generate ADR overview');

const markdownIt = new MarkdownIt();
const posts = list_files('docs/reference/adr')
    .filter(a => a.endsWith('.md') && a.indexOf('/deprecated/') === -1)
    .sort((a, b) => b.localeCompare(a))
    .map(file => ({
        title: markdownIt.parse(fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })).filter(p => p.type === 'inline')[0].content,
        file
    }));

const latest = posts.map(p => `<li><a href="{{ '${p.file.substr(5).slice(0, '.md'.length * -1)}/'|url }}">${p.title}</a></li>`).join('');
fs.writeFileSync('overrides/partials/generated/adr-complete-list.html', `<ul>${latest}</ul>`);
