import React from 'react';
import './App.css';
import './assets/css/SelectInputs.css';
import './assets/css/Pagination.css';
import './assets/css/GeneralInfo.css';
import './assets/css/Album.css';
import './assets/css/Artist.css';
import './assets/css/AttributeSlider.css';
import './assets/css/Find.css';
import './assets/css/Playlist.css';
import './assets/css/Search.css';
import './assets/css/StatCard.css';
import './assets/css/Stats.css';
import './assets/css/Top.css';
import './assets/css/Track.css';
import './assets/css/UserPlaylists.css';
import './assets/css/Responsiveness.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import Top from './components/Top/Top';
import Stats from './components/Stats/Stats';
import Artist from './components/Artist/Artist';
import Track from './components/Track/Track';
import Album from './components/Album/Album';
import UserPlaylists from './components/Playlist/UserPlaylists';
import Playlist from './components/Playlist/Playlist';
import Liked from './components/Liked/Liked';
import SearchResults from './components/Search/SearchResults';
import Find from './components/Find/Find';
import Recommendations from './components/Find/Recommendations';

function App() {
	return (
		<React.Fragment>
			<div className="App">
				<Router>
					<Route exact={true} path="/" component={Home} />
					<Route exact={true} path="/top" component={Top} />
					<Route exact={true} path="/stats" component={Stats} />
					<Route exact={true} path="/artist" component={Artist} />
					<Route exact={true} path="/track" component={Track} />
					<Route exact={true} path="/album" component={Album} />
					<Route exact={true} path="/playlist" component={Playlist} />
					<Route exact={true} path="/playlists" component={UserPlaylists} />
					<Route exact={true} path="/liked" component={Liked} />
					<Route exact={true} path="/search" component={SearchResults} />
					<Route exact={true} path="/find" component={Find} />
					<Route exact={true} path="/recommendations" component={Recommendations} />
				</Router>
			</div>
		</React.Fragment>
	);
}

export default App;
