import Navigation from '../Navigation/Navigation';
import React from 'react';
import { ManipulatableTable } from './ManipulatableTable.js';

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
}

/**
 * Hook to define and display the manipulatable spreadsheet page.
 * @author Claire Wagner
 * @returns A div containing all page elements.
 */
function ManipulateSpreadsheet() {

  // define data organization into columns and column properties
  const columns = React.useMemo(
    () => [
      {Header: 'Player', accessor: 'player', filter: 'any_word_startswith'},
      {Header: 'Pass Yds', accessor: 'pass_yds', filter: 'startswith'},
      {Header: 'Att', accessor: 'att', filter: 'startswith'},
      {Header: 'Cmp', accessor: 'cmp', filter: 'startswith'},
      {Header: 'TD', accessor: 'td', filter: 'startswith'},
      {Header: 'INT', accessor: 'int', filter: 'startswith'},
      {Header: 'Lng', accessor: 'lng', filter: 'startswith'},
      {Header: 'Sck', accessor: 'sck', filter: 'startswith'},
    ],
    []
  );

  // define filter types
  const filterTypes = React.useMemo(
    () => ({
      startswith: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
            return rowValue !== undefined
              ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
              : true
        })
      },
      any_word_startswith: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
            return rowValue !== undefined
              ? anyWordStartsWithHelper(String(rowValue), String(filterValue))
              : true
        })
      }
    }),
    []
  );

  // specify whether or not each column should be conditionally formattable
  const formattable = {name: false, pass_yds: true, att: true, cmp: true, td: true, int: true, lng: true, sck: true}; 

  // hard-coded data for prototype (will be provided by backend in final product)
  // data source: https://www.nfl.com/stats/player-stats/
  const data = React.useMemo(
    () => [
      {player: 'Tom Brady', pass_yds: 5316, att: 719, cmp: 485, td: 43, int: 12, lng: 62, sck: 22},
      {player: 'Justin Herbert', pass_yds: 5014, att: 672, cmp: 443, td: 38, int: 15, lng: 72, sck: 31},
      {player: 'Matthew Stafford', pass_yds: 4886, att: 601, cmp: 404, td: 41, int: 17, lng: 79, sck: 30},
      {player: 'Patrick Mahomes', pass_yds: 4839, att: 658, cmp: 436, td: 37, int: 13, lng: 75, sck: 28},
      {player: 'Derek Carr', pass_yds: 4804, att: 626, cmp: 428, td: 23, int: 14, lng: 61, sck: 40},
      {player: 'Joe Burrow', pass_yds: 4611, att: 520, cmp: 366, td: 34, int: 14, lng: 82, sck: 51},
      {player: 'Dak Prescott', pass_yds: 4449, att: 596, cmp: 410, td: 37, int: 10, lng: 51, sck: 30},
      {player: 'Josh Allen', pass_yds: 4407, att: 646, cmp: 409, td: 36, int: 15, lng: 61, sck: 26},
      {player: 'Kirk Cousins', pass_yds: 4221, att: 561, cmp: 372, td: 33, int: 7, lng: 64, sck: 28},
      {player: 'Aaron Rodgers', pass_yds: 4115, att: 531, cmp: 366, td: 37, int: 4, lng: 75, sck: 30},
      {player: 'Matt Ryan', pass_yds: 3968, att: 560, cmp: 375, td: 20, int: 12, lng: 64, sck: 40},
      {player: 'Jimmy Garoppolo', pass_yds: 3810, att: 441, cmp: 301, td: 20, int: 12, lng: 83, sck: 29},
      {player: 'Mac Jones', pass_yds: 3801, att: 521, cmp: 352, td: 22, int: 13, lng: 75, sck: 28},
      {player: 'Kyler Murray', pass_yds: 3787, att: 481, cmp: 333, td: 24, int: 10, lng: 77, sck: 31},
      {player: 'Ben Roethlisberger', pass_yds: 3740, att: 605, cmp: 390, td: 22, int: 10, lng: 59, sck: 38},
      {player: 'Ryan Tannehill', pass_yds: 3734, att: 531, cmp: 357, td: 21, int: 14, lng: 57, sck: 47},
      {player: 'Trevor Lawrence', pass_yds: 3641, att: 602, cmp: 359, td: 12, int: 17, lng: 58, sck: 32},
      {player: 'Carson Wentz', pass_yds: 3563, att: 516, cmp: 322, td: 27, int: 7, lng: 76, sck: 32},
      {player: 'Taylor Heinicke', pass_yds: 3419, att: 494, cmp: 321, td: 20, int: 15, lng: 73, sck: 38},
      {player: 'Jared Goff', pass_yds: 3245, att: 494, cmp: 332, td: 19, int: 8, lng: 63, sck: 35},
      {player: 'Jalen Hurts', pass_yds: 3144, att: 432, cmp: 265, td: 16, int: 9, lng: 91, sck: 26},
      {player: 'Russell Wilson', pass_yds: 3113, att: 400, cmp: 259, td: 25, int: 6, lng: 69, sck: 33},
      {player: 'Teddy Bridgewater', pass_yds: 3052, att: 426, cmp: 285, td: 18, int: 7, lng: 64, sck: 31},
      {player: 'Baker Mayfield', pass_yds: 3010, att: 418, cmp: 253, td: 17, int: 13, lng: 71, sck: 43},
      {player: 'Lamar Jackson', pass_yds: 2882, att: 382, cmp: 246, td: 16, int: 13, lng: 49, sck: 38}
    ],
    []
  );

  return (
    <div>
      <Navigation />
      <div>
        <header>
          <p>
            Click a column header to sort by that column 
            (hold down the shift key to sort by multiple columns at a time). 
          </p>
        </header>
      </div>
      <ManipulatableTable columns={columns} data={data} filterTypes={filterTypes} formattable={formattable} />
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  