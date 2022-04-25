import { useFuse } from "./useFuse";
import { useState } from "react";
import { PlayerList } from "./PlayerList.json";

import Downshift from "downshift";
import {useCombobox} from "downshift";

/**
 * Hook to define a form for searching for a player and autocompleting
 * potential answers based on API results.
 * @author Claire Wagner
 * @author Marion Geary
 * @param query The query state.
 * @param setQuery The function to use to modify the query state.
 * @param buttonText The text to display on the button.
 * @param onFail The function to call if the search query is submitted and fails the validity checks
 * (this function will be passed a string describing the error that occurred).
 * @param onPass The function to call if the search query is submitted and passes the validity checks.
 * @returns The form.
 */
export function PlayerSearchForm({query, setQuery, buttonText, onFail, onPass}) {

  /**
   * Helper function to handle queries, including basic validity checks.
   * Postcondition: If a query is detected as invalid, onError has been called;
   * otherwise, onPass has been called.
   */
  function handleQuery(query, onFail, onPass) {
    if (query === '') {
      onFail('Error: please enter a name. ' + query + "q");
    } else if (query.split(' ').length < 2) {
      onFail('Error: please enter both first and last name of player.' + query + "q");
    } else if (query.split(' ').length > 2) {
      onFail('Error: please enter only first and last name of player.' + query + "q");
    } else {
      onPass();
    }
  };

  
  const PlayerList = require('./PlayerList.json');

return(
      <Downshift
    onChange={(selection) => setQuery(selection.full_name)}
    itemToString={item => (item ? item.value : '')}
  >
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
    }) => (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        <input {...getInputProps({ placeholder: "Enter player name", type: "text"})} />
        <button onClick={(event) => {
              event.preventDefault();
              handleQuery(query, onFail, onPass);
            }}>
          {buttonText}
        </button>
        </div>
        <ul {...getMenuProps()}>
          {isOpen
            ? PlayerList
                .filter(item => !inputValue || item.full_name.includes(inputValue))
                .map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.full_name,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? 'lightgray' : 'white',
                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                      },
                    })}
                  >
                    {item.full_name}
                  </li>
                ))
            : null}
        </ul>
      </div>
    )}
  </Downshift>
    )
  }