/**
 * itemsCoverage
 * 
 * Compares items.json to items.csv; reports missing/extra aliases in items.json.
 */

const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");

const download = require("../src/util/dl");

const itemsJsonPath = path.resolve(__dirname, "../out/items.json");
const itemsCsvUrl = "https://raw.githubusercontent.com/EssentialsX/Essentials/2.x/Essentials/src/items.csv";
const reportPath = path.resolve(__dirname, "../out/items.report.json");

const itemsCsvRegex = /^([a-z]+),/gm;

async function start() {
    const itemsJson = await fs.readFile(itemsJsonPath);
    const itemsCsv = await download(itemsCsvUrl);

    const jsonKeys = Object.keys(JSON.parse(itemsJson));
    const csvKeys = getCsvAliases(itemsCsv.replace("\\n", "\n"));

    const jsonMissing = _.difference(csvKeys, jsonKeys);
    const jsonExtra = _.difference(jsonKeys, csvKeys);

    fs.writeFile(reportPath, JSON.stringify({
        stats: {
            csvTotal: csvKeys.length,
            jsonTotal: jsonKeys.length,
            missing: jsonMissing.length,
            extra: jsonExtra.length,
            coverage: Math.ceil(((csvKeys.length - jsonMissing.length) / csvKeys.length) * 100)
        },
        missing: jsonMissing,
        extra: jsonExtra
    }, null, 4));
}

function getCsvAliases(csv) {
    let aliases = [];
    let m;

    while ((m = itemsCsvRegex.exec(csv)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === itemsCsvRegex.lastIndex) {
            itemsCsvRegex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        aliases.push(m[1]);
    }
    return aliases;
}

if (require.main === module) {
    start();
}
