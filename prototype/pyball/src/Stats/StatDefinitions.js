import { average, getMin, getMax, sum, round } from './StatFunctions.js';
import { RosterCheckmark } from '../Roster/RosterCheckmark.js';

/**
 * Stats to display for each roster entry.
 * @property 'label' - the label for the stat.
 * @property 'accessor' - the accessor that will be used to select the relevant data from the api.
 * @property 'function' (optional) - if provided, this function will be passed the selected data, and its
 * return value will be used as the value to display in the table.
 */
export const rosterStats = [
  {
    label: 'FPTS/G',
    accessor: 'fantasy_points',
    hovertext: 'fantasy points per game',
    function: (array) => round(average(array),2),
  },
  {
    label: 'GRD',
    hovertext: 'consistency grade',
    accessor: 'consistency_grade',
  },
];

/**
 * Stats to display for each position in the comparison chart.
 */
export const stats_by_position = {
  'QB': ['passing_yards', 'passing_tds', 'rushing_yards', 'interceptions'],
  'RB': ['rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 'receiving_tds'],
  'WR': ['receptions', 'receiving_yards', 'receiving_tds'],
  'TE': ['receptions', 'receiving_yards', 'receiving_tds'],
  'K': ['fg_made', 'fg_missed'],
};

/**
 * The label to display for each stat in the comparison chart.
 */
export const stat_labels = {
  'passing_yards': 'PASSING YD',
  'passing_tds': 'PASSING TD',
  'interceptions': 'INT',
  'rushing_yards': 'RUSHING YD',
  'rushing_tds': 'RUSHING TD',
  'receptions': 'REC',
  'receiving_yards': 'RECEIVING YD',
  'receiving_tds': 'RECEIVING TD',
  'fg_made': 'FG MADE',
  'fg_missed': 'FG_MISSED',
}

/**
 * Stats to display in columns in each table, organized by position.
 * @property 'Header' - the header for the header group or column containing the stat.
 * @property 'columns' - a collection of columns that should appear in this header group.
 * @property 'accessor' - the accessor that will be used to uniquely identify this column (and, if
 * 'data_accessor' is not separately provided, to select the relevant data from the api).
 * @property 'data_accessor' (optional) - if provided, this will be used to select the relevant data from
 * the api (for example, in a case where two columns have the same data but need to have unique accessors).
 * @property 'function' (optional) - if provided, this function will be passed the selected data, and its
 * return value will be used as the value to display in the table.
 * @property 'hide' (optional) - whether or not to hide this column.
 * @property 'sortDescFirst' - whether or not to sort first by descending order (if not specified,
 * the value given in defaultSpreadsheetProps will be used).
 * @property 'formattable' - whether or not the column should be conditionally formattable (if not
 * specified, the value given in defaultSpreadsheetProps will be used).
 * @property 'filter' - the name of the filter function to use for this column (if not specified,
 * the value given in defaultSpreadsheetProps will be used).
 * @property 'sortType' - the name of the sort function to use for this column (if not specified,
 * the value given in defaultSpreadsheetProps will be used).
 */
export const spreadsheetStats = {
  all: [ // stats to display for all positions
    {
      Header: "General",
      columns: [
        {
          Header: 'Player',
          accessor: 'name_and_roster_status',
          data_accessor: 'full_name',
          formattable: false,
          filter: 'any_word_startswith_by_full_name',
          sortType: 'sort_by_full_name',
          sortDescFirst: false, 
          function: (data) => { return (<span>{data}{' '}<RosterCheckmark playername={data}/></span>)}
        },
        { // Helper column to use when sorting and filtering Player column
          Header: 'PlayerHelper',
          accessor: 'full_name',
          formattable: false,
          sortDescFirst: false,
          hide: true
        },
        {
          Header: 'Team',
          hovertext: "testing",
          accessor: 'team',
          formattable: false,
          sortDescFirst: false
        },

      ],
    },
    {
      Header: 'Fantasy',
      columns: [
        {
          Header: 'FPTS',
          hovertext: 'total fantasy points scored in the 2021 season',
          accessor: 'total_fantasy_points',
          data_accessor: 'fantasy_points',
          function: (array) => round(sum(array),2),
        },
        {
          Header: 'FPTS/G',
          hovertext: 'fantasy points per game',
          accessor: 'avg_fantasy_points',
          data_accessor: 'fantasy_points',
          function: (array) => round(average(array),2),
        }
      ],
    },
  ],
  // stats to display for specific positions
  QB: [
    {
      Header: "Passing",
      columns: [
        {
          Header: 'CMP',
          hovertext: 'completions',
          accessor: 'completions',
          function: sum,
        },
        {
          Header: 'ATT',
          accessor: 'attempts',
          hovertext: 'passing attempts',
          function: sum,
        },
        {
          Header: 'CMP%',
          accessor: 'completion_percentage',
          hovertext: 'completion %',
          function: (array) => round(sum(array), 2)+"%", // when possible, change to be more accurate
        },
        {
          Header: 'YDS',
          accessor: 'passing_yards',
          hovertext: 'passing yards',
          function: sum,
        },
        {
          Header: 'TD',
          accessor: 'passing_tds',
          hovertext: 'passing touchdowns',
          function: sum,
        },
        {
          Header: 'INT',
          accessor: 'interceptions',
          hovertext: 'interceptions',
          function: sum,
        },
      ],
    },
    {
      Header: "Rushing",
      columns: [
        {
          Header: 'ATT',
          accessor: 'carries',
          hovertext: 'rushing attempts',
          function: sum,
        },
        {
          Header: 'YDS',
          accessor: 'rushing_yards',
          hovertext: 'rushing yards',
          function: sum,
        },
        {
          Header: 'TDS',
          accessor: 'rushing_tds',
          hovertext: 'rushing touchdowns',
          function: sum,
        },
      ],
    },
    {
      Header: "Fantasy Portal Metrics",
      columns: [
        {
          Header: 'GRD',
          accessor: 'consistency_grade',
          hovertext: 'consistency grade',
          datasource: 'metrics',
          formattable: false,
          sortDescFirst: false
        },
      ],
    },
  ],
  RB: [
    {
      Header: "Rushing",
      columns: [
        {
          Header: 'ATT',
          accessor: 'carries',
          hovertext: 'rushing attempts',
          function: sum,
        },
        {
          Header: 'YDS',
          accessor: 'rushing_yards',
          hovertext: 'rushing yards',
          function: sum,
        },
        {
          Header: 'TDS',
          accessor: 'rushing_tds',
          hovertext: 'rushing touchdowns',
          function: sum,
        },
      ],
    },
    {
      Header: "Receiving",
      columns: [
        {
          Header: 'REC',
          accessor: 'receptions',
          hovertext: 'receptions',
          function: sum,
        },
        {
          Header: 'TGT',
          accessor: 'targets',
          hovertext: 'targets',
          function: sum,
        },
        {
          Header: 'YDS',
          accessor: 'receiving_yards',
          hovertext: 'receiving yards',
          function: sum,
        },
        {
          Header: 'TD',
          accessor: 'receiving_tds',
          hovertext: 'receiving touchdowns',
          function: sum,
        },
      ],
    },
    {
      Header: "Fantasy Portal Metrics",
      columns: [
        {
          Header: 'RSHARE',
          accessor: 'rec_share_%', 
          hovertext: 'receiver share percentage',
          datasource: 'metrics',
          function: (data) => {return String(data).startsWith("nan") ? "N/A" : data}
        },
        {
          Header: 'GRD',
          accessor: 'consistency_grade',
          hovertext: 'consistency grade',
          datasource: 'metrics',
          formattable: false,
          sortDescFirst: false
        },
      ],
    },
  ],
  WR: [
    {
      Header: "Rushing",
      columns: [
        {
          Header: 'ATT',
          accessor: 'carries',
          hovertext: 'rushing attempts',
          function: sum,
        },
        {
          Header: 'YDS',
          accessor: 'rushing_yards',
          hovertext: 'rushing yards',
          function: sum,
        },
        {
          Header: 'TDS',
          accessor: 'rushing_tds',
          hovertext: 'rushing touchdowns',
          function: sum,
        },
      ],
    },
    {
      Header: "Receiving",
      columns: [
        {
          Header: 'REC',
          accessor: 'receptions',
          hovertext: 'receptions',
          function: sum,
        },
        {
          Header: 'TGT',
          accessor: 'targets',
          hovertext: 'targets',
          function: sum,
        },
        {
          Header: 'YDS',
          accessor: 'receiving_yards',
          hovertext: 'receiving yards',
          function: sum,
        },
        {
          Header: 'TD',
          accessor: 'receiving_tds',
          hovertext: 'receiving touchdowns',
          function: sum,
        },
      ],
    },
    {
      Header: "Fantasy Portal Metrics",
      columns: [
        {
          Header: 'RSHARE',
          accessor: 'rec_share_%', 
          hovertext: 'receiver share percentage',
          datasource: 'metrics',
          function: (data) => {return String(data).startsWith("nan") ? "N/A" : data}
        },
        {
          Header: 'GRD',
          accessor: 'consistency_grade',
          hovertext: 'consistency grade',
          datasource: 'metrics',
          formattable: false,
          sortDescFirst: false
        },
      ],
    },
  ],
  TE: [
    {
      Header: "Rushing",
      columns: [
        {
          Header: 'ATT',
          accessor: 'carries',
          hovertext: 'rushing attempts',
          function: sum,
        },
        {
          Header: 'YDS',
          accessor: 'rushing_yards',
          hovertext: 'rushing yards',
          function: sum,
        },
        {
          Header: 'TDS',
          accessor: 'rushing_tds',
          hovertext: 'rushing touchdowns',
          function: sum,
        },
      ],
    },
    {
      Header: "Receiving",
      columns: [
        {
          Header: 'REC',
          accessor: 'receptions',
          hovertext: 'receptions',
          function: sum,
        },
        {
          Header: 'TGT',
          accessor: 'targets',
          hovertext: 'targets',
          function: sum,
        },
        {
          Header: 'YDS',
          accessor: 'receiving_yards',
          hovertext: 'receiving yards',
          function: sum,
        },
        {
          Header: 'TD',
          accessor: 'receiving_tds',
          hovertext: 'receiving touchdowns',
          function: sum,
        },
      ],
    },
    {
      Header: "Fantasy Portal Metrics",
      columns: [
        {
          Header: 'RSHARE',
          accessor: 'rec_share_%', 
          hovertext: 'receiver share percentage',
          datasource: 'metrics',
          function: (data) => {return String(data).startsWith("nan") ? "N/A" : data}
        },
        {
          Header: 'GRD',
          accessor: 'consistency_grade',
          hovertext: 'consistency grade',
          datasource: 'metrics',
          formattable: false,
          sortDescFirst: false
        },
      ],
    },
  ],
};

/**
 * Default values for spreadsheetStats props (to be used if no other values are specified).
 */
export const defaultSpreadsheetStatsProps = {
  filter: 'startswith',
  formattable: true,
  sortDescFirst: true,
}

/**
 * Definition of sort types for use with react-table.
 */
export const sortTypes = {
  sort_by_full_name: (rowA, rowB, columnID, desc) => {
    let rowAName = rowA.values.full_name;
    let rowBName = rowB.values.full_name;
    if (rowAName > rowBName) {
      return 1;
    } else if (rowAName < rowBName) {
      return -1;
    } else {
      return 0;
    }
  },
}

/**
 * Definition of filter types for use with react-table.
 */
export const filterTypes = {
  startswith: (rows, id, filterValue) => {
    return rows.filter(row => {
      const rowValue = row.values[id];
      return rowValue !== undefined
        ? String(rowValue)
          .toLowerCase()
          .startsWith(String(filterValue).toLowerCase())
        : true
    })
  },
  any_word_startswith: (rows, id, filterValue) => {
    return rows.filter(row => {
      const rowValue = row.values[id];
      return rowValue !== undefined
        ? anyWordStartsWithHelper(String(rowValue), String(filterValue))
        : true
    })
  },
  any_word_startswith_by_full_name: (rows, id, filterValue) => {
    return rows.filter(row => {
      const rowValue = row.values.full_name;
      return rowValue !== undefined
      ? anyWordStartsWithHelper(String(rowValue), String(filterValue))
      : true
    })
  },
};

/**
 * Helper function for comparing two strings.
 * Returns true if either the entire first string or at least one word in it
 * begins with the same characters as the second string.
 * Words are defined as being separated by spaces.
 * @param str1 The first string.
 * @param str2 The second string.
 * @returns Whether or not at the first string or at least one word in it
 * starts with the same characters as the second.
 */
 function anyWordStartsWithHelper(str1, str2) {
  let compStr1 = str1.toLowerCase();
  let compStr2 = str2.toLowerCase();
  if (compStr1.startsWith(compStr2)) {
    return true;
  }
  let compStr1Words = compStr1.split(' ');
  for (let i = 1; i < compStr1Words.length; i++) {
    if (compStr1Words[i].startsWith(compStr2)) {
      return true;
    }
  }
  return false;
};