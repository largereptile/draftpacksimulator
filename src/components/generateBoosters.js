
function pickConfiguration(packConfigs, configWeights) {
    let weights = []
    for(let i = 0; i<configWeights.length; i++) {
        for(let j = 0; j<configWeights[i] + 1; j++) {
            weights.push(packConfigs[i])
        }
    }
    return weights[Math.floor(Math.random() * weights.length)]
}

function getRandomCard(cards) {
    let cardIDs = []
    let cardWeights = []
    for(const [id, w] of Object.entries(cards)) {
        cardIDs.push(id)
        cardWeights.push(w)
    }

    return pickConfiguration(cardIDs, cardWeights)
}
function selectCardsFromSheet(sheet, count) {
    let outputCards = []
    for(let i = 0; i < count; i++) {
        let cardID = getRandomCard(sheet["cards"])
        outputCards.push(cardID);
    }
    return outputCards
}

export function generateBoosters(packJson) {
    if(!packJson || !packJson["data"] || !packJson["data"]["booster"] || !packJson["data"]["booster"]["default"]) {
        return ["NO CARDS FUCK OFF"];
    }

    let boosters = packJson["data"]["booster"]["default"];

    let packConfigurations = boosters["boosters"].map(x => x["contents"])
    let configurationWeights = boosters["boosters"].map(x => x["weight"])
    let chosenConfig = pickConfiguration(packConfigurations, configurationWeights)

    let sheets = boosters["sheets"]

    let outputCardIDs = []

    for(const [sheetName, count] of Object.entries(chosenConfig)) {
        outputCardIDs = outputCardIDs.concat(selectCardsFromSheet(sheets[sheetName], count))
    }

    let cards = packJson["data"]["cards"]
    let outputCards = []
    for(const card of cards) {
        if(outputCardIDs.includes(card["uuid"])) {
            for(let i = 0; i < outputCardIDs.filter(x => x === card["uuid"]).length; i++) {
                outputCards.push(card)
            }
        }
    }
    return outputCards

}