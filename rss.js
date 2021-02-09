const { Feed } = require('feed');
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
            result = list_files(realpath, result);
        } else {
            result.push(realpath);
        }
    });

    return result;
}

const domain = fs.readFileSync('docs/CNAME', { encoding: 'utf8', flag: 'r' }).trim();
const rss = new Feed({
    title: 'HEPTAconnect feed',
    description: 'A newsfeed regarding changes in HEPTAconnect that are worthwhile a note',
    id: `https://${domain}/`,
    link: `https://${domain}/`,
    language: 'en',
    image: `https://${domain}/assets/logo.png`,
    favicon: `https://${domain}/assets/img/favicon/favicon-32x32.png`,
    copyright: 'HEPTACOM GmbH',
    author: {
        name: 'HEPTACOM GmbH',
        link: 'https://www.heptacom.de'
    }
});

let posts = [];

for (const file of list_files('feed').filter(a => a.endsWith('.md')).sort((a, b) => a.localeCompare(b))) {
    const content = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    const [ md, metadata ] = content.split('---', 2).reverse();
    const parsedMd = new MarkdownIt().render(md);
    const parsedMetadata = JSON.parse(metadata);

    posts.push({
        ...parsedMetadata,
        content: parsedMd,
        markdown: md,
        file
    });
}

posts = posts.filter(a => a.date);
posts.sort((a, b) => a.date.localeCompare(b.date))

fs.mkdirSync('docs/feed', { recursive: true });

for (const post of posts) {
    fs.writeFileSync('docs/' + post.file, '#' + post.title + '\n\n' + post.markdown.trim());

    rss.addItem({
        title: post.title,
        id: post.file,
        link: `https://${domain}/#/${post.file}`,
        description: post.summary,
        content: post.content,
        date: new Date(post.date),
        author: [{ name: post.author }]
    });
}

const listing = rss.items.map(a => `* [${a.title}](${a.id.substr('feed/'.length)})`);
fs.writeFileSync('docs/feed/index.md', '# HEPTAconnect Feed\n\n' + listing.join('\n') + '\n');

fs.writeFileSync('docs/feed/atom1.xml', rss.atom1());
fs.writeFileSync('docs/feed/rss2.xml', rss.rss2());
fs.writeFileSync('docs/feed/json1.json', rss.json1());
