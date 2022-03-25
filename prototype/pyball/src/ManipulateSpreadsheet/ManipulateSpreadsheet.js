import Navigation from '../Navigation/Navigation';
import React from 'react';
import { PositionTable } from './PositionTable.js';
import { Tabs } from './Tabs.js';
import './ManipulateSpreadsheet.css';
import Got from '../api/Got.js';

/**
 * Hook to define and display the manipulatable spreadsheet page.
 * @author Claire Wagner
 * @returns A div containing all page elements.
 */
function ManipulateSpreadsheet() {

  const [data1, setData1] = React.useState('');
  const [data2, setData2] = React.useState('');

  const query1 = '/position/QB/';
  const query2 = '/position/RB/';

  React.useEffect(() => {
    const fetchData = async() => {
      try {
        const res1 = await Got.get(`${query1}`);
        setData1(res1.data);
      } catch (err) {
        console.error(err);
      }
      try {
        const res2 = await Got.get(`${query2}`);
        setData2(res2.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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
  
  const tabs = React.useMemo(
    () => [
      {label: 'QB', position: 'QB', children: <PositionTable data={data1} columns={columns['QB']}/> },
      {label: 'RB', position: 'RB', children: <PositionTable data={data2} columns={columns['RB']}/> },
    ],
    [data1, data2]
  );

  return (
    <div>
      <Navigation />
      <div>
        {(data1 === '' || data2 === '') 
          ? <header>{"Fetching data..."}</header>
          : <Tabs tabs={tabs}/>}
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  