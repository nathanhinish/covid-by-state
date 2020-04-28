import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { Charts } from './Charts';
import { Form } from './Form';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    boxSizing: 'border-box',
    padding: '1.5em 2.5em',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '& > main': {
      flex: '1 1 0',
      marginTop: 10,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }
}))


export const Main = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h1">COVID-19 Trends by State</Typography>
      <main>
        <Charts />
        <Form />
      </main>
    </div>
  );
};
