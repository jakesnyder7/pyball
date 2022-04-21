import Navigation from '../Navigation/Navigation';
import './CompareTwoPlayers.css';
import React from 'react';
import { Player } from './Player.js';
import { ComparisonTable } from './ComparisonTable.js';
import { PlayerSearchForm } from '../api/PlayerSearchForm.js';
import { fetchData } from '../api/Fetch.js';
import { ComparisonChart } from './ComparisonChart';
import { AcknowledgePrompt } from '../Prompts/Prompts.js';
import { stats_by_position, stat_labels } from '../Stats/StatDefinitions.js';

/**
 * Hook to display player information along a search bar to retrieve player information.
 * @author Marion Geary and Claire Wagner
 * @param data The player data.
 * @param setData A function to use to update the player data.
 * @param setValidResults A function to use to indicate whether results returned by the search bar are valid.
 * @returns A div containing the player information and the search bar.
 */
function PlayerDiv({data, setData, validResults, setValidResults}) {

  // State to track the player search query
  const [query, setQuery] = React.useState('');

  // State to track the current error
  const [error, setError] = React.useState('');

  // Empty player to use as a placeholder
   const emptyPlayer = {
    full_name: [""],
    headshot_url: ['https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Flaweisslab.ucsf.edu%2Fsites%2Fall%2Fmodules%2Fcustom%2Fucsf_person_content_type%2Fimages%2Fperson-placeholder.png&f=1&nofb=1'],
  }

  // Each time data changes, update validResults accordingly
  React.useEffect(() => {
    setValidResults(data != null && data.full_name != null && data.full_name.length > 0);
    if (data != null && (data.full_name == null || data.full_name.length <= 0)) {
      setError("Error: No match found.");
    }
  }, [data, setValidResults]);

  return (
    <div className='Playerz' >
      { validResults
        ? <Player player={data} />
        : <Player player={emptyPlayer} /> }
      {/* If an error has occurred, notify the user; otherwise, display a player search form */}
      {error === ''
      ? <PlayerSearchForm
          query={query}
          setQuery={setQuery}
          buttonText='Search'
          onFail={(errorMsg) => {
            setError(errorMsg);
            setValidResults(false);
          }}
          onPass={() => {fetchData(`player/${query}/`, setData, (errorMsg) => {
              setValidResults(false);
              setQuery('');
              setError(errorMsg);
            }
          )}}
        />
      : <AcknowledgePrompt
          message={error}
          onAcknowledge={()=> {
            setQuery('');
            setError('');
          }}
        />}
    </div>
  );
}

/**
 * Hook to display the Compare Two Players page.
 * @author Marion Geary and Claire Wagner
 * @returns A div containing all page elements.
 */
function CompareTwoPlayers() {
  
  // the data obtained from a query for Player 1
  const [data1, setData1] = React.useState(null);

  // the data obtained from a query for Player 2
  const [data2, setData2] = React.useState(null);

  // whether or not the most recent query for Player 1 produced valid results
  const [validResults1, setValidResults1] = React.useState(false);

  // whether or not the most recent query for Player 2 produced valid results
  const [validResults2, setValidResults2] = React.useState(false);

  return (
    <div>
      <Navigation />
      <div className='CompareTwoPlayers'>
        <div className='PlayerDiv' >
          <PlayerDiv
            data={data1}
            setData={setData1}
            validResults={validResults1}
            setValidResults={setValidResults1}
          />
          <div className='Vs' >
            <h1>
                VS.
            </h1>
          </div>
          <PlayerDiv
            data={data2}
            setData={setData2}
            validResults={validResults2}
            setValidResults={setValidResults2}
          />
        </div>

        { validResults1 && validResults2
        && <div>
          <ComparisonTable
            player1={data1}
            player2={data2}
            stats_by_position={stats_by_position}
            stat_labels={stat_labels}
          />
          <ComparisonChart player1={data1} player2={data2} />
        </div>}
      </div>
    </div>
  );
}

export default CompareTwoPlayers;