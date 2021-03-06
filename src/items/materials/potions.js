const _ = require("lodash");

const potionList = require("./data/potions.json");
const potionEnumMapping = require("./data/potionsEnum.json");

const retrieve = () => _.flatten(
    potionList.map(potion => {
        const base = {
            skipSimple: true,
            potionData: {
                vanillaType: potion,
                type: getEnumName(potion),
                upgraded: potion.includes("strong_"),
                extended: potion.includes("long_"),
            }
        };

        return [
            {
                material: "POTION",
                ...base
            },
            {
                material: "SPLASH_POTION",
                ...base
            },
            {
                material: "LINGERING_POTION",
                ...base
            },
            {
                material: "TIPPED_ARROW",
                ...base
            },
        ];
    })
);

function getEnumName(potion) {
    const shortName = potion.replace("long_", "").replace("strong_", "");
    return potionEnumMapping[shortName] || shortName.toUpperCase();
}

function getModifier(potion) {
    return potion.includes("long_") ? "long"
        : potion.includes("strong_") ? "strong"
        : null;
}

module.exports = { retrieve };
