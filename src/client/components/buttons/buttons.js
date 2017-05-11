import React from 'react'
import FA from 'react-fontawesome'

import { round } from './buttons.css'

export const Round = p => <button className={round} {...p}><FA name={p.faName} /></button>


