import { colours, fontSizes, sizes } from '../../../globals.config'

export const day = {
  fontSize: fontSizes.calendar.days,
  verticalAlign: 'middle',
  textAlign: 'center',
  borderRadius: sizes.calendar.borderRadius,
  border: `${sizes.calendar.border} transparent`,
  '&:hover': {
    borderColor: colours.blue,
    cursor: 'pointer'
  }
}

export const prevMonth = {
  color: colours.text.muted
}

export const nextMonth = {
  color: colours.text.muted
}

export const active = {
  color: colours.background.accent,
  background: colours.blue
}

export const table = {
  borderCollapse: 'separate',
  '& td': {
    padding: sizes.calendar.padding
  }
}

export const days = {
  '& > tr > td:nth-child(even)': {
    background: colours.background.main
  }
}

export const daysOfWeek = {
  fontSize: fontSizes.calendar.daysOfWeek
}
