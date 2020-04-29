import React from 'react';
import { Select, MenuItem, makeStyles } from '@material-ui/core';
import { useSelector, useDispatch, batch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    '@media (max-width: 799px)': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'stretch',
    },
  },
  select: {
    marginRight: theme.spacing(1),
    '&:last-child': {
      marginRight: 0,
    },
    '@media (max-width: 799px)': {
      flex: '1 1',
    },
  },
}));

export const ViewOptions = () => {
  const {
    dataset: { dateKeys },
    popScaled,
    firstConfirmedShift,
    showPerDay,
    showCumulative,
  } = useSelector((state) => state) as StoreState;
  const dispatch = useDispatch();
  const classes = useStyles();

  const firstDate = dateKeys[0];

  return (
    <div className={classes.root}>
      <Select
        className={classes.select}
        onChange={(e) => {
          dispatch({
            type: 'setPopScaled',
            payload: e.target.value === 'percent',
          });
        }}
        value={popScaled ? 'percent' : 'number'}
      >
        <MenuItem value="number">Show # of cases</MenuItem>
        <MenuItem value="percent">Show % of state pop.</MenuItem>
      </Select>
      <Select
        className={classes.select}
        onChange={(e) => {
          dispatch({
            type: 'setFirstConfirmedShift',
            payload: e.target.value === 'confirmed',
          });
        }}
        value={firstConfirmedShift ? 'confirmed' : 'date'}
      >
        <MenuItem value="date">Start at {firstDate}</MenuItem>
        <MenuItem value="confirmed">Start at first confirmed</MenuItem>
      </Select>
      <Select
        className={classes.select}
        onChange={(e) => {
          const v = e.target.value;
          batch(() => {
            dispatch({
              type: 'setShowPerDay',
              payload: v !== 'cumulative',
            });
            dispatch({
              type: 'setShowCumulative',
              payload: v !== 'daily',
            });
          });
        }}
        value={
          showCumulative && showPerDay
            ? 'both'
            : showPerDay
            ? 'daily'
            : 'cumulative'
        }
      >
        <MenuItem value="daily">Show cases per day</MenuItem>
        <MenuItem value="cumulative">Show cumulative</MenuItem>
        <MenuItem value="both">Show both</MenuItem>
      </Select>
    </div>
  );
};
