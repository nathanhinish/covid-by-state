import React from 'react';
import ApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import SeriesColors from './SeriesColors';

export const CumulativeChart = () => {
  const {
    includedStates,
    firstConfirmedShift,
    popScaled,
    showPerDay,
    dataset: { data, dateKeys },
  } = useSelector((state) => state) as StoreState;

  const options = {
    theme: {
      mode: 'dark'
    },
    colors: SeriesColors,
    xaxis: {
      type: 'categories',
      categories: firstConfirmedShift ? dateKeys.map((v, i) => i) : dateKeys,
      labels: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: popScaled
          ? (value: number) => `${Math.round(value * 100000) / 1000}%`
          : (value: number) => Math.round(value),
      },
    },
    stroke: {
      width: 2,
    },
  };

  const buildSeries = ({
    provinceState,
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
      name: provinceState,
      curve: 'smooth',
      data,
    };
  };

  const seriesSet = includedStates.map((name: string) => {
    const match = data.find((d) => d.provinceState === name);
    return buildSeries(match as StateData);
  });

  return (
    <ApexChart
      height={showPerDay ? '45%' : '95%'}
      type="line"
      options={options}
      series={seriesSet}
    />
  );
};
