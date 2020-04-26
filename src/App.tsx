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
  const [showCum, setShowCum] = React.useState(true);
  const [showNew, setShowNew] = React.useState(false);
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
            return `${Math.round(value * 100000) / 1000}%`;
          }
          return Math.round(value);
        },
      },
    },
    stroke: {
      width: states.reduce((acc: number[]) => {
        if (showNew) {
          acc.push(0);
        }
        if (showCum) {
          acc.push(2);
        }
        return acc;
      }, []),
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

    const stateSeries = [];
    if (showNew) {
      const newData = filteredDateKeys.map((v, i) => [
        i,
        isRelativeToPop
          ? confirmedDeltas[i + firstDayToIncludeIdx] / population
          : confirmedDeltas[i + firstDayToIncludeIdx],
      ]);

      stateSeries.push({
        name: `${provinceState} new cases`,
        type: 'bar',
        data: newData,
      });
    }

    if (showCum) {
      const cumData = filteredDateKeys.map((v, i) => [
        i,
        isRelativeToPop ? row[v] / population : row[v],
      ]);

      stateSeries.push({
        name: `${provinceState} cumulative`,
        curve: 'smooth',
        data: cumData,
      });
    }

    return [...acc, ...stateSeries];
  }, []);

  const onChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    child: React.ReactNode
  ) => {
    setStates(event.target.value as string[]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>COVID-19 Trends by state</h1>
      </header>
      <main>
        <form noValidate autoComplete="off" className="chart-options">
          <div className="chart-options-row">
            <FormControl className="chart-options-control">
              <StateSelect value={states} onChange={onChange} />
            </FormControl>
          </div>
          <div className="chart-options-row">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRelativeToPop}
                    onChange={(e: any) => setIsRelativeToPop(e.target.checked)}
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
                    onChange={(e: any) =>
                      setUseDaysSineFirstConfirmed(e.target.checked)
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
                    checked={showNew}
                    onChange={(e: any) => setShowNew(e.target.value)}
                  />
                }
                label="Show confirmed per day"
              />
            </FormGroup>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useDaysSinceFirstConfirmed}
                    onChange={(e: any) => setShowCum(e.target.value)}
                  />
                }
                label="Show cumulative confirmed"
              />
            </FormGroup>
          </div>
        </form>
        <Chart height={400} type="line" options={options} series={series} />
      </main>
    </div>
  );
}

export default App;
