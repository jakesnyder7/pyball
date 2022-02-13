import React, { useState } from 'react';

/**
 * Function to define a sortable table.
 * Details and formating are based on the input in the App.js file.
 * PRECONDITION: Each field in props.body corresponds to the name field of a header in props.hdrs.
 * @author Claire Wagner
 * @param props.hdrs An ordered collection of headers to use in the table (each entry should be an object
 * representing a header with a val field that is the value to display in the header cell and an
 * id field that is a string identifying that header).
 * @param props.data A collection containing data to use in the table (each entry should be an object
 * representing a row of data in which the name of each field corresponds to the id of a header in
 * props.hdrs).
 * @param props.caption The caption for the table.
 * @param props.initial_sortfield The name of the field by which to initially sort the table.
 * @param props.tiebreaker_field The name of the field to use as a tiebreaker when sorting the table.
 * @returns A table that can be sorted in alternating ascending and descending order by clicking on the
 * header cell of the column by which to sort.
 */
 export function SortableTable(props) {
  const hdrs = props.hdrs;
  // state to track the field by which to sort
  const [sortfield, setSortField] = useState(props.initial_sortfield);
  // state to track the order by which to sort (false = ascending, true = descending)
  const [sortorder, setSortOrder] = useState(false);
  // the body of the table, which will be updated after each call to setSortField or setSortOrder
  const body = sortByField(props.data, sortfield, props.tiebreaker_field, sortorder);
  return (
    <table>
      <caption>{props.caption}</caption>
      <thead>
      <tr>
        {hdrs.map(hdr => 
          <th key={hdr.id} onClick={ () => { 
                setSortField(hdr.id); setSortOrder(!sortorder); } }>
            {hdr.val}
          </th>)}
      </tr>
    </thead>
    <tbody>
      {body.map(r => <SortableTableRow row={r} hdrs={props.hdrs} />)}
    </tbody>
  </table>
  );
}

/**
 * Function to define a table row.
 * @param props.row An object representing a row of data in which the name of each field corresponds
 * to the id of a header in props.hdrs).
 * @param props.hdrs An ordered collection of headers for the table (each entry should be an object
 * with an id field that will be used to order the cells in the row).
 * @returns A row containing the specified data where the order of the cells is based on the order 
 * of the provided headers.
 */
function SortableTableRow(props) {
    const row = props.row;
    const hdrs = props.hdrs;
    return (
        <tr>
          {hdrs.map(hdr => <td>{row[hdr.id]}</td>)}
        </tr>
    );
  }
  
  /**
   * Function to sort a collection of objects.
   * Uses numerical order to sort both ints and strings parseable as ints.
   * Uses alphabetical order to sort strings not parseable as ints.
   * @param props.data The collection of objects to sort.
   * @param props.sort_field The name of the field by which to sort.
   * @param props.tiebreaker_field The name of the field to use as a tiebreaker (if any).
   * @param props.descending Whether or not to sort in descending order.
   * @returns The sorted collection.
   */
  function sortByField(data, sort_field, tiebreaker_field, descending) {
    // helper function to parse strings as ints if possible
    // (if a string cannot be parsed as an int, it is returned as is)
    function parseIntHelper(x) {
      const int_x = parseInt(x);
      return int_x ? int_x : x;
    }
    // helper function to compare strings (using alphabetical order)
    // and/or ints (using numerical order)
    function sortHelper(a, b, field) {
      const x1 = parseIntHelper(a[field]);
      const x2 = parseIntHelper(b[field]);
      if (x1 > x2) {
        return 1;
      } else if (x1 < x2) {
        return -1;
      } else {
        return 0;
      }
    }
    // sort and return the collection
    return data.sort(
      (a, b) => {
        let to_return;
        const sort_field_result = sortHelper(a, b, sort_field);
        // in the case of a tie, if tiebreaker_field is not null or
        // undefined, compare the two values using tiebreaker_field
        if ((sort_field_result === 0) && !tiebreaker_field) {
          to_return = sortHelper(a, b, tiebreaker_field);
        } else {
          to_return = sort_field_result;
        }
        if (descending) {
          to_return = to_return * -1;
        }
        return to_return;
    });
}