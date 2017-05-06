import { colours, sizes } from '../globals.config'

export const container = {
  background: colours.background.accent,
  margin: sizes.margin,
  padding: sizes.padding,
  'box-shadow': '0 12px 22px 0 rgba(0,0,0,0.24)',
  'border-radius': sizes.borderRadius
}

export const spinner = {
  float: 'right',
  '& > :global(.sk-circle:before)': {
    background: '#FFFFFF'
  }
}

export const loadSplash = {
  height: '100vh', // TODO check support for vh
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center'
}

export const loadSplashItem = {
  'max-width': '50%',
  'flex': 0
}
