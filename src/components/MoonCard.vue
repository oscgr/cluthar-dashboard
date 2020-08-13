<template>
  <v-card width="100%" flat dark :color="$vuetify.theme.dark ? '#0f4c75' : '#596e79'">
    <v-card-title class=" pb-0">
      <v-icon>mdi mdi-weather-sunny</v-icon> Soleil
    </v-card-title>
    <v-card-text class="py-0">
      <v-row>
        <v-col cols="12" class="">
          <v-icon>mdi mdi-weather-sunset-up</v-icon>
          <span class="subtitle-1" v-text="sunrise" />
          <v-spacer />
          <v-icon>mdi mdi-weather-sunset-down</v-icon>
          <span class="subtitle-1" v-text="sunset" />
          <v-spacer />
          <v-icon>mdi mdi-timer-outline</v-icon>
          <span class="subtitle-1" v-text="duration" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>

import moment from "moment";

export default {
  name: 'MoonCard',
  props: {
    azimuthInfos: {},
  },
  data: () => ({
    imageUrl: null,
  }),
  computed: {
    sunriseMoment() {
      return this.azimuthInfos?.sunrise ? moment(this.azimuthInfos?.sunrise, moment.HTML5_FMT.TIME_MS) : null
    },
    sunsetMoment() {
      return this.azimuthInfos?.sunrise ? moment(this.azimuthInfos?.sunset, moment.HTML5_FMT.TIME_MS) : null
    },
    sunrise() {
      return this.sunriseMoment ? (`${this.sunriseMoment.format('LT')} (${this.sunriseMoment.fromNow()})`) : '?'
    },
    sunset() {
      return this.sunsetMoment ? (`${this.sunsetMoment.format('LT')} (${this.sunsetMoment.fromNow()})`) : '?'
    },
    duration() {
      return this.azimuthInfos?.day_length ? this.azimuthInfos?.day_length : '?'
    }
  },
}
</script>
