import React from 'react';
import { useTable, useSortBy, useRowState, useFilters } from 'react-table';
import { ConditionalFormatForm } from './ConditionalFormatForm.js';

/**
 * Default filtering UI.
 * Source: https://github.com/TanStack/react-table/blob/v7/examples/filtering/src/App.js (MIT license).
*/
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

/**
 * Hook to define a table that supports various manipulations.
 * Currently supports single- and multi-column sorting, filtering, and conditional formatting.
 * @author Claire Wagner
 * @param columns The columns to display in the table
 * (must conform to react-table specifications (https://react-table.tanstack.com/docs/api/useTable)).
 * @param data The data to display in the table
 * (must conform to react-table specifications (https://react-table.tanstack.com/docs/api/useTable)
 * and include a boolean property called 'formattable' dictating whether or not the column should
 * be conditionally formattable).
 * @param sortTypes sort types to use when sorting data instead of the default options (optional)
 * (must conform to react-table specifications (https://react-table.tanstack.com/docs/api/useFilters)).
 * @param filterTypes Filter types to use when filtering data instead of the default options (optional)
 * (must conform to react-table specifications (https://react-table.tanstack.com/docs/api/useFilters)).
 * @param hiddenColumns An array of columns to hide initially (optional).
 * @returns A div containing the table.
 * Portions of this hook are based on https://stackoverflow.com/a/69128343 (CC BY-SA 4.0 license) and
 * https://github.com/TanStack/react-table/blob/v7/examples/basic,
 * https://github.com/TanStack/react-table/tree/v7/examples/sorting, and
 * https://github.com/TanStack/react-table/blob/v7/examples/filtering (MIT license).
 */
export function ManipulatableTable({columns, data, sortTypes, filterTypes, hiddenColumns}) {

  const defaultColumn = React.useMemo(
    () => ({
      // set up default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      sortTypes,
      filterTypes,
      initialState: {
        hiddenColumns: hiddenColumns,
      },
    },
    useFilters,
    useSortBy,
    useRowState
  );

  /**
   * Function to apply conditional formatting to the cells in the specified column.
   * Applies the specified background color to all cells in that column with values that
   * lie in the specified range. If both bounds are parseable as floats, then the range is
   * [min, max]. If only one bound is parseable as a float, then the other bound is treated as
   * positive or negative infinity. If neither bound is parseable as a float, then the range is
   * treated as empty.
   * @param min The lower bound (inclusive) of the range.
   * @param max The upper bound (inclusive) of the range.
   * @param columnID The id of the column to which to apply the conditional formatting.
   * @param color The background color to apply.
   * @param textcolor The text color to apply.
   * Postcondition: The background color of each cells in the given column has been set to
   * the specified color if the cell value lies in the range and null otherwise. The
   * background colors of cells in other columns have not been changed.
  */
  function applyConditionalFormatting(min, max, columnID, color, textcolor) {
    // Helper function to determine whether argument is parseable as a float
    function validFloat(x) {
      return !isNaN(parseFloat(x));
    }
    // Helper function to determine whether value is in range
    function inRange(min, max, val) {
      let valAsFloat = parseFloat(val);
      let validMin = validFloat(min);
      let validMax = validFloat(max);
      if (validMin && validMax) {
        return valAsFloat >= min && val <= max;
      } else if (validMin) {
        return valAsFloat >= min;
      } else if (validMax) {
        return valAsFloat <= max;
      }
      return false;
    }
    // Apply conditional formatting
    rows.forEach(row => {
      row.cells.forEach(cell => {
        cell.setState( (oldval) => {
          return (
            { ...oldval, backgroundColor: cell.column.id === columnID
              // if cells are in the specified column, highlight them if they
              // are in the range; otherwise, remove any preexistent highlight
              ? (inRange(min, max, cell.value)
                ? color
                : null)
              // if cells are not in the specified column, leave them as is
              : oldval.backgroundColor }
            );
        });
        cell.setState( (oldval) => {
          return (
            { ...oldval, textColor: cell.column.id === columnID
              // if cells are in the specified column, highlight them if they
              // are in the range; otherwise, remove any preexistent highlight
              ? (inRange(min, max, cell.value)
                ? textcolor
                : null)
              // if cells are not in the specified column, leave them as is
          : oldval.textColor }
            );
        });
      });
    });
  };

  // Render the table UI 
  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {/* sorting UI */}
                  <span {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽': ' 🔼') : ''}
                  </span>
                  {/* conditional formatting UI */}
                  {column.formattable && <span>
                    <ConditionalFormatForm columnID={column.id} applyFormat={
                      applyConditionalFormatting
                    } />                            
                  </span>} 
                  {/* filtering UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps([{
                      // for conditional formatting
                      style: { backgroundColor: cell.state.backgroundColor, color: cell.state.textColor }
                    }])}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
