import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Spotify from 'spotify-web-api-js';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../Auth/Auth';
import { useMediaQuery } from 'react-responsive';

import Redirects from '../Redirects';
import Search from '../Search/Search';
import SideToggle from '../SideToggle';
import TrackCards from '../Track/TrackCards';
import TrackTable from '../Track/TrackTable';
import HeaderBar from '../HeaderBar';
import LoadingSpinner from '../LoadingSpinner';
import { Helmet } from 'react-helmet';

const spotifyWebApi = new Spotify();

function AlbumTracks() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const albumId = query.get('id');
	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ albumName, setAlbumName ] = useState('');
	const [ albumTracks, setAlbumTracks ] = useState([]);
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const { promiseInProgress } = usePromiseTracker();

	const getAlbumTracks = (tracks) => {
		trackPromise(
			spotifyWebApi.getTracks(tracks).then(
				function(data) {
					// console.log(data);
					setAlbumTracks(data.tracks);
					setAlbumName(data.tracks.length > 0 ? data.tracks[0].album.name : '');
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
				}
			)
		);
	};

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		trackPromise(
			spotifyWebApi
				.getAlbumTracks(albumId, {
					limit: limit,
					offset: offset
				})
				.then(
					function(data) {
						// console.log(data);
						setTotalItems(data.total);
						getAlbumTracks(
							data.items.map((item) => {
								return item.id;
							})
						);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				)
		);
	};

	const switchPage = (ev) => {
		if (Number.isInteger(ev)) {
			setOffset(limit * (ev - 1));
		}
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
				setPage(1 + offset / limit);
			}
		},
		[ authToken, offset ]
	);

	useEffect(
		() => {
			history.push(`/album_tracks?id=${albumId}&page=${page}`);
		},
		[ page ]
	);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${albumName} tracks - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress &&
						albumTracks.length > 0 &&
						(colapseTable ? <TrackCards results={albumTracks} /> : <TrackTable results={albumTracks} />)}
					<div className="pagination-divider" />
					<Pagination
						activePage={page}
						itemsCountPerPage={limit}
						totalItemsCount={totalItems}
						pageRangeDisplayed={decreasePagination ? 3 : 8}
						onChange={switchPage}
					/>
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled}`}>
					<Tabs>
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

export default AlbumTracks;
