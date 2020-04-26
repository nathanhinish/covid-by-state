const path = require('path');
const { exec } = require('child_process');
const fs = require('fs-extra');
const csv = require('csvtojson');
const { sortBy } = require('lodash');
const { isBefore } = require('compare-dates');

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
    const stateData = cumStateData[ps] || {};
    stateData['Province_State'] = ps;

    dateKeys.forEach((key) => {
      const existing = stateData[key] || 0;
      stateData[key] = parseInt(row[key], 10) + existing;
    });

    cumStateData[ps] = stateData;
  });

  return Object.keys(cumStateData)
    .sort()
    .map((key) => cumStateData[key]);
}

async function generateCustomRows(rows) {
  const data = sortBy(rows, 'Province_State').reduce((acc, row) => {
    const ps = row['Province_State'];
    const confirmedByDate = [];
    const cumulativeByDate = [];
    let lastZeroDate = dateKeys[0];
    let firstConfirmedDate = null;
    let totalConfirmed = 0;
    dateKeys.forEach((key) => {
      const confirmedOnDate = parseInt(row[key], 10);
      confirmedByDate.push(confirmedOnDate);
      totalConfirmed = totalConfirmed + confirmedOnDate;
      cumulativeByDate.push(totalConfirmed);
    });

    acc[ps] = {
      provinceState: ps,
      lastZeroDate,
      firstConfirmedDate,
      totalConfirmed,
      confirmedByDate,
      cumulativeByDate,
    };
    return acc;
  }, {});

  await fs.writeJSON(path.resolve(DATA_DIR, 'confirmed.json'), data, {
    spaces: 2,
  });
}

async function processConfirmed() {
  const filepath = path.resolve(REPO_LOCAL_DIR, CONFIRMED_CASES_FILE);
  const rows = await csv().fromFile(filepath);
  await fs.writeJSON(path.resolve(DATA_DIR, 'confirmed_raw.json'), rows, {
    spaces: 2,
  });

  dateKeys = Object.keys(rows[0])
    .filter((key) => /(\d{1,2})\/\d{1,2}\/\d{2}/.test(key))
    .sort((a, b) => {
      const aD = new Date(Date.parse(a));
      const bD = new Date(Date.parse(b));
      return isBefore(aD, bD) ? -1 : 1;
    });

  const byState = await joinDataByState(rows);
  await fs.writeJSON(
    path.resolve(DATA_DIR, 'confirmed_by_state.json'),
    byState,
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

  // const files = await getDataFiles();
  await processConfirmed();
}

main().catch((err) => console.error(err));
