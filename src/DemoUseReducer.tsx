import { useReducer } from 'react';

const initialState = { count: 0 };

type ACTIONTYPE =
  | { type: "increment"}
  | { type: "decrement"};

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

export default function DemoUseReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}