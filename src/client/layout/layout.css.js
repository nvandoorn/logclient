import { colours, sizes } from '../globals.config'

export const container = {
  background: colours.background.accent,
  margin: sizes.margin,
  padding: sizes.padding,
  'box-shadow': '0 12px 22px 0 rgba(0,0,0,0.24)',
  'border-radius': sizes.borderRadius
}

export const spinner = {
  float: 'right'
}

export default {
  ':global(.sk-circle:before)': {
    background: '#FFFFFF'
  }
}
