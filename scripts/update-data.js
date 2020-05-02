const path = require('path');
const { exec } = require('child_process');
const fs = require('fs-extra');
const csv = require('csvtojson');
const { sortBy, sumBy } = require('lodash');
const { isBefore } = require('compare-dates');

const populations = require('../data/populations.json');

const DATA_DIR = path.resolve(__dirname, '../data');
const COVID_GIT_REPO = 'https://github.com/CSSEGISandData/COVID-19.git';
const REPO_LOCAL_DIR = path.resolve(DATA_DIR, 'covid_data');
const CONFIRMED_CASES_FILE =
  'csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv';

const IGNORE_PS_VALUES = ['Diamond Princess', 'Grand Princess'];

const DATE_KEY_TEST = /(\d{1,2})\/\d{1,2}\/\d{2}/;
let dateKeys;

async function checkRepoDirExists() {
  return new Promise((resolve) => {
    fs.access(REPO_LOCAL_DIR, (err) => resolve(!err));
  });
}

async function cloneRepo() {
  await fs.mkdirp(path.dirname(REPO_LOCAL_DIR));
  return new Promise((resolve, reject) => {
    exec(
      `git clone ${COVID_GIT_REPO} ${REPO_LOCAL_DIR}`,
      (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        console.info(stderr);
        resolve();
      }
    );
  });
}

async function updateRepo() {
  return new Promise((resolve, reject) => {
    exec(
      `git pull`,
      {
        cwd: REPO_LOCAL_DIR,
      },
      (err, stdout) => {
        if (err) {
          return reject(err);
        }
        console.info(stdout);
        resolve();
      }
    );
  });
}

async function joinDataByState(rows) {
  const cumStateData = {};

  rows.forEach((row) => {
    const ps = row['Province_State'];
    if (IGNORE_PS_VALUES.includes(ps)) {
      return;
    }
    const stateData = cumStateData[ps] || {
      location: ps,
      population: populations[ps],
      lastDayWithNoConfirmed: '1/21/20',
      confirmedDeltas: [],
    };

    dateKeys.forEach((key) => {
      const existing = stateData[key] || 0;
      const newConfirmed = parseInt(row[key], 10);
      stateData[key] = newConfirmed + existing;
    });
    cumStateData[ps] = stateData;
  });

  const newRows = Object.keys(cumStateData)
    .sort()
    .map((key) => cumStateData[key]);

  newRows.forEach((row) => {
    dateKeys.forEach((key, i) => {
      const confirmed = row[key];
      if (confirmed === 0) {
        row.lastDayWithNoConfirmed = key;
      }
      if (i === 0) {
        row.confirmedDeltas.push(confirmed);
      } else {
        const lastConfirmed = row[dateKeys[i - 1]];
        if (lastConfirmed > confirmed) {
          // console.info(row.Admin2, row.location, dateKeys[i])
          // throw new Error('this should not happen')
        }
        row.confirmedDeltas.push(confirmed - lastConfirmed);
      }
    });
  });
  return {
    dateKeys,
    data: newRows,
  };
}

async function withNationalRow(byState) {
  const rows = byState.data;
  const national = {
    location: 'United States',
    lastDayWithNoConfirmed: '1/21/20',
    population: sumBy(rows, 'population'),
  };

  if (rows.length > 0) {
    national.confirmedDeltas = rows.reduce(
      (acc, row) => row.confirmedDeltas.map((v, i) => v + (acc[i] || 0)),
      []
    );
  }

  byState.dateKeys.forEach((key) => {
    national[key] = sumBy(rows, key);
  });

  return {
    ...byState,
    data: [national, ...byState.data],
  };
}

async function processConfirmed() {
  const filepath = path.resolve(REPO_LOCAL_DIR, CONFIRMED_CASES_FILE);
  const rows = await csv().fromFile(filepath);
  await fs.writeJSON(path.resolve(DATA_DIR, 'confirmed_raw.json'), rows, {
    spaces: 2,
  });

  dateKeys = Object.keys(rows[0])
    .filter((key) => DATE_KEY_TEST.test(key))
    .sort((a, b) => {
      const aD = new Date(Date.parse(a));
      const bD = new Date(Date.parse(b));
      return isBefore(aD, bD) ? -1 : 1;
    });

  const byState = await joinDataByState(rows);
  const data = await withNationalRow(byState);
  await fs.writeJSON(
    path.resolve(__dirname, '../src/confirmed_by_state.json'),
    data,
    {
      spaces: 2,
    }
  );
}

async function main() {
  const repoDirExists = await checkRepoDirExists();
  if (repoDirExists) {
    console.info('Updating data repo');
    await updateRepo();
  } else {
    console.info('Cloning data repo');
    await cloneRepo();
  }
  await processConfirmed();
}

main().catch((err) => console.error(err));
