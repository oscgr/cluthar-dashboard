<template>
  <div>
    <div id="mapid"></div>
  </div>
</template>

<style>
#mapid { height: 50vh; width: 100% }

</style>
<script>

export default {
  name: 'placeSearch',
  props: {
    coordinates: Object,
  },
  data() {
    return {
      loading: false,
      map: null,
    };
  },
  watch: {
    coordinates(val) {
      console.log(val);
    },
  },
  methods: {
    setCoordinates(e) {
      console.log(e)
      L.popup()
        .setLatLng(e.latlng)
        .openOn(this.map);

      this.$emit('set-coordinates', e.latlng)
    },
  },
  mounted() {
    this.map = L.map('mapid').setView([47, 0], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // L.handler()

    this.map.on('click', this.setCoordinates);
  }
}
</script>
