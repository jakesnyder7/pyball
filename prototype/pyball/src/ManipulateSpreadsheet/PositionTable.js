import React from 'react';
import { ManipulatableTable } from './ManipulatableTable.js';

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
  export function PositionTable({data, columns}) {
    
    // define filter types for the table
    const filterTypes = React.useMemo(
      () => ({
        startswith: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id]
              return rowValue !== undefined
                ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
                : true
          })
        },
        any_word_startswith: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id]
              return rowValue !== undefined
                ? anyWordStartsWithHelper(String(rowValue), String(filterValue))
                : true
          })
        }
      }),
      []
    );
  
    function getStat(player, accessor, func) {
      if (player[accessor] == null) {
        return "N/A";
      }
      let stat = (func != null ? func(player[accessor]) : player[accessor]);
      if (isNaN(parseFloat(stat))) {
        return String(stat);
      } else {
        return Number(stat);
      }
    }

    // build table data from the provided data
    const tableData = [];
    Object.values(data).forEach(player => {
      if (player.full_name != null) {
        let row = {};
        columns.forEach((header) => {
          row[header.accessor] = getStat(player, header.accessor, header.function);
        });
        tableData.push(row);
      }
    });

    return (
      <ManipulatableTable columns={columns} data={tableData} filterTypes={filterTypes} />
    );
  }

export const MemoizedPositionTable = React.memo(PositionTable);