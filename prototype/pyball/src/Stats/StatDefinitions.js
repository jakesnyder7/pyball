import { average, sum, round, getDataByAccessor, getSumByAccessor, getAvgByAccessor, formatPlayerName } from './StatFunctions.js';
import { RosterCheckmark } from '../Roster/RosterCheckmark.js';

/**
 * Stats to display for each roster entry.
 * @property 'label' - the label for the stat.
 * @property 'accessor' - the accessor that will be used to select the relevant data from the api.
 * @property 'hovertext' (optional) - the text that should appear when the user hovers over the stat name.
 * @property 'datasource' (optional) - the name of the data source to use (if different than the default).
 * @property 'function' (optional) - if provided, this function will be passed the selected data, and its
 * return value will be used to produce the stat.
 */
export const rosterStats = [
  {
    label: 'FPTS/G',
    accessor: 'fantasy_points_per_game',
    hovertext: 'fantasy points per game',
    function: (data, accessor) => {
      let fpts = getDataByAccessor(data, 'fantasy_points_ppr');
      return fpts === "N/A"
        ? "N/A"
        : round(average(fpts),2);
    },
  },
  {
    label: 'RNK',
    accessor: 'ecr',
    hovertext: 'position rank',
    function: getDataByAccessor,
  },
  {
    label: 'GRD',
    accessor: 'consistency_grade',
    hovertext: 'consistency grade',
    datasource: 'metrics',
    function: getDataByAccessor,
  }
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
 * Master definition of stats to display in columns in each spreadsheet, organized by groups of positions.
 * If any properties are left unspecified, the value given in defaultSpreadsheetProps or should be used
 * instead. See "spreadsheetStats" for the mapping of these stats to individual positions.
 * @property 'Header' - the header for the header group or column containing the stat.
 * @property 'columns' - a collection of columns that should appear in this header group.
 * @property 'accessor' - the accessor that will be used to uniquely identify this column and
 * will be passed to the provided function.
 * @property 'hovertext' (optional) - the text that should appear when the user hovers over the stat name.
 * @property 'datasource' (optional) - the name of the data source to use (if different than the default). 
 * @property 'function' - this function will be passed the selected data and the column's accessor,
 * and its return value will be used to produce the stat.
 * @property 'hide' (optional) - whether or not to hide this column.
 * @property 'sortDescFirst' - whether or not to sort first by descending order.
 * @property 'conditionallyFormattable' - whether or not the column should be conditionally formattable.
 * @property 'filter' - the name of the filter function to use for this column.
 * @property 'sortType' - the name of the sort function to use for this column.
 * @property 'conditionalFormatValidate' - the function that will be used to validate min and max bounds
 * for conditional formatting.
 * @property 'conditionalFormatCompare' - the function that will be used to compare values for
 * conditional formatting.
 */
const spreadsheetStatsMaster = {
  all: [ // stats to display for all positions
    {
      Header: "General",
      columns: [
        {
          Header: 'Player',
          accessor: 'name_and_roster_status',
          conditionallyFormattable: false,
          filter: 'any_word_startswith_by_full_name',
          sortType: 'sort_by_full_name',
          sortDescFirst: false, 
          function: (data, accessor) => { 
            const name = formatPlayerName(getDataByAccessor(data, 'full_name'));
            return (<span>{name}{' '}<RosterCheckmark playername={name}/></span>)
          }
        },
        { // Helper column to use when sorting and filtering Player column
          Header: 'PlayerHelper',
          accessor: 'full_name',
          conditionallyFormattable: false,
          sortDescFirst: false,
          hide: true,
          function: (data, accessor) => formatPlayerName(getDataByAccessor(data, 'full_name')),
        },
        {
          Header: 'Team',
          accessor: 'team',
          conditionallyFormattable: false,
          sortDescFirst: false,
        },

      ],
    },
    {
      Header: 'Fantasy',
      columns: [
        {
          Header: 'FPTS',
          accessor: 'fantasy_points_total',
          hovertext: 'total fantasy points scored in the 2021 season',
          function: (data, accessor) => {
            let total = getSumByAccessor(data, 'fantasy_points_ppr');
            return !isNaN(total)
              ? round(total, 2)
              : "N/A"
          }
        },
        {
          Header: 'FPTS/G',
          accessor: 'fantasy_points_per_game',
          hovertext: 'fantasy points per game',
          function: (data, accessor) => {
            let avg = getAvgByAccessor(data, 'fantasy_points_ppr');
            return avg === "N/A"
              ? "N/A"
              : round(avg,2);
          }
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
          accessor: 'completions',
          hovertext: 'completions',
          function: getSumByAccessor,
        },
        {
          Header: 'ATT',
          accessor: 'attempts',
          hovertext: 'passing attempts',
          function: getSumByAccessor,
        },
        {
          Header: 'CMP%',
          accessor: 'completion_percentage',
          hovertext: 'completion %',
          function: (data, accessor) => {
            let completions = getDataByAccessor(data, 'completions');
            let attempts = getDataByAccessor(data, 'attempts');
            if (attempts === "N/A") {
              return "N/A";
            }
            let totalCompletions = sum(completions);
            let totalAttempts = sum(attempts);
            return isNaN(totalCompletions) || isNaN(totalAttempts)
              ? "N/A"  
              : totalAttempts === 0
                ? "0%"
                : round(100 * (totalCompletions / totalAttempts)) + "%"
          },
        },
        {
          Header: 'YDS',
          accessor: 'passing_yards',
          hovertext: 'passing yards',
          function: getSumByAccessor,
        },
        {
          Header: 'TD',
          accessor: 'passing_tds',
          hovertext: 'passing touchdowns',
          function: getSumByAccessor,
        },
        {
          Header: 'INT',
          accessor: 'interceptions',
          hovertext: 'interceptions',
          function: getSumByAccessor,
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
          function: getSumByAccessor,
        },
        {
          Header: 'YDS',
          accessor: 'rushing_yards',
          hovertext: 'rushing yards',
          function: getSumByAccessor,
        },
        {
          Header: 'TD',
          accessor: 'rushing_tds',
          hovertext: 'rushing touchdowns',
          function: getSumByAccessor,
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
          sortDescFirst: true,
          sortType: 'grade_sort',
          conditionallyFormattable: true,
          conditionalFormatValidate: (x) => {
            let str = String(x).toUpperCase();
            return str.length > 0 && str[0] <= 'F' && str[0] >= 'A';
          },
          conditionalFormatCompare: (a, b) => {
            return gradeSort(String(a).toUpperCase(),String(b).toUpperCase());
          },
        },
      ],
    },
  ],
  RB_WR_TE: [
    {
      Header: "Rushing",
      columns: [
        {
          Header: 'ATT',
          accessor: 'carries',
          hovertext: 'rushing attempts',
          function: getSumByAccessor,
        },
        {
          Header: 'YDS',
          accessor: 'rushing_yards',
          hovertext: 'rushing yards',
          function: getSumByAccessor,
        },
        {
          Header: 'TD',
          accessor: 'rushing_tds',
          hovertext: 'rushing touchdowns',
          function: getSumByAccessor,
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
          function: getSumByAccessor,
        },
        {
          Header: 'TGT',
          accessor: 'targets',
          hovertext: 'targets',
          function: getSumByAccessor,
        },
        {
          Header: 'YDS',
          accessor: 'receiving_yards',
          hovertext: 'receiving yards',
          function: getSumByAccessor,
        },
        {
          Header: 'TD',
          accessor: 'receiving_tds',
          hovertext: 'receiving touchdowns',
          function: getSumByAccessor,
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
          function: (data, accessor) => {
            let rshare = getDataByAccessor(data, accessor);
            return String(rshare).startsWith("nan")
              ? "N/A"
              : rshare;
          },
        },
        {
          Header: 'GRD',
          accessor: 'consistency_grade',
          hovertext: 'consistency grade',
          datasource: 'metrics',
          sortDescFirst: true,
          sortType: 'grade_sort',
          conditionallyFormattable: true,
          conditionalFormatValidate: (x) => {
            let str = String(x).toUpperCase();
            return str.length > 0 && str[0] <= 'F' && str[0] >= 'A';
          },
          conditionalFormatCompare: (a, b) => {
            return gradeSort(String(a).toUpperCase(),String(b).toUpperCase());
          },
        },
      ],
    },
  ],
};

/**
 * Mapping of stats to display in each spreadsheet to individual positions.
 */
export const spreadsheetStats = {
  all: spreadsheetStatsMaster.all,
  QB: spreadsheetStatsMaster.QB,
  RB: spreadsheetStatsMaster.RB_WR_TE,
  WR: spreadsheetStatsMaster.RB_WR_TE,
  TE: spreadsheetStatsMaster.RB_WR_TE,
}

/**
 * Default values for spreadsheetStats props (to be used if no other values are specified).
 */
export const defaultSpreadsheetStatsProps = {
  filter: 'startswith',
  conditionallyFormattable: true,
  sortDescFirst: true,
  function: getDataByAccessor,
  conditionalFormatValidate: (val) => !isNaN(parseFloat(val)),
  conditionalFormatCompare: (a,b) => (parseFloat(a) - parseFloat(b)),
}

/**
 * Definition of sort types for use with react-table.
 */
export const sortTypes = {
  // sort rows by the full_name column
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
  // sort by letter grade (A+ > A > A- > B+ > ...)
  grade_sort: (rowA, rowB, columnID, desc) => {
    return gradeSort(String(rowA.values[columnID]), String(rowB.values[columnID]));
  },
};

function gradeSort(grade1, grade2) {
  function grade_suffix_sort(suff1, suff2) {
    if ((suff1 === '+') || (suff2 === '-')) {
      return 1;
    } else if ((suff2 === '+') || (suff1 === '-')) {
      return -1;
    } else {
      return 0;
    }
  };
  if (grade1[0] > grade2[0]) {
    return -1;
  } else if (grade1[0] < grade2[0]) {
    return 1;
  } else if (grade1 === grade2) {
    return 0;
  } else {
    return grade_suffix_sort(grade1[1], grade2[1]);
  }
};

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
  let compStr1 = str1.toLowerCase().replaceAll('.','');
  let compStr2 = str2.toLowerCase().replaceAll('.','');
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