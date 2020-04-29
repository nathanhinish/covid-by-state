import SeriesColors from './SeriesColors';

function convertDateString(s: string): number {
  const p = s.split('/');
  const d = new Date();
  d.setMonth(parseInt(p[0], 10) - 1);
  d.setDate(parseInt(p[1], 10));
  return d.getTime();
}

export function getSharedOptions({
  dataset: { dateKeys },
  firstConfirmedShift,
  popScaled,
}: StoreState) {
  return {
    theme: {
      mode: 'dark',
    },
    colors: SeriesColors,
    xaxis: {
      type: firstConfirmedShift ? 'categories' : 'datetime',
      categories: firstConfirmedShift ? dateKeys.map((v, i) => i) : dateKeys.map(convertDateString),
      title: {
        text: firstConfirmedShift
          ? '# Days since first confirmed case'
          : 'Date',
      },

      labels: {
        hideOverlappingLabels: true,
        rotate: 0,
      },
    },
    yaxis: {
      min: 0,
      title: {
        text: popScaled ? '% of population' : '# of cases'
      },
      labels: {
        formatter: popScaled
          ? (value: number) => `${Math.round(value * 100000) / 1000}%`
          : (value: number) => Math.round(value),
      },
    },
    legend: {
      showForSingleSeries: true,
      onItemClick: {
        toggleDataSeries: false,
      },
    },
  };
}
