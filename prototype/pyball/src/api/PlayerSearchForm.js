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