<template>
  <v-card width="100%" flat :color="$vuetify.theme.dark ? '#801336' : '#dfd3c3'">
    <v-card-text>
      <v-row no-gutters class="text-h4 pb-4">
        <v-col cols="2" class="text-center">
          <v-icon large class="info-icon">mdi mdi-weather-sunny</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="'Soleil'" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="2" class="text-center">
          <v-icon title="lever du soleil" class="info-icon">mdi mdi-weather-sunset-up</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="sunrise" />
        </v-col>
      </v-row>
      <v-row no-gutters class="text-h6">
        <v-col cols="2" class="text-center">
          <v-icon title="coucher du soleil" class="info-icon">mdi mdi-weather-sunset-down</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="sunset" />
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
  name: 'SunCard',
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
