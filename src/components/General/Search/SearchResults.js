import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';

import { refreshToken } from '../../Auth/Auth';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import TrackTable from '../Track/TrackTable';
import Pagination from 'react-js-pagination';
import ArtistTable from '../Artist/ArtistTable';
import PlaylistTable from '../Playlist/PlaylistTable';
import Search from './Search';
import AlbumTable from '../Album/AlbumTable';

const spotifyWebApi = new Spotify();

function SearchResults() {
	const authToken = sessionStorage.getItem('authToken');
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;

	const q = query.get('q');
	const type = query.get('type');

	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ results, setResults ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const getData = async () => {
		spotifyWebApi.setAccessToken(authToken);

		spotifyWebApi
			.search(q, [ type ], {
				limit: limit,
				offset: offset
			})
			.then(
				function(data) {
					console.log(data);
					setResults(data[`${type}s`].items);
					setTotalItems(data[`${type}s`].total);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken();
				}
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
		[ offset ]
	);

	useEffect(
		() => {
			history.push(`/search?q=${q}&type=${type}&page=${page}`);
		},
		[ page ]
	);

	const renderTable = () => {
		console.log('Mamma mia');

		if (results.length === 0)
			return;

		switch (type) {
			case 'artist':
				return <ArtistTable results={results} />;
			case 'album':
				return <AlbumTable results={results} />;
			case 'playlist':
				return <PlaylistTable results={results} />;
			case 'track':
				return <TrackTable results={results} />;
			default:
				return;
		}
	};

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum" className="playlists-content">
				<section className="content-section slide-in-left">
					{renderTable()}
					<div className="pagination-divider" />
					<Pagination
						activePage={page}
						itemsCountPerPage={limit}
						totalItemsCount={totalItems}
						pageRangeDisplayed={8}
						onChange={switchPage}
					/>
				</section>
				<section className="sidebar-section slide-in-right">
					<div className="side-content">
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
				</section>
			</div>
		</React.Fragment>
	);
}

export default SearchResults;
