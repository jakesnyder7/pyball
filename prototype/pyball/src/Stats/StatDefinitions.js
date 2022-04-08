import { averageRoundTo2, getMin, getMax } from './StatFunctions.js';

/**
 * Stats to display for each roster entry.
 * 'label' is the label for the stat; 'accessor' is the accessor to use to select the relevant
 * information from the data returned from the api; 'function' (optional) is the function to use
 * on the data in the column before displaying it.
 */
export const rosterStats = [
  { label: 'Consistency Grade', accessor: 'consistency_grade'},
  { label: 'Fantasy Pts Avg', accessor: 'fantasy_points', function: averageRoundTo2 },
  { label: 'Fantasy Pts Min', accessor: 'fantasy_points', function: getMin },
  { label: 'Fantasy Pts Max', accessor: 'fantasy_points', function: getMax },
];

/**
 * Stats to display in each table, organized by position ('all' means display for all positions).
 * 'Header' is the header for the column containing the stat; 'accessor' is the accessor to use
 * to select the relevant information from the data returned from the api; 'function' (optional)
 * is the function to use on the data in the column before displaying it.
 * Optional properties: 'sortDescFirst' (boolean, true by default in PositionTable) to sort first by
 * descending order; 'formattable' (boolean, true by default in PositionTable) to indicate whether or
 * not the column should be conditionally formattable.
 */
export const spreadsheetStats = {
  all: [ // stats to display for all positions
    {Header: 'Player', accessor: 'name_and_roster_status', filter: 'any_word_startswith_by_full_name', formattable: false, sortType: 'sort_by_full_name', sortDescFirst: false},
    // Helper column to use when sorting and filtering Player column
    {Header: 'PlayerHelper', accessor: 'full_name', formattable: false, sortDescFirst: false},
    {Header: 'Team', accessor: 'team', formattable: false, sortDescFirst: false},
    {Header: 'Consistency Grade', accessor: 'consistency_grade', formattable: false, sortDescFirst: false},
  ],
  // stats to display for specific positions
  QB: [
    {Header: 'Pass Yd Avg', accessor: 'passing_yards', function: averageRoundTo2},
    {Header: 'Pass TD Avg', accessor: 'passing_tds', function: averageRoundTo2},
    {Header: 'Rush Yd Avg', accessor: 'rushing_yards', function: averageRoundTo2},
    {Header: 'INT Avg', accessor: 'interceptions', function: averageRoundTo2},
  ],
  RB: [
    {Header: 'Rush Yd Avg', accessor: 'rushing_yards', function: averageRoundTo2},
    {Header: 'Rush TD Avg', accessor: 'rushing_tds', function: averageRoundTo2},
    {Header: 'Rec Avg', accessor: 'receptions', function: averageRoundTo2},
    {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: averageRoundTo2},
    {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: averageRoundTo2},
    {Header: 'Rec Share %', accessor: 'rec_share_%', function: (data) => {return String(data).startsWith("nan") ? "N/A" : data}},
  ],
  WR: [
    {Header: 'Rec Avg', accessor: 'receptions', function: averageRoundTo2},
    {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: averageRoundTo2},
    {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: averageRoundTo2},
    {Header: 'Rec Share %', accessor: 'rec_share_%', function: (data) => {return String(data).startsWith("nan") ? "N/A" : data}},
  ],
  TE: [
    {Header: 'Rec Avg', accessor: 'receptions', function: averageRoundTo2},
    {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: averageRoundTo2},
    {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: averageRoundTo2},
    {Header: 'Rec Share %', accessor: 'rec_share_%', function: (data) => {return String(data).startsWith("nan") ? "N/A" : data}},
  ],
}