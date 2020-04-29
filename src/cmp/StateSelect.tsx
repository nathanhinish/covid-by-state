import React from 'react';
import { Select, MenuItem, makeStyles } from '@material-ui/core';

import { data } from '../confirmed_by_state.json';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

export const StateSelect = () => {
  const { includedStates } = useSelector((state) => state) as StoreState;
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <Select
      id="stateSelect"
      label="States"
      className={classes.root}
      displayEmpty
      fullWidth
      renderValue={(value: unknown): React.ReactNode => {
        const states: string[] = value as string[];
        if (states.length === 0) {
          return 'Select a state';
        } else {
          return states.join(', ');
        }
      }}
      multiple
      value={includedStates}
      onChange={(e: any) =>
        dispatch({
          type: 'setIncludedStates',
          payload: e.target.value as string[],
        })
      }
    >
      {data.map((row) => (
        <MenuItem key={`mi-${row.provinceState}`} value={row.provinceState}>
          {row.provinceState}
        </MenuItem>
      ))}
    </Select>
  );
};
