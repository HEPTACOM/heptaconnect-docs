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
            for (const file of list_files(realpath, result).filter(r => result.indexOf(r) === -1)) {
                result.push(file);
            }
        } else {
            result.push(realpath);
        }
    });

    return result;
}

console.log('Generate RSS Feed');

const domain = fs.readFileSync('docs/CNAME', { encoding: 'utf8', flag: 'r' }).trim();
const rss = new Feed({
    title: 'HEPTAconnect feed',
    description: 'A newsfeed regarding changes in HEPTAconnect that are worthwhile a note',
    id: `https://${domain}/`,
    link: `https://${domain}/`,
    language: 'en',
    image: `https://${domain}/assets/favicon/android-chrome-512x512.png`,
    favicon: `https://${domain}/assets/favicon/favicon-32x32.png`,
    copyright: 'HEPTACOM GmbH',
    author: {
        name: 'HEPTACOM GmbH',
        link: 'https://www.heptacom.de'
    },
    feedLinks: {
        atom: `https://${domain}/news/atom1.xml`,
        rss: `https://${domain}/news/rss2.xml`
    }
});

let posts = [];

for (const file of list_files('feed').filter(a => a.endsWith('.md') && !a.endsWith('index.md')).sort((a, b) => a.localeCompare(b))) {
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

fs.mkdirSync('docs/news', { recursive: true });

for (const post of posts) {
    console.log(post.file);

    fs.writeFileSync('docs/news/' + post.file.substr(5), '# ' + post.title + '\n\n' + post.markdown.trim());
    let link = `https://${domain}/news/` + post.file.substr(5).slice(0, '.md'.length * -1) + '/';

    rss.addItem({
        title: post.title,
        id: link,
        link: link,
        description: post.summary,
        content: post.content,
        date: new Date(post.date),
        author: [{ name: post.author }]
    });
}

const listing = rss.items.map(a => `* [${a.title}](./${a.id.substr(`https://${domain}/news/`.length)})`);
fs.writeFileSync('docs/news/index.md', fs.readFileSync('feed/index.md', { encoding: 'utf8', flag: 'r' }) + '\n' + listing.join('\n') + '\n');

const latest = posts.slice(-4).reverse().map(p => `<a class="hc-card" href="https://${domain}/news/${p.file.substr(5).slice(0, '.md'.length * -1)}/">
    <h2>${p.title}</h2>
    <p>${p.summary}</p>
    <span>${p.author} on ${p.date}</span>
</a>`).join('');
fs.writeFileSync('overrides/partials/generated/latest-news.html', `<section class="md-typeset md-grid-dense hc-cards">
${latest}
</section>`);

fs.writeFileSync('docs/news/atom1.xml', rss.atom1());
fs.writeFileSync('docs/news/rss2.xml', rss.rss2());
fs.writeFileSync('docs/news/json1.json', rss.json1());
