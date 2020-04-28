import { createStore } from 'redux';
import { dateKeys, data } from '../confirmed_by_state.json';

const defaultState: StoreState = {
  dataset: {
    dateKeys,
    data: data as StateData[],
  },
  includedStates: ['Washington'],
  popScaled: true,
  firstConfirmedShift: true,
  showPerDay: false,
  showCumulative: true,
  ...JSON.parse(sessionStorage.getItem('state') || '{}')
};

function root(state: StoreState | undefined, action: StoreAction): StoreState {
  if (typeof state === 'undefined') {
    return {
      ...defaultState,
    };
  }

  const newState: StoreState = {
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
  }

  return newState;
}

const store = createStore(root);

store.subscribe((...rest: any) => {
  const {
    includedStates,
    popScaled,
    firstConfirmedShift,
    showPerDay,
    showCumulative,
  } = store.getState();
  sessionStorage.setItem(
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
