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

export function diffNowLocaleString(dateTime: DateTime) {
  if (!dateTime.isValid)
    return
  const diff = dateTime.diffNow().shiftTo(...units)
  const unit = units.find(unit => diff.get(unit) !== 0) || 'second'

  const relativeFormatter = new Intl.RelativeTimeFormat('fr', { // TODO better intl selection
    numeric: 'auto',
  })
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit)
}
export function diffLocaleString(start: DateTime, end: DateTime) {
  if (!start.isValid || !end.isValid)
    return
  const diff = start.diff(end).shiftTo(...units)
  const unit = units.find(unit => diff.get(unit) !== 0) || 'second'

  const relativeFormatter = new Intl.RelativeTimeFormat('fr', { // TODO better intl selection
    numeric: 'auto',
  })
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit)
}
