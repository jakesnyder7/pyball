import React from 'react';
import { useTable, useSortBy, useRowState } from 'react-table';

/**
 * Hook to define a table that supports various manipulations.
 * Currently supports limited conditional formatting and sorting by single or multiple columns.
 * Uses react-table.
 * @author Claire Wagner
 * @param columns The columns to display in the table
 * (must conform to react-table specifications: https://react-table.tanstack.com/docs/api/useTable).
 * @param data The data to display in the table
 * (must conform to react-table specifications: https://react-table.tanstack.com/docs/api/useTable).
 * @param formattable An object mapping column accessors to boolean values specifying whether or not
 * that column should be conditionally formattable.
 * @returns A div containing the table.
 * Portions of this hook are based on https://stackoverflow.com/a/69128343 (CC BY-SA 4.0 license),
 * https://github.com/TanStack/react-table/blob/v7/examples/basic/src/App.js (MIT license), and
 * https://github.com/TanStack/react-table/tree/v7/examples/sorting (MIT license).
 */
export function ManipulatableTable({columns, data, formattable}) {

    // The table instance
    const table = useTable(
        {
            columns: columns,
            data: data,
            disableSortRemove: true,
            initialCellStateAccessor: cell => ({ backgroundColor: null })
        },
        useSortBy,
        useRowState
    );

    /**
     * Function to apply conditional formatting to the cells in the specified column.
     * Applies the specified background color to all cells in that column with values
     * that are less than the comparand.
     * @param comparand The comparand against which to compare cell values.
     * @param columnID The id of the column to which to apply the conditional formatting.
     * @param color The background color to apply.
     * Postcondition: The background colors of all cells in the given column with values that are
     * less than the comparand have been set to the specified color. The background colors of all
     * other cells in that column have been set to null. No other cell's background color has been
     * changed.
    */
    function applyConditionalFormatting(comparand, columnID, color) {
        //const columnID = 'td';
        //const comparand = e.target.value;
        // apply conditional formatting if that 
        if (!isNaN(parseInt(comparand))) {
            table.rows.forEach(row => {
                row.cells.forEach(cell => {
                    cell.setState( (oldval) => {
                        return (
                            { backgroundColor: 
                                cell.column.id === columnID ? (cell.value < comparand ? color : null) : oldval}
                        );
                    });
                })
            });
        }
    };

    // Render the table UI 
    return (
        <div>
            <table {...table.getTableProps()}>
                <thead>
                    {table.headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽': ' 🔼') : ''}
                                    </span>                                    
                                    {formattable[column.id] &&
                                    <div>
                                        <label>
                                            {'highlight stats less than: '}<br></br>
                                            <input placeholder='enter comparand' onChange={ (e) => 
                                                { applyConditionalFormatting(
                                                    e.target.value, column.id, 'cyan');
                                                } 
                                            } />
                                        </label>
                                        </div>}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...table.getTableBodyProps()}>
                    {table.rows.map((row, i) => {
                        table.prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps([{
                                            style: { backgroundColor: cell.state.backgroundColor }
                                        }])}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}