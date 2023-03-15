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
  getGlobalApexChartOptions(): ApexOptions {
    return {
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      chart: {
        id: '0',
        toolbar: {
          show: false,
        },
        fontFamily: 'Roboto, sans-serif',
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        show: true,
        curve: 'smooth',

        // lineCap: 'butt',
        // colors: ['#ea0000'],
        width: 2,
        // colors: ['#801336', '#dfd3c3', '#dfd3c3'],
      },
    }
  },
}
