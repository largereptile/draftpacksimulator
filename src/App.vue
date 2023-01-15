<script setup>
import Pack from "./components/Pack.vue";
import {ref} from "vue";
import {generateBoosters} from "./components/generateBoosters.js";


const packJson = ref({});
const targetSet = ref("")
const cards = ref([])
const cardImages = ref([])

async function getData(set) {
  cardImages.value = []
  cards.value = []
  const res = await fetch("data/" + set + ".json");
  packJson.value = await res.json();
  cards.value = generateBoosters(packJson.value)
  for(const card of cards.value) {
    cardImages.value.push(await getArtForCard(card))
  }
}

async function getArtForCard(card) {
  let response = await fetch("https://api.scryfall.com/cards/" + card["identifiers"]["scryfallId"])
  let data = await response.json()
  let imageURIS = data["image_uris"]
  if(!imageURIS) {
    return "None"
  }
  if("png" in imageURIS) {
    return imageURIS["png"]
  } else if ("normal" in imageURIS) {
    return imageURIS["normal"]
  } else {
    return "None"
  }
}

</script>


<template>
  <main style="width: 80%;">
      <v-row>
        <h1>Pack Open Simulator</h1>
      </v-row>
      <v-row>
        <div class="myGrid" v-if="cards.length > 0">
          <div class="cardImage" v-for="card of cardImages">
            <v-img v-if="card !== 'None'" :src="card"></v-img>
            <v-img v-if="card === 'None'" src="http://www.hearthcards.net/mycards/card_ajax_comments.php?id=784d7d46"></v-img>
          </div>
        </div>
      </v-row>
      <v-row>
        <v-text-field v-model="targetSet" label="Type Set Here"></v-text-field>
      </v-row>
      <v-row>
        <v-btn @click="getData(targetSet)">open booster pack</v-btn>
      </v-row>
  </main>
</template>

<style scoped>
.myGrid {
  display: flex;
  flex-wrap: wrap;
}

.cardImage {
  display: block;
  float: left;
  width: 13rem;
}

</style>
