import { colours, sizes } from '../../../globals.config'
import { levels } from '../../../../constants'

export const left = {
  display: 'inline-block',
  marginRight: sizes.margin,
  fontSize: '14px'
}

export const text = {
  display: 'inline-block',
  verticalAlign: 'top'
}

export const line = {
  display: 'block',
  margin: `0 0 ${sizes.margin} 0`
}

const levelStyle = level => ({
  fontWeight: levels.error,
  color: colours.loglevels.find(k => k.level === level).colour
})

// Export a module for each level
Object.keys(levels).forEach(k => { exports[k] = levelStyle(levels[k]) })
