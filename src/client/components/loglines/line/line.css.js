import { colours, sizes } from '../../../globals.config';

export const left = {
  display: 'inline-block',
  'margin-right': sizes.margin,
  'font-size': '14px'
};

export const text = {
  display: 'inline-block',
  'vertical-align': 'top',
};

export const baseLevel = {
  'font-weight': 'bold'
}
export const line = {
  display: 'block',
  margin: `0 0 ${sizes.margin} 0`
}

export const debug = {
  composes: 'baseLevel',
  color: colours.loglevels.debug
};

export const info = {
  composes: 'baseLevel',
  color: colours.loglevels.info
};

export const warn = {
  composes: 'baseLevel',
  color: colours.loglevels.warn
};

export const error = {
  composes: 'baseLevel',
  color: colours.loglevels.error
};

