import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home/Home';
import Top from './components/GeneralInfo/Top/Top';
import Stats from './components/GeneralInfo/Stats/Stats';
import Artist from './components/GeneralInfo/Artist/Artist';
import Track from './components/GeneralInfo/Track/Track';
import Album from './components/GeneralInfo/Album/Album';
import UserPlaylists from './components/GeneralInfo/Playlist/UserPlaylists';
import Playlist from './components/GeneralInfo/Playlist/Playlist';

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
          <Route
            exact = { true }
            path = "/album"
            component = { Album }
          />
          <Route
            exact = { true }
            path = "/playlist"
            component = { Playlist }
          />
          <Route
            exact = { true }
            path = "/playlists"
            component = { UserPlaylists }
          />
        </Router>
      </div>
    );
}

export default App;
