import Navigation from '../Navigation/Navigation';
import React from 'react';
import { spreadsheetStats } from '../Stats/StatDefinitions.js';
import { MemoizedPositionTable } from './PositionTable.js';
import { Tabs } from './Tabs.js';
import { fetchData } from '../api/Fetch.js';
import './ManipulateSpreadsheet.css';

/**
 * Hook to define and display the manipulatable spreadsheet page.
 * @author Claire Wagner
 * @returns A div containing all page elements.
 */
function ManipulateSpreadsheet() {

  // State to keep track of the data for each table
  const [data1, setData1] = React.useState(null);
  const [data2, setData2] = React.useState(null);
  const [data3, setData3] = React.useState(null);
  const [data4, setData4] = React.useState(null);

  // State to keep track of metrics
  const [metrics, setMetrics] = React.useState(null);
  
  // State to keep track of errors
  const [error, setError] = React.useState('');

  // The positions and associated data for the tables
  const tables = React.useMemo (
    () => ([
      { position: 'QB', data: data1, setData: setData1 },
      { position: 'RB', data: data2, setData: setData2 },
      { position: 'WR', data: data3, setData: setData3 },
      { position: 'TE', data: data4, setData: setData4 },
    ]),
    [
      data1,
      data2,
      data3,
      data4,
    ]
  );

  // Fetch player data (should only occur once)
  React.useEffect(() => {
    for (let i = 0; i < tables.length; i++) {
      fetchData(`/position/${tables[i].position}/`, tables[i].setData, (errorMsg) => setError(errorMsg));
    }
    fetchData('/metrics/', setMetrics, (errorMsg) => setError(errorMsg));
  }, []); // no dependencies since this should only occur once
  
  /**
   * Helper function to compare two rows by the given accessors.
   * @param rowA The first row.
   * @param rowB The second row.
   * @param accessors An ordered array of accessors to use to determine which properties of the rows
   * to compare (accessors past index 0 will be used in the case of a tie).
   * @param functions An array of functions, corresponding to accessors, to apply to the properties
   * being compared before the comparison occurs.
   * @param desc An array of booleans, corresponding to accessors, indicating whether or not to sort
   * the properties being compared in descending order.
   * Precondition: accessors, functions, and desc must have the same length, which must be at least 1.
   */
  const compareByAccessors = React.useCallback((rowA, rowB, accessors, functions, desc) => {
    const a = functions[0](rowA[accessors[0]]);
    const b = functions[0](rowB[accessors[0]]);
    if (a > b) {
      return desc[0] ? -1 : 1;
    } else if (a < b) {
      return desc[0] ? 1 : -1;
    } else {
      return (accessors.length > 1)
        // if there is at least one accessor left, use it as a tiebreaker
        ? compareByAccessors(rowA, rowB, accessors.slice(1), functions.slice(1), desc.slice(1))
        : 0;
    }
  },[]);

  // The tabs containing the tables
  const tabs = React.useMemo(
    () => (
      tables.map((table) => ({
        label: table.position,
        children: <MemoizedPositionTable
          data={table.data}
          position={table.position}
          stats={spreadsheetStats}
          metrics={metrics}
          initialSortBy={
            (rowA, rowB) => compareByAccessors(
              rowA,
              rowB,
              ['fantasy_points_per_game', 'full_name'],
              [parseFloat, String],
              [true, false]
            )
          }
        />
      }))
    ),
    [tables, metrics, compareByAccessors]
  );

  return (
    <div>
      <Navigation />
      <div className='Mydiv'>
        { /* Render tabs only if all data has been fetched */ }
        {error === ''
          ? tables.every((table) => table.data) && metrics
            ? <Tabs tabs={tabs}/>
            : <img className='center' src={require('./icons8-rugby.gif')} alt='loading icon'/>
          : <header className='error'>
              {error}
            </header>
        }
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
