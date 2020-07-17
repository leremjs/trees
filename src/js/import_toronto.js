#!/usr/local/bin/node
'use strict'

const Fs = require('fs');
const CsvParse = require('csv-parse/lib/sync')

const srcDataDir='../../data/src/toronto/';

console.log('reading data');
let csvData = Fs.readFileSync(srcDataDir + 'TMMS_Open_Data_WGS84.csv');

console.log('parsing data');
let data = CsvParse(csvData, {
  columns: true,
  skip_empty_lines: true
});

console.log('processing data');
let sites = [];
let skipped = {};
for (let o of data) {

  let species = o['BOTANICAL_'];
  let latitude = o['Y'];
  let longitude = o['X'];

  species = species.replace('"', "'");

  if (latitude <= 0) { continue; }

  // remove uninteresting sites
  if (species == 'Unknown') {
    if (!skipped[species]) {
      console.log('skipping: ' + species);
      skipped[species] = true;
    }
    continue;
  }

  sites.push({
    latitude: Number(latitude),
    longitude: Number(longitude),
    name_botanical: species,
    name_common: o['COMMON_NAM']
  });
}

console.log('writing data');
Fs.writeFileSync(srcDataDir + 'data.json', JSON.stringify(sites, null, 2));




