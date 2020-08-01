import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home';
import Top from './components/General/Top/Top';
import Stats from './components/General/Stats/Stats';
import Artist from './components/General/Artist/Artist';
import Track from './components/General/Track/Track';
import Album from './components/General/Album/Album';
import UserPlaylists from './components/General/Playlist/UserPlaylists';
import Playlist from './components/General/Playlist/Playlist';
import Liked from './components/General/Liked Songs/Liked'
import SearchResults from './components/General/Search/SearchResults';
import Find from './components/General/Find/Find';
import Recommendations from './components/General/Find/Recommendations';

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
          <Route
            exact = { true }
            path = "/liked"
            component = { Liked }
          />
          <Route
            exact = { true }
            path = "/search"
            component = { SearchResults }
          />
          <Route
            exact = { true }
            path = "/find"
            component = { Find }
          />
          <Route
            exact = { true }
            path = "/recommendations"
            component = { Recommendations }
          />
        </Router>
      </div>
    );
}

export default App;
