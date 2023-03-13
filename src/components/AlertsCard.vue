<script>
import Moment from 'moment'
import { computed } from 'vue'
import weatherStore from '@/store/weatherStore'

export default {
  name: 'AlertsCard',
  setup() {
    const { payload } = weatherStore()

    const alerts = computed(() => payload.value.alerts)

    const unixFormatted = unixDate => Moment.unix(unixDate).format('DD/MM kk:mm')

    const unixFromNow = unixDate => Moment.unix(unixDate).fromNow()

    return {
      alerts,
      unixFromNow,
      unixFormatted,
    }
  },
}
</script>

<template>
  <v-card
    width="100%"
    height="100%"
    flat
    :color="$vuetify.theme.dark ? '#801336' : '#f89a9a'"
  >
    <v-card-text>
      <v-row v-for="alert in alerts" :key="alert.name" no-gutters>
        <v-col cols="12">
          <span class="text-h4 " v-text="alert.event" />
        </v-col>
        <v-col cols="6">
          <span class="h6" v-text="`${unixFormatted(alert.start)} (${unixFromNow(alert.start)})`" />
        </v-col>
        <v-col cols="6 text-right">
          <span class="h6" v-text="`${unixFormatted(alert.end)} (${unixFromNow(alert.end)})`" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
