<template>
  <v-skeleton-loader
    :style="{width: '100%', height: '100%'}"
    width="100%"
    type="image"
    :loading="loading"
  >
    <v-card
      width="100%"
      height="100%"
      flat
    >
      <v-card-title v-text="`Précipitation dans l'heure`" />
      <v-card-text v-if="!anyPrecipitation">
        <span class="display-1" v-text="'Aucune pluie enregistrée'" />
      </v-card-text>
      <v-sparkline
        v-if="anyPrecipitation"
        fill
        padding="0"
        :color="$vuetify.theme.dark ? 'white': 'primary'"
        smooth
        :value="precipitation"
      />
    </v-card>

  </v-skeleton-loader>
</template>
<script>
import weatherStore from "@/store/weatherStore";
import {mdiCloudOutline, mdiGauge, mdiSnowflake, mdiWaterPercent, mdiWeatherPouring, mdiWeatherWindy} from '@mdi/js'
import {computed} from "@vue/composition-api";

export default {
  name: 'CurrentWeatherCard',

  setup() {

    // const vm = getCurrentInstance().proxy

    const {loading, payload} = weatherStore()

    const precipitation = computed(() => payload.value.minutely?.map(m => m.precipitation))

    const anyPrecipitation = computed(() => payload.value.minutely?.some(m => m.precipitation > 0))

    // const cardColor = computed(() => {
    //   if (isCloudy.value && vm.$vuetify.theme.dark) return '#516269'
    //   else if (vm.$vuetify.theme.dark) return '#29586d'
    //   else if (!isCloudy.value) return '#a6dcef'
    //   else return '#d8e9ef'
    // })

    return {
      loading,
      precipitation,
      anyPrecipitation,
      // icons
      mdiCloudOutline, mdiWeatherWindy, mdiWaterPercent, mdiGauge, mdiWeatherPouring, mdiSnowflake,
    }
  }
}
</script>
