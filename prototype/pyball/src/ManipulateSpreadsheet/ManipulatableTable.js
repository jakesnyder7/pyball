import React from 'react';
import { useTable, useSortBy, useRowState } from 'react-table';

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
        () => ['gray','maroon','red','purple', 'fuchsia','green','lime','olive','yellow','navy','blue','teal','cyan'],
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
        function validInt(x) {
            return !isNaN(parseInt(x));
        }
        if (validInt(min) && validInt(max)) {
            table.rows.forEach(row => {
                row.cells.forEach(cell => {
                    cell.setState( (oldval) => {
                        return (
                            { backgroundColor: 
                                cell.column.id === columnID
                                ? (cell.value >= min && cell.value <= max) ? color : null
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
            <table {...table.getTableProps()}>
                <thead>
                    {table.headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    <span {...column.getSortByToggleProps()}>
                                        {column.render('Header')}
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽': ' 🔼') : ''}
                                    </span>
                                    {formattable[column.id] && <div>
                                       <ComparandInput columnID={column.id} applyFormat={
                                            applyConditionalFormatting
                                        } />                            
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