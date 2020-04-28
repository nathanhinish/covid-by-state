import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import './App.css';
import store from './store';
import theme from './theme';

import { Main } from './cmp/Main';

function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
