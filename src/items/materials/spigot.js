const download = require("../../util/dl");

const srcFile = "https://hub.spigotmc.org/stash/projects/SPIGOT/repos/bukkit/raw/src/main/java/org/bukkit/Material.java?at=refs%2Fheads%2Fmaster";
const definitionRegex = /([A-Z13_]+)\(/gm;

const isItemBodyRegex = /public boolean isItem\(\) {([\s\S]+?)}/gm;
const caseRegex = /case ([A-Z13_]+):/gm;

let src;

const prep = async () => {
    src = await download(srcFile);
};

const retrieve = () => {
    let matches;
    const materialsFound = [];
    const excludes = [];

    [isItem] = isItemBodyRegex.exec(src);
    while ((matches = caseRegex.exec(isItem)) !== null) {
        if (matches.index === definitionRegex.lastIndex) {
            definitionRegex.lastIndex++;
        }

        const materialName = matches[1];
        excludes.push(materialName);
    }

    while ((matches = definitionRegex.exec(src)) !== null) {
        if (matches.index === definitionRegex.lastIndex) {
            definitionRegex.lastIndex++;
        }

        const materialName = matches[1];

        // Skip legacy materials
        if (materialName.includes("LEGACY_")) continue;

        // Skip excludes
        if (excludes.includes(materialName)) continue;

        materialsFound.push({
            material: materialName
        });
    }

    return materialsFound;
}

module.exports = { prep, retrieve };
