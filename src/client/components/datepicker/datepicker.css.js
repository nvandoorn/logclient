import { colours } from '../../globals.config'

export const datePicker = {
  '& div': {
    color: colours.text.main,
    width: '100%',
    padding: 0,
    border: 'none',
    '& :global(.im-btn)': {
      background: colours.background.accent
    },
    '& :global( .toolbar .current-date)': {
      color: colours.text.main
    },
    '& :global(.m-calendar)': {
      '& td': {
        color: colours.text.main
      },
      '& :global(.prev-month), & :global(.next-month)': {
        color: colours.text.muted
      },
      '& thead td': {
        fontSize: '8px'
      }
    }
  }
}
