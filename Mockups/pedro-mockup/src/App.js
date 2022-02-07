import "./App.css";

const data = [
  { rk: "1", name: "Gus", team: "team A", pos: "yes", gms: "2", yds: "2", td: "0", int: "2" },
  { rk: "2", name: "Josh", team: "team B", pos: "there", gms: "3", yds: "4", td: "1", int: "1" },
  { rk: "3", name: "Player of the Foot", team: "team B", pos: "out there", gms: "2", yds: "128", td: "12", int: "3" },
]

function App() {
  return (
    <div className="App">
      <table>
        <tr>
          <th>RK</th>
          <th>NAME</th>
          <th>TEAM</th>
          <th>POS</th>
          <th>GMS</th>
          <th>YDS</th>
          <th>TD</th>
          <th>INT</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.rk}</td>
              <td>{val.name}</td>
              <td>{val.team}</td>
              <td>{val.pos}</td>
              <td>{val.gms}</td>
              <td>{val.yds}</td>
              <td>{val.td}</td>
              <td>{val.int}</td>
            </tr>
          )
        })}
      </table>
    </div>
  );
}

export default App;
