import { colours, sizes } from '../../../globals.config';
import { levels } from '../../../../constants';

export const left = {
  display: 'inline-block',
  'margin-right': sizes.margin,
  'font-size': '14px'
};

export const text = {
  display: 'inline-block',
  'vertical-align': 'top',
};

export const line = {
  display: 'block',
  margin: `0 0 ${sizes.margin} 0`
};

const levelStyle = level => ({
  'font-weight': levels.error,
  color: colours.loglevels.find(k => k.level === level).colour
});

// Export a module for each level
Object.keys(levels).map(k => exports[k] = levelStyle(levels[k]));
