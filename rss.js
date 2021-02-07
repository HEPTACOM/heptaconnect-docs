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

const rss = new Feed({
    title: 'HEPTAconnect feed',
    description: 'A newsfeed regarding changes in HEPTAconnect that are worthwhile a note',
    id: 'https://connect.heptacom.de/',
    link: 'https://connect.heptacom.de/',
    language: 'en',
    image: 'https://connect.heptacom.de/assets/logo.png',
    favicon: 'https://connect.heptacom.de/assets/img/favicon/favicon-32x32.png',
    copyright: 'HEPTACOM GmbH',
    author: {
        name: 'HEPTACOM GmbH',
        link: 'https://www.heptacom.de'
    }
});

let posts = [];

for (const file of list_files('docs/feed').sort((a, b) => a.localeCompare(b))) {
    const content = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    const [ md, metadata ] = content.split('---', 2).reverse();
    const parsedMd = new MarkdownIt().render(md);
    const parsedMetadata = JSON.parse(metadata);

    posts.push({
        ...parsedMetadata,
        content: parsedMd,
        file
    });
}

posts = posts.filter(a => a.date);
posts.sort((a, b) => a.date.localeCompare(b.date))

for (const post of posts) {
    rss.addItem({
        title: post.title,
        id: 'https://connect.heptacom.de/#/' + post.file,
        link: 'https://connect.heptacom.de/#/' + post.file,
        description: post.summary,
        content: post.content,
        date: new Date(post.date)
    })
}

fs.writeFileSync('docs/feed/atom1.xml', rss.atom1());
fs.writeFileSync('docs/feed/rss2.xml', rss.rss2());
fs.writeFileSync('docs/feed/json1.json', rss.json1());
