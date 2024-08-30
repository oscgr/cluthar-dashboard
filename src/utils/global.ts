import type { ApexOptions } from 'apexcharts'
import { merge } from 'lodash'
import CompassPoint from '@/enums/CompassPoint'
import type { RecursivePartial } from '@/util'

export default {
  getCompassPoint(degrees: number) {
    const DIVISION = 360 / 16
    if (degrees < DIVISION)
      return CompassPoint.NORTH
    else if (degrees < 3 * DIVISION)
      return CompassPoint.NORTH_EAST
    else if (degrees < 5 * DIVISION)
      return CompassPoint.EAST
    else if (degrees < 7 * DIVISION)
      return CompassPoint.SOUTH_EAST
    else if (degrees < 9 * DIVISION)
      return CompassPoint.SOUTH
    else if (degrees < 11 * DIVISION)
      return CompassPoint.SOUTH_WEST
    else if (degrees < 13 * DIVISION)
      return CompassPoint.WEST
    else if (degrees < 15 * DIVISION)
      return CompassPoint.NORTH_WEST
    else return CompassPoint.NORTH
  },
  getWeatherIcon(id: number, day?: boolean) {
    return `wi:wi-owm${(typeof day !== 'undefined') ? (day ? '-day' : '-night') : ''}-${id}`
  },
  getDegreesFromRadian(rad: number) {
    return Math.round(rad * 180 / Math.PI)
  },
  mergeApexChartOptions(partial: RecursivePartial<ApexOptions>): ApexOptions {
    return merge(this.getGlobalApexChartOptions(), partial)
  },

  getGlobalApexChartOptions(): ApexOptions {
    return {
      dataLabels: {
        enabled: false,
      },
      chart: {
        sparkline: {
          enabled: true,
        },
        fontFamily: 'Roboto Condensed, sans-serif',
        animations: {},
      },
      tooltip: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'round',
        width: 1,
      },
    }
  },
}
