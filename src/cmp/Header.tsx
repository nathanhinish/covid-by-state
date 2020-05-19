import React, { useState } from 'react';
import {
  makeStyles,
  Typography,
  Button,
} from '@material-ui/core';
import { ViewOptions } from './ViewOptions';
import { StateSelect } from './StateSelect';
import { useDispatch } from 'react-redux';

import { ViewOptionsButton } from './ViewOptionsButton';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  rowIconButton: {
    marginRight: theme.spacing(-2),
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
        {/* <ViewOptions /> */}
        <ViewOptionsButton className={classes.rowIconButton} />
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
