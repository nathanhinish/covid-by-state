import React from 'react';
import ApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { getSharedOptions } from './chartFns';

export const CumulativeChart = () => {
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
      text: 'Cumulative confirmed cases',
    },
    stroke: {
      width: 2,
    }
  };

  const buildSeries = ({
    location,
    population,
    lastDayWithNoConfirmed,
    confirmedDeltas,
    ...row
  }: StateData) => {
    const dataPerDate = row as any;

    let data: any[] = dateKeys.map((k) => dataPerDate[k]);

    if (popScaled) {
      data = data.map((n) => n / population);
    }

    if (firstConfirmedShift) {
      const firstIndex = dateKeys.indexOf(lastDayWithNoConfirmed);
      if (firstIndex >= 0) {
        data = data.slice(firstIndex);
      }
    }

    return {
      name: location,
      curve: 'smooth',
      data,
    };
  };

  const seriesSet = includedStates.map((name: string) => {
    const match = data.find((d) => d.location === name);
    return buildSeries(match as StateData);
  });

  return (
    <ApexChart
      height={500}
      type="line"
      options={options}
      series={seriesSet}
    />
  );
};
