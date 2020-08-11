<template>
  <v-card>
    <v-toolbar
      dense
      flat
      @click="show = !show"
      style="cursor: pointer"
    >
      <v-toolbar-title v-if="value && value.lat" v-text="`LAT ${value.lat} LONG ${value.lng}`" />
      <v-toolbar-title v-else v-text="'Choose a place...'" />
      <v-spacer />
      {{ show ? 'OK' : (value && value.lat ? 'Change location' : '')}}
      <v-icon>mdi mdi-chevron-{{ show ? 'up' : 'down' }}</v-icon>
    </v-toolbar>
    <v-expand-transition>
      <div v-show="show" style="cursor: crosshair"
           id="map" />
    </v-expand-transition>
  </v-card>
</template>

<style>
#map {
  height: 50vh;
  width: 100%
}

</style>
<script>

export default {
  name: 'placeSearch',
  props: {
    value: Object,
  },
  data() {
    return {
      show: false,
      map: null,
      marker: null,
    };
  },
  watch: {
    value(val) {
      if (this.map) {
        if (!this.marker) {
          this.marker = L.marker(val).addTo(this.map)
        } else {
          this.marker.setLatLng(val)
        }
        this.map.setView(val)
      }
    },
    show(val) {
      setTimeout(() => {
        if (val) {
          this.map = L.map('map').setView([47, 0], 6);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            detectRetina: true,
          }).setZIndex(0)
            .addTo(this.map);

          this.map.on('click', this.setCoordinates)

          if (!this.marker) {
            this.marker = L.marker(this.value).addTo(this.map)
          } else {
            this.marker.setLatLng(this.value)
          }
          this.map.setView(this.value)

        } else {
          this.map.remove()
          this.map = null
          this.marker = null
        }
      }, 300)
    }
  },
  methods: {
    setCoordinates(e) {
      this.$emit('input', {
        // values must be between -180 and 180
        lat: ((e.latlng.lat + 180) % 360) - 180,
        lng: ((e.latlng.lng + 180) % 360) - 180
      })
    },

  },
  mounted() {
    //
  }
}
</script>
