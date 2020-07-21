import React, { Component, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Top from './components/GeneralInfo/Top/Top';

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
        </Router>
      </div>
    );
}

export default App;
