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
      <v-row no-gutters class="text-h6">
        <v-col cols="2" class="text-center">
          <v-icon title="durée de la journée" class="info-icon">mdi mdi-timer-outline</v-icon>
        </v-col>
        <v-col cols="10">
          <span v-text="phase" />
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
    timezone: Number,
    timezoneString: String,
  },
  computed: {
    sunriseMoment() {
      if (!this.azimuthInfos || Object.keys(this.azimuthInfos).length === 0) return null
      return moment(this.azimuthInfos.sunrise, moment.HTML5_FMT.TIME)
    },
    sunsetMoment() {
      if (!this.azimuthInfos || Object.keys(this.azimuthInfos).length === 0) return null
      return moment(this.azimuthInfos.sunset, moment.HTML5_FMT.TIME)
    },
    sunrise() {
      if (!moment.isMoment(this.sunriseMoment)) return '?'
      return `${this.sunriseMoment.format('HH:mm')} (${this.timezoneString}) (${this.sunriseMoment.to(moment().utcOffset(this.timezone))})`
    },
    sunset() {
      if (!moment.isMoment(this.sunsetMoment)) return '?'
      return `${this.sunsetMoment.format('LT')} (${this.sunsetMoment.to(moment().utcOffset(this.timezone))})`
    },
    duration() {
      if (!(moment.isMoment(this.sunriseMoment) && moment.isMoment(this.sunsetMoment))) return '?'
      return this.sunsetMoment.subtract(this.sunriseMoment).utc().format('HH:mm')
    },
    phase() {
      const now = moment()
      // console.log(this.sunriseMoment)
      // console.log(this.sunsetMoment)
      // console.log(now.format())
      // const sunriseDiff = this.sunriseMoment.diff(now, 'minute')
      // const sunsetDiff = this.sunsetMoment.diff(now, 'minute')
      // console.log(sunriseDiff, sunsetDiff)
      return now
    }
  },
}
</script>
