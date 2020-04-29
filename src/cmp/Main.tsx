import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Header } from './Header';
import { Charts } from './Charts';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '1.5em 2.5em'
  }
}))


export const Main = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <Charts />
    </div>
  );
};
