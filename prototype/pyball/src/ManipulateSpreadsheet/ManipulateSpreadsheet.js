import Navigation from '../Navigation/Navigation';
import React from 'react';
import { MemoizedPositionTable } from './PositionTable.js';
import { Tabs } from './Tabs.js';
import { average } from '../Stats/MathFunctions.js';
import './ManipulateSpreadsheet.css';
import Got from '../api/Got.js';

/**
 * Hook to define and display the manipulatable spreadsheet page.
 * @author Claire Wagner
 * @returns A div containing all page elements.
 */
function ManipulateSpreadsheet() {

  // Stats to display in each table, organized by position
  // 'Header' is the header for the column containing the stat; 'accessor' is the accessor to use
  // to select the relevant data; 'function' is the function to use on the data in the column before
  // displaying it (if any)
  // Optional properties: 'sortDescFirst' (boolean, true by default in PositionTable) to sort first by
  // descending order; 'formattable' (boolean, true by default in PositionTable) to indicate whether or
  // not the column should be conditionally formattable
  const stats = React.useMemo(
    () => ({
      QB: [
        {Header: 'Pass Yd Avg', accessor: 'passing_yards', function: average},
        {Header: 'Pass TD Avg', accessor: 'passing_tds', function: average},
        {Header: 'Rush Yd Avg', accessor: 'rushing_yards', function: average},
        {Header: 'INT Avg', accessor: 'interceptions', function: average}
      ],
      RB: [
        {Header: 'Rush Yd Avg', accessor: 'rushing_yards', function: average},
        {Header: 'Rush TD Avg', accessor: 'rushing_tds', function: average},
        {Header: 'Rec Avg', accessor: 'receptions', function: average},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: average},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: average}
      ],
      WR: [
        {Header: 'Rec Avg', accessor: 'receptions', function: average},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: average},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: average}
      ],
      TE: [
        {Header: 'Rec Avg', accessor: 'receptions', function: average},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: average},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: average}
      ],
    }),
    []
  ); 

  // State to keep track of the data for each table
  const [data1, setData1] = React.useState('');
  const [data2, setData2] = React.useState('');
  const [data3, setData3] = React.useState('');
  //const [data4, setData4] = React.useState('');

  // The positions and associated data for the tables
  const tables = React.useMemo (
    () => ([
      { position: 'QB', data: data1, setData: setData1 },
      { position: 'RB', data: data2, setData: setData2 },
      { position: 'WR', data: data3, setData: setData3 },
      //{ position: 'TE', data: data4, setData: setData4 },
    ]),
    [
      data1,
      data2,
      data3,
      //data4,
    ]
  );

  // Fetch player data (should only occur once)
  React.useEffect(() => {
    const fetchData = async() => {
      try {
        for (let i = 0; i < tables.length; i++) {
          const res = await Got.get(`/position/${tables[i].position}/`);
          tables[i].setData(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []); // no dependencies since this should only occur once
  
  // The tabs containing the tables
  const tabs = React.useMemo(
    () => (
      tables.map((table) => (
        {label: table.position, children: <MemoizedPositionTable data={table.data} stats={stats[table.position]}/> }
      ))
    ),
    [tables, stats]
  );

  return (
    <div>
      <Navigation />
      <div>
        { /* Render tabs only if all data has been fetched */ }
        {tables.every((table) => table.data)
          ? <Tabs tabs={tabs}/>
          : <img className='center' src='https://upload.wikimedia.org/wikipedia/commons/7/7a/Ajax_loader_metal_512.gif' alt='loading icon'/>
        }
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  