const MarkdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');

const listChangelogs = function() {
    const result = [];
    const dirPath = '.data';

    if (!fs.existsSync(dirPath)) {
        return result;
    }

    fs.readdirSync(dirPath).forEach(function(file) {
        const realpath = path.join(dirPath, path.sep, file);

        if (fs.statSync(realpath).isDirectory() && file.startsWith('git-heptaconnect-')) {
            const changelog = path.join(realpath, path.sep, 'CHANGELOG.md');
            if (fs.existsSync(changelog)) {
                result.push(changelog);
            }
        }
    });

    return result;
}

function renderTokens(tokens) {
    let html = markdownIt.renderer.render(tokens);
    html = html.replace(/<code>(\\?Heptacom\\HeptaConnect\\)/g, '<code><span class="code-vendor-hc">$1</span>');
    html = html.replace(/<code>([a-z-]+\/[a-z-]+):/g, '<code><a href="https://packagist.org/packages/$1" target="_blank" title="Open $1 on Packagist.org">$1</a>:');
    html = html.replace(/([^>])(PSR-\d+)/g, (_, sep, psr) => `${sep}<a href="https://www.php-fig.org/psr/${psr.toLowerCase()}/" target="_blank" title="Open ${psr} on php-fig.org">${psr}</a>`);

    return html;
}

console.log('Simplify recent releases');

const markdownIt = new MarkdownIt();
const changelogFiles = listChangelogs()
    .map(file => {
        console.log('Parse changelog file: ' + file);
        let parsed = markdownIt.parse(fs.readFileSync(file, { encoding: 'utf8', flag: 'r' }), {});

        return {
            file,
            package: file.match(/\/git-heptaconnect-([^\/]+)/)[1],
            tokens: parsed,
        };
    });

const packageReleases = changelogFiles.map((changelogFile) => {
    const { file, tokens } = changelogFile;
    console.log('Understand releases file: ' + file);
    const releases = [];
    let releaseIndex = tokens.findIndex((token) => token.type === 'heading_open' && token.tag === 'h2' && token.markup === '##');

    while (true) {
        const releaseName = tokens[releaseIndex + 1].content.match(/\[(.+)]/)[1];
        let major = null;
        let releaseDate = null;

        if (releaseName !== 'Unreleased') {
            major = releaseName.match(/^(.+)\.\d+\.\d+$/)[1] + '.0.0';
            releaseDate = tokens[releaseIndex + 1].content.match(/\[.+]\s*-\s*(\d+-\d+-\d+)/)[1];
        }

        const slug = tokens[releaseIndex + 1].content.replace(/[^-a-zA-Z0-9]/g, '');
        const nextReleaseIndex = tokens.findIndex((token, index) => index > releaseIndex && token.type === 'heading_open' && token.tag === 'h2' && token.markup === '##');

        releases.push({
            name: releaseName,
            major,
            releaseDate,
            slug,
            tokens: tokens.slice(releaseIndex + 3, (nextReleaseIndex === -1) ? undefined : nextReleaseIndex),
        })

        if (nextReleaseIndex === -1) {
            break;
        }

        releaseIndex = nextReleaseIndex;
    }

    return {
        ...changelogFile,
        releases,
    };
});
const upcoming = packageReleases
    .map((packageRelease) => ({
        ...packageRelease,
        releases: packageRelease.releases.filter(({ major }) => major === null),
    }))
    .filter(({ releases }) => releases.length > 0)
    .filter(({ releases }) => releases[0].tokens.length > 0)
    .map((packageRelease) => ({
        ...packageRelease,
        releases: packageRelease.releases[0],
        html: renderTokens(packageRelease.releases[0].tokens),
    }));

for (const release of upcoming) {
    fs.writeFileSync(`overrides/partials/generated/releases-upcoming-${release.package}.html`, release.html);
}
