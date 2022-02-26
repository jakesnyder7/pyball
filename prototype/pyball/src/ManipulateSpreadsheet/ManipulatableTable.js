import React from 'react';
import { useTable, useSortBy, useRowState, useFilters } from 'react-table';

/**
 * Default filtering UI.
 * Based on https://github.com/TanStack/react-table/blob/v7/examples/filtering/src/App.js (MIT license).
 */
function DefaultColumnFilter({column: { filterValue, preFilteredRows, setFilter }}) {
  const count = preFilteredRows.length;
  
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} player records...`}
    />
  )
}

/**
 * Hook to define a form for the application of conditional formatting.
 * @author Claire Wagner
 * @param columnID The id of the column to which to apply the conditional formatting.
 * @param applyFormat A function to apply the conditional formatting.
 * @return The form.
 * Parameters: comparand, column ID, color, and function defining comparison against the comparand.
 */
function ComparandInput({columnID, applyFormat}) {

  const [min, setMin] = React.useState(undefined);
  const [max, setMax] = React.useState(undefined);
  const [color, setColor] = React.useState('gray');

  // options for colors
  const colorOptions = React.useMemo(
    () => ['gray','maroon','red','purple', 'fuchsia','green','lime','olive','yellow','navy','blue','teal','cyan','orange'],
    []
  );

  // return form
  return (
    <form>
      {'highlight stats from '}

      {/* for lower bound input */}
      <input type='number' width={5} placeholder='min' value={min} onChange={ (e) => {
        setMin(e.target.value);
        applyFormat(e.target.value, max, columnID, color);
      }} />

      {' to '}

      {/* for upper bound input */}
        <input type='number' placeholder='max' value={max} onChange={ (e) => {
          setMax(e.target.value);
          applyFormat(min, e.target.value, columnID, color) 
        }} />
      
      {/* for color selection */}
      <label>
        {'color: '}
        <select value={color} onChange={ (e) => { 
          setColor(e.target.value);
          applyFormat(min, max, columnID, e.target.value);
        }}>
          {colorOptions.map(colorOption => (
            <option value={colorOption}>{colorOption}</option>
          ))}
        </select>
      </label>

    </form>
  );
}

/**
 * Hook to define a table that supports various manipulations.
 * Currently supports single- and multi-column sorting, filtering, and conditional formatting.
 * @author Claire Wagner
 * @param columns The columns to display in the table
 * (must conform to react-table specifications: https://react-table.tanstack.com/docs/api/useTable).
 * @param data The data to display in the table
 * (must conform to react-table specifications: https://react-table.tanstack.com/docs/api/useTable).
 * @param formattable An object mapping column accessors to boolean values specifying whether or not
 * that column should be conditionally formattable.
 * @returns A div containing the table.
 * Portions of this hook are based on https://stackoverflow.com/a/69128343 (CC BY-SA 4.0 license) and
 * https://github.com/TanStack/react-table/blob/v7/examples/basic,
 * https://github.com/TanStack/react-table/tree/v7/examples/sorting, and
 * https://github.com/TanStack/react-table/blob/v7/examples/filtering (MIT license).
 */
export function ManipulatableTable({columns, data, formattable}) {

  const filterTypes = React.useMemo(
    () => ({
      // Override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
            return rowValue !== undefined
              ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
              : true
        })
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // set up default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // The table instance
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
      filterTypes
    },
    useFilters,
    useSortBy,
    useRowState
  )

  /**
  * Function to apply conditional formatting to the cells in the specified column.
  * Applies the specified background color to all cells in that column with values that
  * lie in the specified range.
  * @param min The lower bound (inclusive) of the range.
  * @param max The upper bound (inclusive) of the range.
  * @param columnID The id of the column to which to apply the conditional formatting.
  * @param color The background color to apply.
  * Postcondition: The background colors of all cells in the given column with values that lie
  * in the range defined by min and max have been set to the specified color. The background
  * colors of all other cells in that column have been set to null. No other cell's background
  * color has been changed.
  */
  function applyConditionalFormatting(min, max, columnID, color) {
    // Helper function to determine whether argument is a valid int
    function validInt(x) {
      return !isNaN(parseInt(x));
    }
    // Apply conditional formatting if both min and max are valid ints
    if (validInt(min) && validInt(max)) {
      rows.forEach(row => {
        row.cells.forEach(cell => {
          cell.setState( (oldval) => {
            return (
              { backgroundColor: cell.column.id === columnID
                ? (cell.value >= min && cell.value <= max)
                  ? color : null
                : oldval}
              );
            });
        })
      });
    }
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
                  {formattable[column.id] && <span>
                    <ComparandInput columnID={column.id} applyFormat={
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
                      style: { backgroundColor: cell.state.backgroundColor }
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
