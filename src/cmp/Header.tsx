import React from 'react';
import { makeStyles, Typography, Button } from '@material-ui/core';
import { ViewOptions } from './ViewOptions';
import { StateSelect } from './StateSelect';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  row: {
    '@media (max-width: 799px)': {
      '& > h1': {
        marginBottom: theme.spacing(1),
      },
    },
    '@media (min-width: 800px)': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  spacer: {
    flex: '1 1 0',
  },
}));

export const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <header className={classes.root}>
      <div className={classes.row}>
        <Typography variant="h1">COVID-19 Trends by State</Typography>
        <div className={classes.spacer} />
        <ViewOptions />
      </div>
      <StateSelect />
      <Button
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          dispatch({
            type: 'resetApp',
          });
        }}
      >
        Reset all settings
      </Button>
    </header>
  );
};
