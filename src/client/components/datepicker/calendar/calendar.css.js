import { colours, fontSizes, sizes } from '../../../globals.config'

export const day = {
  fontSize: fontSizes.calendar.days,
  verticalAlign: 'middle',
  textAlign: 'center',
  borderRadius: sizes.calendar.borderRadius,
  border: sizes.calendar.border,
  '&:hover': {
    borderColor: colours.blue
  }
}

export const prevMonth = {}

export const nextMonth = {}

export const table = {
  '& td': {
    padding: sizes.calendar.padding
  }
}

export const days ={
  '& > tr > td:nth-child(even)': {
    background: colours.background.main
  }
}

export const daysOfWeek = {
  fontSize: fontSizes.calendar.daysOfWeek
}
