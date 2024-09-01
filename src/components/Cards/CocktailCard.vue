<template>
  <v-card
    width="100%"
    height="100%"
    dark
    flat
    min-height="150px"
    :loading="loading"
    :title="(error || loading) ? t('constants.LAYOUT_CARD.COCKTAIL') : null"
  >
    <v-card-subtitle v-if="error" v-text="error" />
    <template v-else-if="!loading">
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
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useCocktail from '@/store/cocktail'

interface Ingredient {
  name: string | null
  measure: string | null
}
const { t } = useI18n()

const { error, loading, payload: cocktail } = useCocktail()
const ingredients = computed<Ingredient[]>(() => Array.from({ length: 14 }).reduce((prev, curr, i) => {
  if (cocktail.value?.[`strIngredient${i}`] || cocktail.value?.[`strMeasure${i}`]) {
    prev.push({
      name: cocktail.value?.[`strIngredient${i}`],
      measure: cocktail.value?.[`strMeasure${i}`],
    })
  }
  return prev
}, [] as Ingredient[]))
</script>

<style scoped>

</style>
