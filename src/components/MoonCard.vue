<template>
  <v-card width="100%" flat dark :color="$vuetify.theme.dark ? '#0f4c75' : '#596e79'">
    <v-card-text>
      <v-row no-gutters class="text-h4 pb-4">
        <v-col cols="2" class="text-center">
          <v-icon large class="info-icon">mdi mdi-weather-sunny</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="'Lune'" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="2" class="text-center">
          <v-icon title="lever du soleil" class="info-icon">mdi mdi-weather-sunset-up</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="moonrise" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="2" class="text-center">
          <v-icon title="coucher du soleil" class="info-icon">mdi mdi-weather-sunset-down</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="moonset" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="2" class="text-center">
          <v-icon title="durée de la journée" class="info-icon">mdi mdi-timer-outline</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="duration" />
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
  computed: {
    moonriseMoment() {
      return this.azimuthInfos?.moonrise ? moment(this.azimuthInfos?.moonrise, moment.HTML5_FMT.TIME_MS) : null
    },
    moonsetMoment() {
      return this.azimuthInfos?.moonrise ? moment(this.azimuthInfos?.moonset, moment.HTML5_FMT.TIME_MS) : null
    },
    moonrise() {
      return this.moonriseMoment ? (`${this.moonriseMoment.format('LT')} (${this.moonriseMoment.fromNow()})`) : '?'
    },
    moonset() {
      return this.moonsetMoment ? (`${this.moonsetMoment.format('LT')} (${this.moonsetMoment.fromNow()})`) : '?'
    },
    duration() {
      return null
      // return this.moonsetMoment.subtract(this.moonriseMoment).utc().format('HH:MM')
    }
  },
}
</script>
