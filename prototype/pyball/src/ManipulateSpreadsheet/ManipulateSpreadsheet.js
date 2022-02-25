import Navigation from '../Navigation/Navigation';
import React from 'react';
import { ManipulatableTable } from './ManipulatableTable.js';

/**
 * Hook to define and display the manipulatable spreadsheet page.
 * @author Claire Wagner
 * @returns A div containing all page elements.
 */
function ManipulateSpreadsheet() {

  // hard-coded data for prototype (will be provided by backend in final product)
  const columns = React.useMemo(
    () => [
        {Header: 'Name', accessor: 'name'},
        {Header: 'TD', accessor: 'td'},
        {Header: 'INT', accessor: 'int'},
    ],
    []
  );

  // specify whether or not each column should be conditionally formattable
  const formattable = {name: false, td: true, int: true}; 

  // hard-coded data for prototype (will be provided by backend in final product)
  const data = React.useMemo(
    () => [
        {name: 'Tom Brady', td: 43, int: 12},
        {name: 'Justin Herbert', td: 38, int: 15},
        {name: 'Matthew Stafford', td: 41, int: 17},
        {name: 'Patrick Mahomes', td: 37, int: 13},
        {name: 'Josh Allen', td: 36, int: 15},
        {name: 'Kirk Cousins', td: 33, int: 7},
        {name: 'Aaron Rodgers', td: 37, int: 4},
        {name: 'Jimmy Garoppolo', td: 20, int: 12},
        {name: 'Mac Jones', td: 22, int: 13},
        {name: 'Ben Roethlisberger', td: 22, int: 10},
        {name: 'Carson Wentz', td: 27, int: 7},
        {name: 'Jared Goff', td: 19, int: 8},
        {name: 'Jalen Hurts', td: 16, int: 9},
        {name: 'Russell Wilson', td: 25, int: 6},
        {name: 'Teddy Bridgewater', td: 18, int: 7},
        {name: 'Lamar Jackson', td: 16, int: 13}
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
      <ManipulatableTable columns={columns} data={data} formattable={formattable} />
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  