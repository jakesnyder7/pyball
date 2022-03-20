import { useEffect } from "react";
import Got from './Got';

/**
 * Hook to define a search bar for making API queries. 
 * @author Claire Wagner
 * @param queryPrefix The prefix to use before the query (e.g. "player" or "position").
 * @param data The state variable to use to keep track of query results.
 * @param setData The function to use to update the data state variable.
 * @param setValidResults The function to use to indicate whether a query produced valid results.
 * @param placeholderText The text to display as a placeholder in the search bar.
 * @returns 
 */
export function UseFetchInput({queryPrefix, data, setData, setValidResults, placeholderText}) {
      
  useEffect(() => {
    if (data.query !== "") {
      const timeoutId = setTimeout(() => {
        const fetch = async () => {
          try {
            const res = await Got.get(`/${queryPrefix}/${data.query}/`);
            setData({ ...data, results: res.data });
            setValidResults(res.data != null ? true : false);
          } catch (err) {
            console.error(err);
            setValidResults(false);
          }
        };
        fetch();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [data.query]);
      
  return (
    <input
      type="text"
      placeholder={placeholderText}
      value={data.query}
      onChange={(e) => setData({ ...data, query: e.target.value })}
    />
  );
};