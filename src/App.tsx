import React from 'react';
import Chart from 'react-apexcharts';
import { dateKeys, data } from './confirmed_by_state.json';
import './App.css';

import { StateSelect } from './cmp/StateSelect';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

const initialStates: string[] = ['New York', 'Alabama'];

function App() {
  const [states, setStates] = React.useState(initialStates);
  const [isRelativeToPop, setIsRelativeToPop] = React.useState(false);
  const [
    useDaysSinceFirstConfirmed,
    setUseDaysSineFirstConfirmed,
  ] = React.useState(true);
  const rows: any[] = data.filter((row) => states.includes(row.provinceState));
  const options = {
    colors: [
      '#0039A6',
      '#FF6319',
      '#6CBE45',
      '#996633',
      '#A7A9AC',
      '#FCCC0A',
      '#808183',
      '#EE352E',
      '#00993C',
      '#B933AD',
    ],
    xaxis: {
      type: 'categories',
      categories: useDaysSinceFirstConfirmed
        ? dateKeys.map((v, i) => i)
        : dateKeys,
      labels: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: function (value: number) {
          if (isRelativeToPop) {
            return `${Math.round(value * 100000) / 10000}%`;
          }
          return Math.round(value);
        },
      },
    },
    stroke: {
      width: [0, 2],
    },
  };

  const series = rows.reduce((acc, row) => {
    const {
      confirmedDeltas,
      lastDayWithNoConfirmed,
      population,
      provinceState,
    } = row;

    let filteredDateKeys = [...dateKeys];
    let firstDayToIncludeIdx = 0;
    if (useDaysSinceFirstConfirmed) {
      firstDayToIncludeIdx = dateKeys.indexOf(lastDayWithNoConfirmed);
      filteredDateKeys = dateKeys.slice(firstDayToIncludeIdx);
    }

    const newData = filteredDateKeys.map((v, i) => [
      i,
      isRelativeToPop
        ? confirmedDeltas[i + firstDayToIncludeIdx] / population
        : confirmedDeltas[i + firstDayToIncludeIdx],
    ]);

    const cumData = filteredDateKeys.map((v, i) => [
      i,
      isRelativeToPop ? row[v] / population : row[v],
    ]);

    return [
      ...acc,
      {
        name: `${provinceState} new cases`,
        type: 'bar',
        data: newData,
      },
      {
        name: `${provinceState} cumulative`,
        curve: 'smooth',
        data: cumData,
      },
    ];
  }, []);

  const onChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    child: React.ReactNode
  ) => {
    setStates(event.target.value as string[]);
  };

  const onCheckboxChange = (
    event: React.ChangeEvent<{ name?: string; checked: boolean }>
  ) => setIsRelativeToPop(event.target.checked as boolean);

  const onDaysSinceCheckboxChange = (
    event: React.ChangeEvent<{ name?: string; checked: boolean }>
  ) => setUseDaysSineFirstConfirmed(event.target.checked as boolean);

  return (
    <div className="App">
      <header className="App-header">
        <h1>COVID-19 Trends by state</h1>
      </header>
      <main>
        <form noValidate autoComplete="off" className="chart-options">
          <FormControl className="chart-options-control">
            <StateSelect value={states} onChange={onChange} />
          </FormControl>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRelativeToPop}
                  onChange={onCheckboxChange}
                />
              }
              label="Scaled to % of state pop"
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useDaysSinceFirstConfirmed}
                  onChange={onDaysSinceCheckboxChange}
                />
              }
              label="Use days since first confirmed"
            />
          </FormGroup>
        </form>
        <Chart height={400} type="line" options={options} series={series} />
      </main>
    </div>
  );
}

export default App;
