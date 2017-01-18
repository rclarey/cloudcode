// src/redux/reducer.jsx

import { Map } from 'immutable';
import setState from './actions.jsx';

export default function (state = new Map(), action) {
  switch (action.type) {
    case 'SET_STATE': return setState(state, action.state);
    default: return state;
  }
}
