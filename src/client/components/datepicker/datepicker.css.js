import { colours } from '../../globals.config'

export const datePicker = {
  '& div': {
    width: '100%',
    padding: 0,
    border: 'none',
    '& :global(.m-calendar)': {
      '& td': {
        color: colours.text.main
      },
      '& thead td': {
        fontSize: '8px'
      }
    }
  }
}
