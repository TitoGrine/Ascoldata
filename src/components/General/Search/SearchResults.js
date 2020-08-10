import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import { useMediaQuery } from 'react-responsive';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import { refreshToken } from '../../Auth/Auth';

import Redirects from '../../Redirects';
import TrackTable from '../Track/TrackTable';
import Pagination from 'react-js-pagination';
import ArtistTable from '../Artist/ArtistTable';
import PlaylistTable from '../Playlist/PlaylistTable';
import Search from './Search';
import AlbumTable from '../Album/AlbumTable';
import SideToggle from '../../SideToggle';
import TrackCards from '../Track/TrackCards';
import AlbumCards from '../Album/AlbumCards';
import ArtistCards from '../Artist/ArtistCards';
import PlaylistCards from '../Playlist/PlaylistCards';
import HeaderBar from '../../HeaderBar';
import LoadingSpinner from '../../LoadingSpinner';
import { Helmet } from 'react-helmet';

const spotifyWebApi = new Spotify();

function SearchResults() {
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const q = query.get('q');
	const type = query.get('type');

	const [ toggled, setToggled ] = useState('nothing');
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ results, setResults ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const colapseTable = useMediaQuery({ maxWidth: 700 });
	const decreasePagination = useMediaQuery({ maxWidth: 500 });

	const { promiseInProgress } = usePromiseTracker();

	const getData = async () => {
		spotifyWebApi.setAccessToken(authToken);

		trackPromise(
			spotifyWebApi
				.search(q, [ type ], {
					limit: limit,
					offset: offset
				})
				.then(
					function(data) {
						// console.log(data);
						setResults(data[`${type}s`].items);
						setTotalItems(data[`${type}s`].total);
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
			history.push(`/search?q=${q}&type=${type}&page=${page}`);
		},
		[ page ]
	);

	const renderTable = () => {
		if (results.length === 0) return;

		switch (type) {
			case 'artist':
				return colapseTable ? <ArtistCards results={results} /> : <ArtistTable results={results} />;
			case 'album':
				return colapseTable ? <AlbumCards results={results} /> : <AlbumTable results={results} />;
			case 'playlist':
				return colapseTable ? <PlaylistCards results={results} /> : <PlaylistTable results={results} />;
			case 'track':
				return colapseTable ? <TrackCards results={results} /> : <TrackTable results={results} />;
			default:
				return;
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${q} - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum" className="playlists-content">
				<section className="content-section">
					<LoadingSpinner />
					{!promiseInProgress && renderTable()}
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

export default SearchResults;
