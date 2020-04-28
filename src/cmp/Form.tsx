import React from 'react';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  makeStyles,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { StateSelect } from './StateSelect';

const useStyles = makeStyles({
  root: {
    flex: 0
  }
})

export const Form = () => {
  const classes = useStyles();
  const {
    includedStates,
    popScaled,
    firstConfirmedShift,
    showPerDay,
    showCumulative,
  } = useSelector((state) => state) as StoreState;
  const dispatch = useDispatch();

  return (
    <form noValidate autoComplete="off" className={classes.root}>
      <div className="chart-options-row">
        <FormControl className="chart-options-control">
          <StateSelect
            value={includedStates}
            onChange={(e: any) =>
              dispatch({
                type: 'setIncludedStates',
                payload: e.target.value as string[],
              })
            }
          />
        </FormControl>
      </div>
      <div className="chart-options-row">
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={popScaled}
                onChange={(e: any) =>
                  dispatch({
                    type: 'setPopScaled',
                    payload: e.target.checked,
                  })
                }
              />
            }
            label="Scaled to % of state pop"
          />
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={firstConfirmedShift}
                onChange={(e: any) =>
                  dispatch({
                    type: 'setFirstConfirmedShift',
                    payload: e.target.checked,
                  })
                }
              />
            }
            label="Use days since first confirmed"
          />
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={showPerDay}
                onChange={(e: any) =>
                  dispatch({
                    type: 'setShowPerDay',
                    payload: e.target.checked,
                  })
                }
              />
            }
            label="Show confirmed per day"
          />
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={showCumulative}
                onChange={(e: any) =>
                  dispatch({
                    type: 'setShowCumulative',
                    payload: e.target.checked,
                  })
                }
              />
            }
            label="Show cumulative confirmed"
          />
        </FormGroup>
      </div>
    </form>
  );
};
