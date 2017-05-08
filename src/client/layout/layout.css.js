import { colours, sizes } from '../globals.config'

export const container = {
  background: colours.background.accent,
  margin: sizes.margin,
  padding: sizes.padding,
  boxShadow: '0 12px 22px 0 rgba(0,0,0,0.24)',
  borderRadius: sizes.borderRadius
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
  alignItems: 'center',
  justifyContent: 'center'
}

export const loadSplashItem = {
  maxWidth: '50%',
  flex: 0
}
