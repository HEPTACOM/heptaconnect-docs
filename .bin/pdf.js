const yaml = require('js-yaml');
const fs = require('fs');

console.log('Generate alternative mkdocs specification for PDF generation');

const mkdocs = yaml.load(fs.readFileSync('mkdocs.yml', 'utf8'));

mkdocs.plugins = mkdocs.plugins.filter(i => !(typeof i === 'string' && i === 'section-index'));
mkdocs.plugins = mkdocs.plugins.filter(i => !(typeof i === 'object' && 'htmlproofer' in i));
mkdocs.plugins.push({
    'with-pdf': {
        author: 'HEPTACOM GmbH',
        cover: true,
        cover_title: 'HEPTAconnect',
        cover_subtitle: '',
        render_js: false,
    }
});

function generateNavigation(nav, parentTitle) {
    const result = [];

    for (const navItem of nav) {
        if (typeof navItem === 'string') {
            result.push({
               [parentTitle]: navItem
            });
        } else {
            for (const itemKey of Object.keys(navItem)) {
                if (typeof navItem[itemKey] !== 'string') {
                    navItem[itemKey] = generateNavigation(navItem[itemKey], itemKey);
                }
            }

            result.push(navItem);
        }
    }

    return result;
}

function removeNoPdfContent(nav) {
    let newsIndex = nav.findIndex((menu) => Object.keys(menu).indexOf('News') !== -1);
    let news = nav[newsIndex].News;
    let release = news[news.findIndex((menu) => Object.keys(menu).indexOf('Release') !== -1)].Release;
    release = release.filter((menu) => Object.keys(menu).indexOf('Upcoming') === -1);

    nav.push({
        Release: release,
    });
    nav = nav.filter((menu) => Object.keys(menu).indexOf('News') === -1);
    nav = nav.filter((menu) => Object.keys(menu).indexOf('Pricing') === -1);

    return nav;
}

mkdocs.nav = generateNavigation(mkdocs.nav, 'HEPTAconnect');
mkdocs.nav = removeNoPdfContent(mkdocs.nav);
mkdocs.theme.icon.heptaconnectCards = false;

fs.writeFileSync('mkdocs-pdf.yml', yaml.dump(mkdocs), 'utf8');
