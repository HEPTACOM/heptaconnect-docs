const yaml = require('js-yaml');
const fs = require('fs');

const mkdocs = yaml.load(fs.readFileSync('mkdocs.yml', 'utf8'));

mkdocs.plugins = mkdocs.plugins.filter(i => !(typeof i === 'string' && i === 'section-index'));
mkdocs.plugins.push({
    'with-pdf': {
        author: 'HEPTACOM GmbH',
        cover: true,
        cover_title: 'HEPTAconnect',
        cover_subtitle: '',
        render_js: false
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

mkdocs.nav = generateNavigation(mkdocs.nav, 'HEPTAconnect');

fs.writeFileSync('mkdocs-pdf.yml', yaml.dump(mkdocs), 'utf8');
