import "./App.css";

const data = [
  {
    rk: "1",
    name: "Gus",
    team: "team A",
    pos: "yes",
    gms: "2",
    yds: "2",
    td: "0",
    int: "2",
  },
  {
    rk: "2",
    name: "Josh",
    team: "team B",
    pos: "there",
    gms: "3",
    yds: "4",
    td: "1",
    int: "1",
  },
  {
    rk: "3",
    name: "Player of the Foot",
    team: "team B",
    pos: "out there",
    gms: "2",
    yds: "128",
    td: "12",
    int: "3",
  },
];

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function App() {
  return (
    <div className="App">
      <table id="myTable">
        <tr>
          <th onclick={sortTable(0)}>RK</th>
          <th onclick={sortTable(1)}>NAME</th>
          <th onclick={sortTable(2)}>TEAM</th>
          <th onclick={sortTable(3)}>POS</th>
          <th onclick={sortTable(4)}>GMS</th>
          <th onclick={sortTable(5)}>YDS</th>
          <th onclick={sortTable(6)}>TD</th>
          <th onclick={sortTable(7)}>INT</th>
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
          );
        })}
      </table>
    </div>
  );
}

export default App;
