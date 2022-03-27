import Navigation from '../Navigation/Navigation';
import React from 'react';
import { MemoizedPositionTable } from './PositionTable.js';
import { Tabs } from './Tabs.js';
import './ManipulateSpreadsheet.css';
import Got from '../api/Got.js';

/**
 * Helper function to check if all values in an array are truthy.
 * @param array The array to check.
 * @returns True if all values are truthy, false otherwise.
 */
function allTruthy(array) {
  for (let i = 0; i < array.length; i++) {
    if (!array[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Hook to define and display the manipulatable spreadsheet page.
 * @author Claire Wagner
 * @returns A div containing all page elements.
 */
function ManipulateSpreadsheet() {

  // columns for each table by position
  const columns = React.useMemo(
    () => ({
      QB: [
        {Header: 'Player', accessor: 'full_name', filter: 'any_word_startswith', formattable: false},
        {Header: 'Pass Yd Avg', accessor: 'passing_yards', filter: 'startswith', formattable: true},
        {Header: 'Pass TD Avg', accessor: 'passing_tds', filter: 'startswith', formattable: true},
        {Header: 'Rush Yd Avg', accessor: 'rushing_yards', filter: 'startswith', formattable: true},
        {Header: 'INT Avg', accessor: 'interceptions', filter: 'startswith', formattable: true}
      ],
      RB: [
        {Header: 'Player', accessor: 'full_name', filter: 'any_word_startswith', formattable: false},
        {Header: 'Rush Yd Avg', accessor: 'rushing_yards', filter: 'startswith', formattable: true},
        {Header: 'Rush TD Avg', accessor: 'rushing_tds', filter: 'startswith', formattable: true},
        {Header: 'Rec Avg', accessor: 'receptions', filter: 'startswith', formattable: true},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', filter: 'startswith', formattable: true},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', filter: 'startswith', formattable: true}
      ],
      WR: [
        {Header: 'Player', accessor: 'full_name', filter: 'any_word_startswith', formattable: false},
        {Header: 'Rec Avg', accessor: 'receptions', filter: 'startswith', formattable: true},
        {Header: 'Rec Yd Avg', accessor: 'receiving_yards', filter: 'startswith', formattable: true},
        {Header: 'Rec TD Avg', accessor: 'receiving_tds', filter: 'startswith', formattable: true}
      ]
    }),
    []
  );

  // State to keep track of the data for each table
  const [data1, setData1] = React.useState('');
  const [data2, setData2] = React.useState('');

  // The positions and associated data for the tables
  const tables = React.useMemo (
    () => ([
      { position: 'QB', data: data1, setData: setData1 },
      { position: 'RB', data: data2, setData: setData2 },
    ]),
    [data1, data2]
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
        {allTruthy(tables.map((table) => table.data))
          ? <Tabs tabs={tabs}/>
          : <header>{"Fetching data..."}</header>}
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  