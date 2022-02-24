import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home/Home.js';
import CompareTwoPlayers from './CompareTwoPlayers/CompareTwoPlayers.js';
import ManipulateSpreadsheet from './ManipulateSpreadsheet/ManipulateSpreadsheet';
import EditTeam from './EditTeam/EditTeam';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compare-players" element={<CompareTwoPlayers />} />
      <Route path="/manipulate-spreadsheet" element={<ManipulateSpreadsheet />} />
      <Route path="/edit-team" element={<EditTeam />}  />
    </Routes>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
