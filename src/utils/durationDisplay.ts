import type { DateTime } from 'luxon'

const units: Intl.RelativeTimeFormatUnit[] = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
]

export const diffNowLocaleString = (dateTime: DateTime) => {
  if (!dateTime.isValid)
    return
  const diff = dateTime.diffNow().shiftTo(...units)
  const unit = units.find(unit => diff.get(unit) !== 0) || 'second'

  const relativeFormatter = new Intl.RelativeTimeFormat('fr', { // TODO better intl selection
    numeric: 'auto',
  })
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit)
}
export const diffLocaleString = (start: DateTime, end: DateTime) => {
  if (!start.isValid || !end.isValid)
    return
  const diff = start.diff(end).shiftTo(...units)
  const unit = units.find(unit => diff.get(unit) !== 0) || 'second'

  const relativeFormatter = new Intl.RelativeTimeFormat('fr', { // TODO better intl selection
    numeric: 'auto',
  })
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit)
}
