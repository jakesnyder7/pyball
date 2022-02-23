import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
      <div>
        <button class="button-16" role="button">
          Reset
        </button>
      </div>
      <div className="App">
        <header>
          <p>
            Here is our prototype :)
          </p>
        </header>
        <div className="Prototype">
        <button class="button-3" role="button">
            Compare Two Players
          </button>
          <button class="button-3" role="button">
            Manipulate Spreadsheet
          </button>
          <button class="button-3" role="button">
            Edit Team
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
