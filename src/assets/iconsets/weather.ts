import { h } from 'vue'
import type { IconProps, IconSet } from 'vuetify'
import { VClassIcon } from 'vuetify/components/VIcon'
import '@/assets/css/weather-icons.css'
import '@/assets/css/weather-icons-wind.css'

const weather: IconSet = {
  component: (props: IconProps) => h(VClassIcon, {
    ...props,
    class: 'wi',
  }),
}

export { weather }
