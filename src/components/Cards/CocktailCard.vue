<template>
  <v-card
    width="100%"
    height="100%"
    dark
    flat
  >
    <div style="position:relative;">
      <v-img :src="cocktail?.strDrinkThumb" :lazy-src="`${cocktail?.strDrinkThumb}/preview`" absolute position="right" />
      <v-card-title v-show="cocktail?.strDrink" v-text="cocktail?.strDrink" />
      <v-card-subtitle>
        <table>
          <tr v-for="(ingredient, i) in ingredients" :key="i">
            <td class="font-weight-thin text-right pr-2" v-text="ingredient.measure" />
            <td v-text="ingredient.name" />
          </tr>
        </table>
      </v-card-subtitle>
    </div>
    <v-card-text>
      <div v-html="(cocktail?.strInstructionsFR || cocktail?.strInstructions)?.replaceAll('. ', '.<br>')" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useAxiosInstance from '@/store/axiosInstance'

interface Drink {
  idDrink: string
  strDrink: string
  strDrinkAlternate: string | null
  strTags: string | null
  strAlcoholic: string
  strGlass: string
  strInstructions: string | null
  strInstructionsFR: string | null
  strDrinkThumb: string
  strIngredient1: string | null
  strIngredient2: string | null
  strIngredient3: string | null
  strIngredient4: string | null
  strIngredient5: string | null
  strIngredient6: string | null
  strIngredient7: string | null
  strIngredient8: string | null
  strIngredient9: string | null
  strIngredient10: string | null
  strIngredient11: string | null
  strIngredient12: string | null
  strIngredient13: string | null
  strIngredient14: string | null
  strIngredient15: string | null
  strMeasure1: string | null
  strMeasure2: string | null
  strMeasure3: string | null
  strMeasure4: string | null
  strMeasure5: string | null
  strMeasure6: string | null
  strMeasure7: string | null
  strMeasure8: string | null
  strMeasure9: string | null
  strMeasure10: string | null
  strMeasure11: string | null
  strMeasure12: string | null
  strMeasure13: string | null
  strMeasure14: string | null
  strMeasure15: string | null
}
interface Ingredient {
  name: string | null
  measure: string | null
}

const cocktail = ref<Drink>()
const { local } = useAxiosInstance()

const ingredients = computed<Ingredient[]>(() => Array.from({ length: 14 }).reduce((prev, curr, i) => {
  if (cocktail.value?.[`strIngredient${i}`] || cocktail.value?.[`strMeasure${i}`]) {
    prev.push({
      name: cocktail.value?.[`strIngredient${i}`],
      measure: cocktail.value?.[`strMeasure${i}`],
    })
  }
  return prev
}, [] as Ingredient[]))
onMounted(async () => {
  const { data } = await local.get<Drink>('/api/cocktail')
  cocktail.value = data
})
</script>

<style scoped>

</style>
