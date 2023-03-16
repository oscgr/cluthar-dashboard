import type { ApexOptions } from 'apexcharts'
import CompassPoint from '@/enums/CompassPoint'

export default {
  getCompassPoint(rad: number) {
    rad = rad < 0 ? rad + 2 * Math.PI : rad
    if (rad < Math.PI / 8)
      return CompassPoint.SOUTH
    else if (rad < 3 * Math.PI / 8)
      return CompassPoint.SOUTH_WEST
    else if (rad < 5 * Math.PI / 8)
      return CompassPoint.WEST
    else if (rad < 7 * Math.PI / 8)
      return CompassPoint.NORTH_WEST
    else if (rad < 9 * Math.PI / 8)
      return CompassPoint.NORTH
    else if (rad < 11 * Math.PI / 8)
      return CompassPoint.NORTH_EAST
    else if (rad < 13 * Math.PI / 8)
      return CompassPoint.EAST
    else if (rad < 15 * Math.PI / 8)
      return CompassPoint.SOUTH_EAST
    else return CompassPoint.NORTH
  },
  getDegreesFromRadian(rad: number) {
    return Math.round(rad * 180 / Math.PI)
  },
  // TODO separate
  // getGlobalAnnotationLabel(text: string): AnnotationLabel {
  //   return {
  //     // borderColor: 'rgba(256, 256, 256, 0.9)',
  //     borderColor: 'transparent',
  //     style: {
  //       fontSize: '5px',
  //       background: 'transparent',
  //       color: dark.value ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
  //       //   background: 'rgba(256, 256, 256, 0.9)',
  //     },
  //     // text: `${Math.floor(max(payload.value.hourly?.map(m => m.temp)) || 0)}°C à ${DateTime.fromMillis((maxBy(chunkedHourly.value || [], 'temp')?.dt || 0) * 1000).toLocaleString(DateTime.TIME_24_SIMPLE)}`,
  //     text: 'max.',
  //   }
  // },
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
