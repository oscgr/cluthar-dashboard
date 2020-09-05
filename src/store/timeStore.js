import {computed, reactive} from "@vue/composition-api";
import moment from 'moment'

const state = reactive({
  now: moment(),
})

const update = () => {
  state.now = moment()
}

setInterval(() => update(), 1000)

export default () => {

  const now = computed(() => state.now)

  const fromNow = (date) => moment(date).from(state.now)

  return {
    now,
    fromNow,
  }
}
