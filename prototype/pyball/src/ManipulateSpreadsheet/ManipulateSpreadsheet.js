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

  const tabs = React.useMemo(
    () => [
      {label: 'QB', position: 'QB', children: <PositionTable data={data1}/> },
      {label: 'RB', position: 'RB', children: <PositionTable data={data2}/> },
    ],
    [data1, data2]
  );

  return (
    <div>
      <Navigation />
      <div>
        {(data1 === '' || data2 === '') ? "Fetching data..." : <Tabs tabs={tabs}/>}
      </div>
    </div>
    );
  }
  
  export default ManipulateSpreadsheet;
  