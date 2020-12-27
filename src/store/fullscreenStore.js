import {useFullscreen, useLocalStorage} from "@vueuse/core";



export default () => {

  const fullScreen = useLocalStorage('fullscreen', false)
  const {enter, exit} = useFullscreen()

  const toggleFullScreen = async () => {
    fullScreen.value = !fullScreen.value
    if (fullScreen.value) {
      await enter()
    } else {
      await exit()
    }
  }

  return {
    fullScreen,
    toggleFullScreen,
  }
}
