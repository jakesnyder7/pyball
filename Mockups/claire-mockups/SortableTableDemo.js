import { SortableTable } from './SortableTable.js';

/**
 * Demo function that returns a sortable table of player stats.
 * @author Claire Wagner
 * @returns A sortable table of player stats.
 */
export function SortableTableDemo() {
  /* Headers for the player stat table
  (val is the value that will be displayed in the table,
  name is the name of the field in the player stats that
  corresponds to this header */
  const hdrs = [
    {val: 'Name', id: 'name'},
    {val: 'TD', id: 'td'},
    {val: 'INT', id: 'int'}
  ];

  /* Player stats to use in player stat table 
  (note that each field corresponds to a header name) */
  const players = [
    {name: 'Tom Brady', td: '43', int: '12'},
    {name: 'Justin Herbert', td: '38', int: '15'},
    {name: 'Matthew Stafford', td: '41', int: '17'},
    {name: 'Patrick Mahomes', td: '37', int: '13'},
    {name: 'Josh Allen', td: '36', int: '15'},
    {name: 'Kirk Cousins', td: '33', int: '7'},
    {name: 'Aaron Rodgers', td: '37', int: '4'},
    {name: 'Jimmy Garoppolo', td: '20', int: '12'},
    {name: 'Mac Jones', td: '22', int: '13'},
    {name: 'Ben Roethlisberger', td: '22', int: '10'},
    {name: 'Carson Wentz', td: '27', int: '7'},
    {name: 'Jared Goff', td: '19', int: '8'},
    {name: 'Jalen Hurts', td: '16', int: '9'},
    {name: 'Russell Wilson', td: '25', int: '6'},
    {name: 'Teddy Bridgewater', td: '18', int: '7'},
    {name: 'Lamar Jackson', td: '16', int: '13'}
  ];

  return (
    <div>
      <SortableTable hdrs={hdrs} data={players} caption='2021 NFL Player Stats' 
        initial_sortfield='name' tiebreaker_field='name'/>
    </div>
  );
}