import { reducer } from "./store/reducer";

export function createStore(reduce) {
  let state;
  let listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      listeners = listeners.filter((rlistener) => rlistener !== listener);
    };
  }

  function getState() {
    return state;
  }

  function dispatch(action) {
    // call reducer to get new state
    // notify subscriber
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) listeners[i]();
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}
