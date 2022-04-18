import React from 'react';
import { ManipulatableTable } from './ManipulatableTable.js';
import { getStat } from '../Stats/StatFunctions.js';
import { filterTypes, sortTypes, defaultSpreadsheetStatsProps } from '../Stats/StatDefinitions.js';

  /**
   * Hook to define a ManipulatableTable that displays player stats.
   * @param data The player data.
   * @param columns The columns for the table.
   * @returns The table.
   */
  export function PositionTable({data, position, stats, metrics}) {

    // columns for the table
    const columns = [];

    // accessors of columns that should be hidden
    const hiddenColumns = [];

    // helper function to populate the header groups and columns for the table from the provided array
    function populateColumns(headerGroups) {
      headerGroups.forEach((headerGroup) => {
        headerGroup.columns.forEach((col) => {
          // if any prop listed in defaultSpreadsheetStatsProps has been
          // left unspecified for this column, add the default value
          Object.keys(defaultSpreadsheetStatsProps).forEach((prop) => {
            if (col[prop] == null) {
              col[prop] = defaultSpreadsheetStatsProps[prop];
            }
            if (col.hide) {
              hiddenColumns.push(col.accessor);
            }
          });
        });
        columns.push(headerGroup);
      });
    }

    // populate columns from stats
    populateColumns(stats['all']); // add non-position-specific stats
    populateColumns(stats[position]); // add position-specific stats

    // build table data from the provided data
    const tableData = [];
    Object.values(data).forEach(player => {
      if (player.gsis_id != null) {
        // if the player has more than one id, use the first
        let player_id = Array.isArray(player.gsis_id) ? player.gsis_id[0] : player.gsis_id;
        let row = {};
        columns.forEach((headerGroup) => {
          headerGroup.columns.forEach((col) => {
            row[col.accessor] = getStat(
              col.datasource === 'metrics' ? metrics[player_id] : player,
              col.data_accessor ? col.data_accessor : col.accessor,
              col.function);
          });
        });
        // add this player to the table only if at least one position-specific stat is not "N/A"
        if (stats[position].some((hdrGroup) => 
          hdrGroup.columns.some((col) => row[col.accessor] !== "N/A"))) {
            tableData.push(row);
        }
      }
    });

    return (
      <ManipulatableTable
        columns={columns}
        data={tableData}
        sortTypes={sortTypes}
        filterTypes={filterTypes}
        hiddenColumns={hiddenColumns}
      />
    );
  }

export const MemoizedPositionTable = React.memo(PositionTable);