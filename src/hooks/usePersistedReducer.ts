import React, { useRef, useEffect, useReducer } from 'react';
import deepEqual from 'fast-deep-equal/es6';

export function usePrevious(value: unknown) {
  const ref = useRef<unknown>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function usePersistedReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  storageKey: string
): [S, React.Dispatch<A>] {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const prevState = usePrevious(state);

  function init(): S {
    const stringState = localStorage.getItem(storageKey);
    if (stringState) {
      try {
        return JSON.parse(stringState) as S;
      } catch {
        return initialState;
      }
    }
    return initialState;
  }

  useEffect(() => {
    const stateEqual = deepEqual(prevState, state);
    if (!stateEqual) {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state]);

  return [state, dispatch];
}
