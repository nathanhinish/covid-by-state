type StateData = {
  location: string;
  population: number;
  lastDayWithNoConfirmed: string;
  confirmedDeltas: number[];
}

interface DataSet {
  dateKeys: string[];
  data: StateData[];
}

interface StoreState {
  readonly dataset: DataSet;
  includedStates: string[];
  popScaled: boolean;
  firstConfirmedShift: boolean;
  showPerDay: boolean;
  showCumulative: boolean;
}

interface StoreAction {
  type: string,
  payload: any
}
