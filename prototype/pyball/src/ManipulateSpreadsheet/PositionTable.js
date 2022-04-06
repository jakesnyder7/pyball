import React from 'react';
import { ManipulatableTable } from './ManipulatableTable.js';
import { RosterCheckmark } from '../Roster/RosterCheckmark.js';
import { getStat } from '../Stats/StatFunctions.js';

/**
 * Helper function for comparing two strings.
 * Returns true if either the entire first string or at least one word in it
 * begins with the same characters as the second string.
 * Words are defined as being separated by spaces.
 * @param str1 The first string.
 * @param str2 The second string.
 * @returns Whether or not at the first string or at least one word in it
 * starts with the same characters as the second.
 */
 function anyWordStartsWithHelper(str1, str2) {
    let compStr1 = str1.toLowerCase();
    let compStr2 = str2.toLowerCase();
    if (compStr1.startsWith(compStr2)) {
      return true;
    }
    let compStr1Words = compStr1.split(' ');
    for (let i = 1; i < compStr1Words.length; i++) {
      if (compStr1Words[i].startsWith(compStr2)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Hook to define a ManipulatableTable that displays player stats.
   * @param data The player data.
   * @param columns The columns for the table.
   * @returns The table.
   */
  export function PositionTable({data, stats}) {
    
    // define additional sort types for the table
    const sortTypes = React.useMemo(
      () => ({
          sort_by_full_name: (rowA, rowB, columnID, desc) => {
          let rowAName = rowA.values.full_name;
          let rowBName = rowB.values.full_name;
          if (rowAName > rowBName) {
            return 1;
          } else if (rowAName < rowBName) {
            return -1;
          } else {
            return 0;
          }
        },
      }),
      []
    );

    // define additional filter types for the table
    const filterTypes = React.useMemo(
      () => ({
        startswith: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id];
            return rowValue !== undefined
              ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
              : true
          })
        },
        any_word_startswith: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id];
            return rowValue !== undefined
              ? anyWordStartsWithHelper(String(rowValue), String(filterValue))
              : true
          })
        },
        any_word_startswith_by_full_name: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values.full_name;
            return rowValue !== undefined
            ? anyWordStartsWithHelper(String(rowValue), String(filterValue))
            : true
          })
        },
      }),
      []
    );

    // columns to display in each table
    const columns = [
      {Header: 'Player', accessor: 'name_and_roster_status', filter: 'any_word_startswith_by_full_name', formattable: false, sortType: 'sort_by_full_name'},
      // Helper column to use when sorting and filtering Player column
      {Header: 'PlayerHelper', accessor: 'full_name', formattable: false},
      {Header: 'Team', accessor: 'team', formattable: false},
    ];

    // default props to add to each stats column
    const defaultProps = {
      filter: 'startswith',
      formattable: true,
      sortDescFirst: true,
    }

    // add a column for each stat to columns while adding the default props to that column
    // (without overriding the stat's preexistent properties)
    stats.forEach((stat) => {
      Object.keys(defaultProps).forEach((prop) => {
        if (stat[prop] == null) {
          stat[prop] = defaultProps[prop];
        }
      });
      columns.push(stat);
    });

    // build table data from the provided data
    const tableData = [];
    Object.values(data).forEach(player => {
      if (player.full_name != null) {
        let row = {};
        columns.forEach((header) => {
          row[header.accessor] = getStat(player, header.accessor, header.function);
        });
        // special case: set name_and_roster_status separately to incorporate the RosterCheckmark component
        row.name_and_roster_status = <span>{getStat(player, 'full_name')}{' '}<RosterCheckmark playername={getStat(player, 'full_name')}/></span>
        tableData.push(row);
      }
    });

    return (
      <ManipulatableTable columns={columns} data={tableData} sortTypes={sortTypes} filterTypes={filterTypes} hiddenColumns={['full_name']} />
    );
  }

export const MemoizedPositionTable = React.memo(PositionTable);