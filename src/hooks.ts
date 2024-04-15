import React, { useRef, useEffect, useReducer } from "react"
import deepEqual from "fast-deep-equal/es6"

// Given any value
// This hook will return the previous value
// Whenever the current value changes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePrevious(value: any) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export function usePersistedReducer<State, Action>(
  reducer: (state: State, action: Action) => State,
  initialState: State,
  storageKey: string
): [State, action: React.Dispatch<Action>] {

    console.log('usePersistedReducer 1');

  const [state, dispatch] = useReducer(reducer, initialState, init);
  const prevState = usePrevious(state);

  function init(): State {
    const stringState = localStorage.getItem(storageKey)
    if (stringState) {
      try {
        return JSON.parse(stringState)
      } catch (error) {
        return initialState
      }
    } else {
      return initialState
    }
  }

  useEffect(() => {
    const stateEqual = deepEqual(prevState, state)
    if (!stateEqual) {
        console.log('usePersistedReducer useEffect state not equal');
        const stringifiedState = JSON.stringify(state)
        localStorage.setItem(storageKey, stringifiedState)
    }
  }, [state]);

  console.log('usePersistedReducer 2');

  return [ state, dispatch ];
}
