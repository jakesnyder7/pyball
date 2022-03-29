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

  // Columns for each table by position
  // 'Header' is the header for the column, 'accessor' is the accessor to use to select the relevant
  // data, 'function' is the function to use on the data in the column before displaying it (if any),
  // 'filter' is the filter type to apply to the column, and 'formattable' indicates whether the column
  // should be conditionally formattable
  const columns = React.useMemo(
    () => ({
      QB: [
        {Header: 'Player', accessor: 'full_name', filter: 'any_word_startswith', formattable: false},
        {Header: 'Pass Yd Avg', accessor: 'passing_yards', function: (data) => {return average(data, 10)}, filter: 'startswith', formattable: true},
        {Header: 'Pass TD Avg', accessor: 'passing_tds', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rush Yd Avg', accessor: 'rushing_yards', function: average, filter: 'startswith', formattable: true},
        {Header: 'INT Avg', accessor: 'interceptions', function: average, filter: 'startswith', formattable: true}
      ],
      RB: [
        {Header: 'Player', accessor: 'full_name', function: average, filter: 'any_word_startswith', formattable: false},
        {Header: 'Rush Yd Avg', accessor: 'rushing_yards', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rush TD Avg', accessor: 'rushing_tds', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rec Avg', accessor: 'receptions', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: average, filter: 'startswith', formattable: true}
      ],
      WR: [
        {Header: 'Player', accessor: 'full_name', function: average, filter: 'any_word_startswith', formattable: false},
        {Header: 'Rec Avg', accessor: 'receptions', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: average, filter: 'startswith', formattable: true}
      ],
      TE: [
        {Header: 'Player', accessor: 'full_name', function: average, filter: 'any_word_startswith', formattable: false},
        {Header: 'Rec Avg', accessor: 'receptions', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', function: average, filter: 'startswith', formattable: true},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', function: average, filter: 'startswith', formattable: true}
      ]
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
        {label: table.position, children: <MemoizedPositionTable data={table.data} columns={columns[table.position]}/> }
      ))
    ),
    [tables, columns]
  );

  return (
    <div>
      <Navigation />
      <div>
        { /* Render tabs only if all data has been fetched */ }
        {tables.every((table) => table.data != false)
          ? <Tabs tabs={tabs}/>
          : <header>{"Fetching data..."}</header>}
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  