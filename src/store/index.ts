/* globals __REDUX_DEVTOOLS_EXTENSION__ */
import { createStore } from 'redux';
import { dateKeys, data } from '../confirmed_by_state.json';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any
  }
}

const getDefaultState = (skipSession: boolean = false): StoreState => {
  return {
    dataset: {
      dateKeys,
      data: data as StateData[],
    },
    includedStates: ['United States', 'Washington', 'District of Columbia'],
    popScaled: true,
    firstConfirmedShift: false,
    showPerDay: true,
    showCumulative: false,
    ...(!skipSession
      ? JSON.parse(localStorage.getItem('state') || '{}')
      : {}),
  };
};

function root(state: StoreState | undefined, action: StoreAction): StoreState {
  if (typeof state === 'undefined') {
    return getDefaultState();
  }

  let newState: StoreState = {
    ...state,
    includedStates: [...state.includedStates],
  };

  switch (action.type) {
    case 'setIncludedStates':
      newState.includedStates = [...(action.payload as string[])];
      break;
    case 'setPopScaled':
      newState.popScaled = action.payload as boolean;
      break;
    case 'setFirstConfirmedShift':
      newState.firstConfirmedShift = action.payload as boolean;
      break;
    case 'setShowPerDay':
      newState.showPerDay = action.payload as boolean;
      break;
    case 'setShowCumulative':
      newState.showCumulative = action.payload as boolean;
      break;
    case 'resetApp':
      newState = getDefaultState(true);
      break;
  }

  return newState;
}

const store = createStore(
  root,
  getDefaultState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  const {
    includedStates,
    popScaled,
    firstConfirmedShift,
    showPerDay,
    showCumulative,
  } = store.getState();
  localStorage.setItem(
    'state',
    JSON.stringify({
      includedStates,
      popScaled,
      firstConfirmedShift,
      showPerDay,
      showCumulative,
    })
  );
});

export default store;
