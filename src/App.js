import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Top from './components/GeneralInfo/Top/Top';
import Stats from './components/GeneralInfo/Stats/Stats';
import Artist from './components/GeneralInfo/Artist/Artist';
import Track from './components/GeneralInfo/Track/Track';

function App() {

  return (
      <div className="App">
        <Router>
          <Route
            exact = { true }
            path = "/"
            component = { Home }
          />
          <Route
            exact = { true }
            path = "/login"
            component = { Login }
          />
          <Route
            exact = { true }
            path = "/top"
            component = { Top }
          />
          <Route
            exact = { true }
            path = "/stats"
            component = { Stats }
          />
          <Route
            exact = { true }
            path = "/artist"
            component = { Artist }
          />
          <Route
            exact = { true }
            path = "/track"
            component = { Track }
          />
        </Router>
      </div>
    );
}

export default App;
