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
    html = html.replace(/<code>([a-z0-9-]+\/[a-z0-9-]+):/g, '<code><a href="https://packagist.org/packages/$1" target="_blank" title="Open $1 on Packagist.org">$1</a>:');
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
const cleanedPackageReleases = packageReleases.map((release) => {
    const { releases } = release;

    return {
        ...release,
        releases: releases.map((release) => {
            const { name, tokens } = release;
            let headlineIndex = tokens.findIndex((token) => token.type === 'heading_open' && token.tag === 'h3' && token.markup === '###');
            const emptyHeadlines = [];

            while (true) {
                const nextHeadlineIndex = tokens.findIndex((token, index) => index > headlineIndex && token.type === 'heading_open' && token.tag === 'h3' && token.markup === '###');

                if (nextHeadlineIndex === -1) {
                    if ((headlineIndex + 3) === tokens.length) {
                        emptyHeadlines.push({
                            from: headlineIndex,
                            to: headlineIndex + 3,
                        });
                    }

                    break;
                }

                if ((nextHeadlineIndex - headlineIndex) === 3) {
                    emptyHeadlines.push({
                        from: headlineIndex,
                        to: nextHeadlineIndex,
                    });
                }

                headlineIndex = nextHeadlineIndex;
            }

            for (const emptyHeadline of emptyHeadlines.reverse()) {
                tokens.splice(emptyHeadline.from, emptyHeadline.to - emptyHeadline.from);
            }

            return {
                ...release,
                name,
                tokens,
            };
        }).filter(({ tokens }) => tokens.length > 0),
    }
}).filter(({ releases }) => releases.length > 0);
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
const releasedPackageReleases = cleanedPackageReleases
    .map((packageRelease) => ({
        ...packageRelease,
        releases: packageRelease.releases.filter(({ major }) => major !== null),
    }))
    .filter(({ releases }) => releases.length > 0)
    .filter(({ releases }) => releases[0].tokens.length > 0)
    .map((packageRelease) => ({
        ...packageRelease,
        major: packageRelease.releases[0].major,
    }));
const latestMajor = releasedPackageReleases
    .map((packageRelease) => ({
        ...packageRelease,
        releases: packageRelease.releases
            .filter(({ major }) => major === packageRelease.major)
            .map((release) => ({
                ...release,
                html: renderTokens(release.tokens),
            })),
    }));
const previouslyReleasedPackageReleases = releasedPackageReleases
    .map((packageRelease) => ({
        ...packageRelease,
        releases: packageRelease.releases
            .filter(({ major }) => major !== packageRelease.major && packageRelease.major !== null)
            .map((release) => ({
                ...release,
                html: renderTokens(release.tokens),
            })),
    }));

for (const release of upcoming) {
    fs.writeFileSync(`overrides/partials/generated/releases-upcoming-${release.package}.html`, release.html);
}
for (const release of changelogFiles.filter(({ file }) => !upcoming.some(packageRelease => packageRelease.file === file))) {
    fs.writeFileSync(`overrides/partials/generated/releases-upcoming-${release.package}.html`, '');
}

for (const packageRelease of latestMajor) {
    fs.writeFileSync(
        `overrides/partials/generated/releases-major-latest-${packageRelease.package}.html`,
        packageRelease.releases.map(({ releaseDate, name, html }) => `<h2>[${name}] - ${releaseDate}</h2>${html}`).join(''),
    );
}
for (const release of changelogFiles.filter(({ file }) => !latestMajor.some(packageRelease => packageRelease.file === file))) {
    fs.writeFileSync(`overrides/partials/generated/releases-major-latest-${release.package}.html`, '');
}

for (const packageRelease of previouslyReleasedPackageReleases) {
    fs.writeFileSync(
        `overrides/partials/generated/releases-major-previously-${packageRelease.package}.html`,
        packageRelease.releases.map(({ releaseDate, name, html }) => `<h2>[${name}] - ${releaseDate}</h2>${html}`).join(''),
    );
}
for (const release of changelogFiles.filter(({ file }) => !previouslyReleasedPackageReleases.some(packageRelease => packageRelease.file === file))) {
    fs.writeFileSync(`overrides/partials/generated/releases-major-previously-${release.package}.html`, '');
}
