import React, { Component, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home';
import Login from './components/Login';
import TopTracks from './components/TopTracks';

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
            path = "/top_tracks"
            component = { TopTracks }
          />
        </Router>
      </div>
    );
}

export default App;
