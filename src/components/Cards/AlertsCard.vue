<template>
  <v-card
    width="100%"
    height="100%"
    min-height="150px"
    flat
    :loading="loading"
    :color="(alerts.length > 0) ? (dark ? 'primary' : '') : null"
    :title="(error || loading) ? t('constants.LAYOUT_CARD.WEATHER_ALERTS') : null"
  >
    <v-card-subtitle v-if="error" v-text="error" />
    <template v-else-if="!loading">
      <v-card-subtitle v-if="alerts.length === 0" class="pa-4">
        Aucune alerte météo
      </v-card-subtitle>
      <v-card-text v-else>
        <v-row v-for="(alert, i) in alerts" :key="alert.name" no-gutters>
          <v-col v-if="i !== 0" cols="12">
            <v-divider class="my-4" />
          </v-col>
          <v-col cols="12">
            <span class="text-h5 " v-text="alert.event" />
          </v-col>
          <v-col cols="12">
            <span class=" " v-text="alert.name" />
          </v-col>
          <v-col cols="12">
            <span class=" " v-text="alert.description" />
          </v-col>
          <v-col cols="6">
            <span class="font-weight-medium" v-text="`À partir du ${unixFormatted(alert.start)} (${unixFromNow(alert.start)})`" />
          </v-col>
          <v-col cols="6" class="text-right">
            <span class="font-weight-medium" v-text="`Jusqu'à ${unixFormatted(alert.end)} (${unixFromNow(alert.end)})`" />
          </v-col>
          <v-col cols="12" class="text-caption text-right">
            <span v-text="alert.sender_name" />
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { DateTime } from 'luxon'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import useWeather from '@/store/weather'
import { diffNowLocaleString } from '@/utils/durationDisplay.js'

const { t } = useI18n()
const { payload, error, loading } = useWeather()

const dark = useDark()

const alerts = computed(() => (payload.value?.alerts || []).reduce((previousValue, currentValue) => {
  const existingAlert = previousValue.find(pv => pv.event === currentValue.event)
  if (existingAlert) {
    existingAlert.start = (existingAlert.start < currentValue.start) ? existingAlert.start : currentValue.start
    existingAlert.end = (currentValue.end < existingAlert.end) ? existingAlert.end : currentValue.end
  }
  else {
    previousValue.push(currentValue)
  }
  return previousValue
}, []))

const unixFormatted = (unixDate?: number) => unixDate && DateTime.fromMillis(unixDate * 1000).toLocaleString(DateTime.DATETIME_SHORT)

const unixFromNow = (unixDate?: number) => unixDate && diffNowLocaleString(DateTime.fromMillis(unixDate * 1000))
</script>
