import { computed, reactive, toRefs } from 'vue'
import useAxiosInstance from '@/store/axiosInstance'
import type { CardType } from '@/store/layout'
import useLayout from '@/store/layout'
import useErrorHandler from '@/utils/errorHandler'

export interface Drink {
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

const state = reactive({
  loading: false,
  payload: {} as Partial<Drink>,
  error: false as boolean | string,
})

function useCocktail() {
  const { layout } = useLayout()
  const { handleErrorTranslation } = useErrorHandler()
  const { local } = useAxiosInstance()
  const cocktailInfoIsRequired = computed(() => layout.value.some(c => (['COCKTAIL'] satisfies CardType[]).includes(c.cardType)))

  const fetchCocktail = async () => {
    if (!cocktailInfoIsRequired.value)
      return
    state.loading = true
    state.error = false

    try {
      const { data } = await local.get<Drink>('/api/secure/cocktail')
      state.payload = data
    }
    catch (e) {
      state.payload = {}
      state.error = handleErrorTranslation(e)
    }
    finally {
      state.loading = false
    }
  }
  /* ==================== ACTIONS ==================== */

  return {
    ...toRefs(state),
    fetchCocktail,
    cocktailInfoIsRequired,
  }
}

export default useCocktail
