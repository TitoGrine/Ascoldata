import React from 'react';
import './App.css';
import './assets/css/SelectInputs.css';
import './assets/css/Pagination.css';
import './assets/css/User.css';
import './assets/css/Album.css';
import './assets/css/Artist.css';
import './assets/css/AttributeSlider.css';
import './assets/css/Find.css';
import './assets/css/Login.css';
import './assets/css/Playlist.css';
import './assets/css/Creator.css';
import './assets/css/Search.css';
import './assets/css/StatCard.css';
import './assets/css/Stats.css';
import './assets/css/Top.css';
import './assets/css/Track.css';
import './assets/css/ErrorPage.css';
import './assets/css/Responsiveness.css';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

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
import AlbumTracks from './components/Album/AlbumTracks';
import PlaylistTracks from './components/Playlist/PlaylistTracks';
import CreatorPlaylists from './components/Playlist/CreatorPlaylists';
import Followed from './components/Followed/Followed';
import ErrorPage from './components/Error/ErrorPage';
import RelatedArtists from './components/Artist/RelatedArtists';
import About from './components/About/About';
import PrivacyPolicy from './components/Privacy/PrivacyPolicy';

function App() {
	return (
		<React.Fragment>
			<div className="App">
				<Router>
					<Switch>
						<Route exact={true} path="/" component={Home} />
						<Route exact={true} path="/about" component={About} />
						<Route exact={true} path="/privacy_policy" component={PrivacyPolicy} />
						<Route exact={true} path="/top" component={Top} />
						<Route exact={true} path="/stats" component={Stats} />
						<Route exact={true} path="/artist" component={Artist} />
						<Route exact={true} path="/related_artists" component={RelatedArtists} />
						<Route exact={true} path="/track" component={Track} />
						<Route exact={true} path="/album" component={Album} />
						<Route exact={true} path="/album_tracks" component={AlbumTracks} />
						<Route exact={true} path="/playlist" component={Playlist} />
						<Route exact={true} path="/playlists" component={UserPlaylists} />
						<Route exact={true} path="/playlist_tracks" component={PlaylistTracks} />
						<Route exact={true} path="/creator_playlists" component={CreatorPlaylists} />
						<Route exact={true} path="/liked" component={Liked} />
						<Route exact={true} path="/followed" component={Followed} />
						<Route exact={true} path="/search" component={SearchResults} />
						<Route exact={true} path="/find" component={Find} />
						<Route exact={true} path="/recommendations" component={Recommendations} />
						<Route
							exact={true}
							path="/404"
							render={() => (
								<ErrorPage
									errorCode={404}
									errorShort="Page not found"
									errorDescription="Sorry, the page you were looking for doesn't exist..."
								/>
							)}
						/>
						/* Default to 404 page when route not found */
						<Redirect to="/404" />
					</Switch>
				</Router>
			</div>
		</React.Fragment>
	);
}

export default App;
