import Downshift from "downshift";
import React from "react";
import { formatPlayerName } from '../Stats/StatFunctions.js';

/**
 * Hook to define a form for searching for a player using a dropdown list that is autopopulated
 * based on API results for the search query.
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
 export function AutocompletePlayerSearchForm({query, setQuery, buttonText, onFail, onPass}) {

  /**
   * Helper function to handle queries, including basic validity checks.
   * @param query The query.
   * @param onFail The function to call if a query is detected as invalid.
   * @param onPass The function to call if a query is not detected as invalid.
   * Postcondition: If a query is detected as invalid, onFail has been called;
   * otherwise, onPass has been called.
   */
  function handleQuery(query, onFail, onPass) {
    if (query === '') {
      onFail('Error: please enter a name. ');
    } else if (query.split(' ').length < 2) {
      onFail('Error: please enter both first and last name of player.');
    } else if (query.split(' ').length > 2) {
      onFail('Error: please enter only first and last name of player.');
    } else {
      onPass(query);
    }
  };

  const PlayerList = require('./PlayerList.json');

  /**
   * Helper function to format a player name for case-insensitive pattern matching that ignores periods.
   * @param name The name.
   * @returns The name converted to lowercase with all periods removed.
   */
  function formatForMatching(name) {
    return formatPlayerName(String(name).toLowerCase());
  }

  return(
    <Downshift
      onChange={(selection) => {
        setQuery(selection.full_name);
        // send API request when a selection is made
        handleQuery(selection.full_name, onFail, onPass);
      }}
      
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
      closeMenu,
    }) => (
      <div>
        
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <form
            style={{ display: 'flex', flexDirection: 'row' }}
            onSubmit={(event) => { event.preventDefault(); }}
          >
            <input {...getInputProps({ 
              placeholder: "Enter player name",
              type: "text",
              value: query,
              onChange: (e) => {
                setQuery(e.target.value);
              },
            })} />
            <button
              type='submit'
              onClick={(event) => {
                event.preventDefault();
                isOpen && closeMenu(); // close autocomplete menu if open
                handleQuery(query, onFail, onPass);
              }}
            >
              {buttonText}
            </button>
          </form>
        </div>
        <ul {...getMenuProps({ style: {listStyle: 'none'} })}>
          {isOpen && query !== ''
            ? PlayerList
                .filter(item => !inputValue ||
                    // case-insensitive matching that ignores periods
                    formatForMatching(item.full_name).includes(formatForMatching(inputValue)))
                .map((item, index) => (
                  <li
                    {...getItemProps({
                      key: item.full_name,
                      index,
                      item,
                      style: {
                        color:
                          highlightedIndex === index ? '#FFFFFF' : '#727272',
                        backgroundColor:
                          highlightedIndex === index ? '#323232' : '#292929',
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

/**
 * Hook to define a form for searching for a player.
 * @author Claire Wagner
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
      onFail('Error: please enter a name.');
    } else if (query.split(' ').length < 2) {
      onFail('Error: please enter both first and last name of player.');
    } else if (query.split(' ').length > 2) {
      onFail('Error: please enter only first and last name of player.');
    } else {
      onPass();
    }
  };

  return (
    <form style={{display: 'flex', flexDirection: 'row'}}>
      <input
        type='text'
        placeholder='Enter player name'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={(event) => {
        event.preventDefault();
        handleQuery(query, onFail, onPass);
      }}>
        {buttonText}
      </button>
    </form>
  );
}