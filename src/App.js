import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';

import './App.css';
import './assets/css/SelectInputs.css';
import './assets/css/Pagination.css';
import './assets/css/Redirects.css';
import './assets/css/User.css';
import './assets/css/Album.css';
import './assets/css/Artist.css';
import './assets/css/AttributeSlider.css';
import './assets/css/Animations.css';
import './assets/css/Find.css';
import './assets/css/Login.css';
import './assets/css/HeaderBar.css';
import './assets/css/Playlist.css';
import './assets/css/Creator.css';
import './assets/css/Card.css';
import './assets/css/Search.css';
import './assets/css/StatCard.css';
import './assets/css/Stats.css';
import './assets/css/Top.css';
import './assets/css/Track.css';
import './assets/css/Tabs.css';
import './assets/css/Modal.css';
import './assets/css/Icons.css';
import './assets/css/About.css';
import './assets/css/ErrorPage.css';
import './assets/css/LoadingPage.css';
import './assets/css/Responsiveness.css';

import Home from './components/Home';
import LoadingPage from './components/Error/LoadingPage';

const Top = lazy(() => import('./components/Top/Top'));
const UserStats = lazy(() => import('./components/User/UserStats'));
const Artist = lazy(() => import('./components/Artist/Artist'));
const Track = lazy(() => import('./components/Track/Track'));
const Album = lazy(() => import('./components/Album/Album'));
const UserPlaylists = lazy(() => import('./components/Playlist/UserPlaylists'));
const Playlist = lazy(() => import('./components/Playlist/Playlist'));
const Liked = lazy(() => import('./components/Liked/Liked'));
const SearchResults = lazy(() => import('./components/Search/SearchResults'));
const Find = lazy(() => import('./components/Find/Find'));
const Recommendations = lazy(() => import('./components/Find/Recommendations'));
const AlbumTracks = lazy(() => import('./components/Album/AlbumTracks'));
const PlaylistTracks = lazy(() => import('./components/Playlist/PlaylistTracks'));
const CreatorPlaylists = lazy(() => import('./components/Playlist/CreatorPlaylists'));
const Followed = lazy(() => import('./components/Followed/Followed'));
const ErrorPage = lazy(() => import('./components/Error/ErrorPage'));
const RelatedArtists = lazy(() => import('./components/Artist/RelatedArtists'));
const About = lazy(() => import('./components/About/About'));
const PrivacyPolicy = lazy(() => import('./components/Privacy/PrivacyPolicy'));
const ArtistAlbums = lazy(() => import('./components/Artist/ArtistAlbums'));
const NewReleases = lazy(() => import('./components/Album/NewReleases'));
const FeaturedPlaylists = lazy(() => import('./components/Playlist/FeaturedPlaylists'));

function App() {
	ReactGA.initialize(process.env.REACT_APP_GOOGLE_TRACK_ID);

	return (
		<React.Fragment>
			<div className="App">
				<Router>
					<Suspense fallback={LoadingPage}>
						<Switch>
							<Route exact={true} path="/" component={Home} />
							<Route exact={true} path="/about" component={About} />
							<Route exact={true} path="/privacy_policy" component={PrivacyPolicy} />
							<Route exact={true} path="/top" component={Top} />
							<Route exact={true} path="/user_stats" component={UserStats} />
							<Route exact={true} path="/artist" component={Artist} />
							<Route exact={true} path="/related_artists" component={RelatedArtists} />
							<Route exact={true} path="/artist_albums" component={ArtistAlbums} />
							<Route exact={true} path="/track" component={Track} />
							<Route exact={true} path="/album" component={Album} />
							<Route exact={true} path="/album_tracks" component={AlbumTracks} />
							<Route exact={true} path="/new_releases" component={NewReleases} />
							<Route exact={true} path="/playlist" component={Playlist} />
							<Route exact={true} path="/user_playlists" component={UserPlaylists} />
							<Route exact={true} path="/playlist_tracks" component={PlaylistTracks} />
							<Route exact={true} path="/creator_playlists" component={CreatorPlaylists} />
							<Route exact={true} path="/featured_playlists" component={FeaturedPlaylists} />
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
							{/* Default to 404 page when route not found */}
							<Redirect to="/404" />
						</Switch>
					</Suspense>
				</Router>
			</div>
		</React.Fragment>
	);
}

export default App;
