// src/redux/actions.jsx

export default function setState(state, newState) {
  return state.merge(newState);
}
