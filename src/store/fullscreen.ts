import { useFullscreen as useFullscreenVueUse, useLocalStorage } from '@vueuse/core'

const fullScreen = useLocalStorage('fullscreen', false)
const useFullscreen = () => {
  const { enter, exit } = useFullscreenVueUse()

  const toggleFullScreen = async () => {
    fullScreen.value = !fullScreen.value
    if (fullScreen.value)
      await enter()
    else
      await exit()
  }

  return {
    fullScreen,
    toggleFullScreen,
  }
}
export default useFullscreen
