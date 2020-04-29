import React from 'react';
import { useSelector } from 'react-redux';
import { CumulativeChart } from './CumulativeChart';
import { PerDayChart } from './PerDayChart';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    flex: '1 1 100%',
    overflow: 'hidden',
  },
});

export const Charts = () => {
  const classes = useStyles();
  const state = useSelector((state) => state) as StoreState;
  const { showCumulative, showPerDay } = state;

  return (
    <div className={classes.root}>
      {showPerDay ? <PerDayChart /> : null}
      {showCumulative ? <CumulativeChart /> : null}
    </div>
  );
};
