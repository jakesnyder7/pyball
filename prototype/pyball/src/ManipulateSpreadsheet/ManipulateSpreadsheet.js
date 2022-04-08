import Navigation from '../Navigation/Navigation';
import React from 'react';
import { MemoizedPositionTable } from './PositionTable.js';
import { Tabs } from './Tabs.js';
import { averageRoundTo2 } from '../Stats/StatFunctions.js';
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
      all: [ // stats to display for all positions
        {Header: 'Player', accessor: 'name_and_roster_status', filter: 'any_word_startswith_by_full_name', formattable: false, sortType: 'sort_by_full_name', sortDescFirst: false},
        // Helper column to use when sorting and filtering Player column
        {Header: 'PlayerHelper', accessor: 'full_name', formattable: false, sortDescFirst: false},
        {Header: 'Team', accessor: 'team', formattable: false, sortDescFirst: false},
        {Header: 'Consistency Grade', accessor: 'consistency_grade', formattable: false, sortDescFirst: false},
      ],
      // stats to display for only specific positions
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
    }),
    []
  ); 

  // State to keep track of the data for each table
  const [data1, setData1] = React.useState(null);
  const [data2, setData2] = React.useState(null);
  const [data3, setData3] = React.useState(null);
  //const [data4, setData4] = React.useState('');

  // State to keep track of metrics
  const [metrics, setMetrics] = React.useState(null);

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
        const res = await Got.get('/metrics/');
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []); // no dependencies since this should only occur once
  
  // The tabs containing the tables
  const tabs = React.useMemo(
    () => (
      tables.map((table) => ({
        label: table.position,
        children: <MemoizedPositionTable
          data={table.data}
          position={table.position}
          stats={stats}
          metrics={metrics}
        />
      }))
    ),
    [tables, stats, metrics]
  );

  return (
    <div>
      <Navigation />
      <div className='Mydiv'>
        { /* Render tabs only if all data has been fetched */ }
        {tables.every((table) => table.data) && metrics !== null
          ? <Tabs tabs={tabs}/>
          : <img className='center' src={require('./icons8-rugby.gif')} alt='loading icon'/>
        }
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  