import React from 'react';
import ApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { getSharedOptions } from './chartFns';

export const PerDayChart = () => {
  const state = useSelector((state) => state) as StoreState;
  const {
    includedStates,
    firstConfirmedShift,
    popScaled,
    dataset: { data, dateKeys },
  } = state;

  const options = {
    ...getSharedOptions(state),
    title: {
      text: 'Confirmed cases per day',
    },
    stroke: {
      width: 2,
    }
  };

  const buildSeries = ({
    provinceState,
    population,
    lastDayWithNoConfirmed,
    confirmedDeltas,
    ...row
  }: StateData) => {
    let data: any[] = confirmedDeltas;

    if (popScaled) {
      data = data.map((n) => n / population);
    }

    if (firstConfirmedShift) {
      const firstIndex = dateKeys.indexOf(lastDayWithNoConfirmed);
      if (firstIndex >= 0) {
        data = data.slice(firstIndex);
      }
    }

    return [
      {
        name: provinceState,
        type: 'bar',
        data,
      },
    ];
  };

  const seriesSet = includedStates.reduce((acc: any[], name: string) => {
    const match = data.find((d) => d.provinceState === name);
    const newSeries = buildSeries(match as StateData);
    return [...acc, ...newSeries];
  }, []);

  return (
    <ApexChart
      height={500}
      options={options}
      series={seriesSet}
    />
  );
};
