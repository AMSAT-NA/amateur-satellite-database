<script>
  import { getSortByString, getSortByNumber, capFirst } from './utils.js';

  export let data;

  // Table row limit
  const limit = 50;
  let showAll = false;

  const headerList = [
      { text: 'Name', class: 'text-left sortable', attr: 'satellite' },
      { text: 'Number', class: 'text-left sortable', attr: 'number' },
      {
        text: 'Uplink',
        class: 'text-left sortable',
        attr: 'uplink',
      },
      {
        text: 'Downlink',
        class: 'text-left sortable',
        attr: 'downlink',
      },
      {
        text: 'Beacon',
        class: 'text-left sortable',
        attr: 'beacon',
      },
      {
        text: 'Mode',
        class: 'text-left sortable',
        attr: 'mode',
      },
      {
        text: 'Callsign',
        class: 'text-left sortable',
        attr: 'callsign',
      },
      {
        text: 'Status',
        class: 'text-left sortable',
        attr: 'status',
      },
    ];

  let sortAttr = 'satellite';
  let sortAscending = true;
  let radioSelected = 'active';

  $: formatRow = (d) => ({
    text: d.satellite,
    class: 'text-left',
    sort: d.satellite,
    values: [{
        text: d.number,
        class: 'text-left',
      },
      {
        text: d.uplink,
        class: 'text-left',
      },
      {
        text: d.downlink,
        class: 'text-left',
      },
      {
        text: d.beacon,
        class: 'text-left',
      },
      {
        text: d.mode,
        class: 'text-left',
      },
      {
        text: d.callsign,
        class: 'text-left',
      },
      {
        text: capFirst(d.status),
        class: 'text-left',
      }
    ]
  });

  // How to sort each column
  const sortFuncLookup = {
    satellite: getSortByString,
    number: getSortByNumber,
    uplink: getSortByString,
    downlink: getSortByString,
    beacon: getSortByString,
    mode: getSortByString,
    callsign: getSortByString,
    status: getSortByString
  };

  const getTableRows = (arr, attr, order) => {
    // Sort the data
    let sortFunc = sortFuncLookup[attr];
    arr.sort(sortFunc(attr, order));
    // Return the array formatted for our template
    return arr.map(formatRow);
  };

  $: filteredData = (radioSelected === "active" ? data.filter((d) => d.status === "active") : data);
  $: enoughRows = filteredData.length > limit;
  $: tableRowList = getTableRows(filteredData, sortAttr, sortAscending);

  // Filter table
  function filterRows(e) {
    showAll = false;
    const value = e.target.value.toUpperCase();
    if (value == '') {
      filteredData = data;
    } else {
      filteredData = data.filter(
        (d) => JSON.stringify(d).toUpperCase().indexOf(value) > -1
      );
    }
  }

  // Flip the toggle on each click
  function onToggle() {
    showAll = !showAll;
  }

  // Sort the table
  function onSort(e) {
    const thisAttr = e.target.getAttribute('data-attr');
    if (thisAttr === sortAttr) {
      sortAscending = !sortAscending;
    } else {
      sortAttr = thisAttr;
      sortAscending = true;
    }
  }
</script>

<div class="table--inputs button-grid">
<div class="button-grid-group">
  <label for="satellite-table-search">Search</label>
  <input
    class="search"
    style="display: block;"
    id="satellite-table-search"
    on:keyup={filterRows}
  />
 </div>
 <div class="button-grid-group">
    <b>Status</b>
    <div class="radio-group">
    <div class="radio-group-item">
        <input
          type="radio"
          class="radio"
          id="active"
          bind:group={radioSelected}
          value="active" />
        <label for="active">Active</label>
    </div>
    <div class="radio-group-item">
        <input
          type="radio"
          class="radio"
          id="all"
          bind:group={radioSelected}
          value="all" />
        <label for="all">All</label>
     </div>
   </div>
 </div>
</div>

<table class="table">
  <thead>
    <tr>
      {#each headerList as obj}
        <th
          scope="col"
          data-attr={obj.attr}
          class={obj.class}
          class:sort-asc={obj.attr && sortAttr === obj.attr && sortAscending}
          class:sort-desc={obj.attr && sortAttr === obj.attr && !sortAscending}
          on:click={onSort}
        >
          {obj.text}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each tableRowList as obj, idx}
      <tr class:display-none={enoughRows && idx + 1 > limit && !showAll}>
        <th scope="col" class={obj.class}>
          {@html obj.text}
        </th>
        {#each obj.values as column}
          <td class={column.class}>
            {@html column.text || ''}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
{#if enoughRows}
<div class="btn-center">
  <button class="btn" on:click={onToggle}>
    {showAll ? 'Show less' : 'Show all'}
  </button>
</div>
{/if}
