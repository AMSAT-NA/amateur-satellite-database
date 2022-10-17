import { json } from 'd3-fetch';

import Table from './components/Table.svelte';

const url =
  'https://raw.githubusercontent.com/palewire/ham-satellite-database/main/data/all-frequencies.json';

json(url).then(function (data) {
  console.log(data);
  new Table({
    target: document.getElementById('table-container'),
    props: {
      data: data.sort(function (a, b) {
        if (a.satellite < b.satellite) {
          return -1;
        }
        if (a.satellite > b.satellite) {
          return 1;
        }
        return 0;
      }),
    },
  });
});
