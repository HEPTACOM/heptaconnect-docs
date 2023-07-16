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
    const markdownedTokens = tokens.map((token) => {
        switch (token.type) {
            case 'bullet_list_open': return '';
            case 'bullet_list_close': return "\n";
            case 'list_item_open': return token.markup;
            case 'list_item_close': return "\n";
            case 'inline': return ' ' + token.content;
            case 'heading_open': return token.markup;
            case 'heading_close': return "\n\n";
            case 'paragraph_open': return '';
            case 'paragraph_close': return '';
            default:
                break;
        }
    });

    return markdownedTokens.join('');
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
        md: renderTokens(packageRelease.releases[0].tokens),
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
                md: renderTokens(release.tokens),
            })),
    }));
const previouslyReleasedPackageReleases = releasedPackageReleases
    .map((packageRelease) => ({
        ...packageRelease,
        releases: packageRelease.releases
            .filter(({ major }) => major !== packageRelease.major && packageRelease.major !== null)
            .map((release) => ({
                ...release,
                md: renderTokens(release.tokens),
            })),
    }));

for (const release of upcoming) {
    fs.writeFileSync(`overrides/partials/generated/releases-upcoming-${release.package}.md`, release.md);
}
for (const release of changelogFiles.filter(({ file }) => !upcoming.some(packageRelease => packageRelease.file === file))) {
    fs.writeFileSync(`overrides/partials/generated/releases-upcoming-${release.package}.md`, '');
}

for (const packageRelease of latestMajor) {
    fs.writeFileSync(
        `overrides/partials/generated/releases-major-latest-${packageRelease.package}.md`,
        packageRelease.releases.map(({ releaseDate, name, md }) => `## [${name}] - ${releaseDate}

${md}`).join(''),
    );
}
for (const release of changelogFiles.filter(({ file }) => !latestMajor.some(packageRelease => packageRelease.file === file))) {
    fs.writeFileSync(`overrides/partials/generated/releases-major-latest-${release.package}.md`, '');
}

for (const packageRelease of previouslyReleasedPackageReleases) {
    fs.writeFileSync(
        `overrides/partials/generated/releases-major-previously-${packageRelease.package}.md`,
        packageRelease.releases.map(({ releaseDate, name, md }) => `## [${name}] - ${releaseDate}

${md}`).join(''),
    );
}
for (const release of changelogFiles.filter(({ file }) => !previouslyReleasedPackageReleases.some(packageRelease => packageRelease.file === file))) {
    fs.writeFileSync(`overrides/partials/generated/releases-major-previously-${release.package}.md`, '');
}
