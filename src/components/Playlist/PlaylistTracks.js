import React, { useState, useEffect, useCallback } from 'react';
import ReactGA from 'react-ga';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Spotify from 'spotify-web-api-js';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../Common/Redirects';
import Search from '../Search/Search';
import SideToggle from '../Common/SideToggle';
import TrackCards from '../Track/TrackCards';
import TrackTable from '../Track/TrackTable';
import HeaderBar from '../Common/HeaderBar';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Helmet } from 'react-helmet';
import NoContent from '../Common/NoContent';

const spotifyWebApi = new Spotify();

function PlaylistTracks() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const playlistId = query.get('id');
	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ playlistName, setPlaylistName ] = useState('');
	const [ playlistTracks, setPlaylistTracks ] = useState([]);
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const { promiseInProgress } = usePromiseTracker();

	const getPlaylistName = useCallback(
		() => {
			if (playlistName.length !== 0) return;

			spotifyWebApi.getPlaylist(playlistId).then(
				function(data) {
					setPlaylistName(data.name);
				},
				function(err) {
					console.log(err);
				}
			);
		},
		[ playlistId, playlistName ]
	);

	const getPlaylistTracks = (tracks) => {
		trackPromise(
			spotifyWebApi.getTracks(tracks).then(
				function(data) {
					// console.log(data);
					setPlaylistTracks(data.tracks);
					// setPlaylistName(data.tracks.length > 0 ? data.tracks[0].playlist.name : '');
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	const getData = useCallback(
		() => {
			spotifyWebApi.setAccessToken(authToken);

			trackPromise(
				spotifyWebApi
					.getPlaylistTracks(playlistId, {
						limit: limit,
						offset: offset
					})
					.then(
						function(data) {
							// console.log(data);
							setTotalItems(data.total);
							getPlaylistTracks(
								data.items.map((item) => {
									return item.track.id;
								})
							);
						},
						function(err) {
							console.log(err);

							if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
						}
					)
			);
		},
		[ authToken, offset, playlistId ]
	);

	const switchPage = (ev) => {
		history.push(`/playlist_tracks?id=${playlistId}&page=${Number.isInteger(ev) ? ev : 1}`);
	};

	useEffect(
		() => {
			setPage(parseInt(query.get('page')));
		},
		[ query ]
	);

	useEffect(
		() => {
			if (authToken) {
				getData();
				getPlaylistName();

				setOffset(limit * (page - 1));
			}
		},
		[ authToken, page, getData, getPlaylistName ]
	);

	useEffect(() => {
		ReactGA.pageview('/playlist_tracks');
	});

	if (!authToken) return <Redirect to="/" />;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${playlistName} tracks - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section table-content">
					<LoadingSpinner />
					{!promiseInProgress &&
					playlistTracks.length > 0 && (
						<React.Fragment>
							{colapseTable ? (
								<TrackCards results={playlistTracks} />
							) : (
								<TrackTable results={playlistTracks} maxHeight={playlistTracks.length / limit * 100} />
							)}
							<Pagination
								activePage={page}
								itemsCountPerPage={limit}
								totalItemsCount={totalItems}
								pageRangeDisplayed={decreasePagination ? 3 : 8}
								onChange={switchPage}
							/>
						</React.Fragment>
					)}
					{!promiseInProgress &&
					playlistTracks.length === 0 && <NoContent mainText="This playlist doesn't have any songs..." />}
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs defaultIndex={1}>
						<TabList>
							<Tab>Search</Tab>
							<Tab>Go to</Tab>
						</TabList>

						<TabPanel>
							<Search />
						</TabPanel>
						<TabPanel>
							<Redirects exclude="" />
						</TabPanel>
					</Tabs>
				</div>
				<SideToggle
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default PlaylistTracks;
