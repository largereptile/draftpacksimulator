import * as allPrintings from "./public/data/AllPrintings.json" assert {type: "json"}

import * as fs from "fs";

let sets = allPrintings["default"]["data"];

let allCards = {}

for(const setData of Object.values(sets)) {
    console.log(setData)
}