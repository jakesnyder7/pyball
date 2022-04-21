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
      fetchData(`/position/${tables[i].position}/`, tables[i].setData, null);
    }
    fetchData('/metrics/', setMetrics, null);
  }, []); // no dependencies since this should only occur once
  
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
        />
      }))
    ),
    [tables, metrics]
  );

  return (
    <div>
      <Navigation />
      <div className='Mydiv'>
        { /* Render tabs only if all data has been fetched */ }
        {tables.every((table) => table.data) && metrics
          ? <Tabs tabs={tabs}/>
          : <img className='center' src={require('./icons8-rugby.gif')} alt='loading icon'/>
        }
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
