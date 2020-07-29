import React, { useState, useEffect } from 'react';
import './UserPlaylists.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, useHistory } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';

import { refreshToken } from '../../Auth/TokenFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import PlaylistTableRow from './PlaylistTableRow';
import Pagination from 'react-js-pagination';

const spotifyWebApi = new Spotify();

function UserPlaylists() {
	const authToken = sessionStorage.getItem('authToken');
	const query = new URLSearchParams(useLocation().search);
	const history = useHistory();
	const limit = 12;
	
	const [ page, setPage ] = useState(parseInt(query.get('page')));
	const [ userPlaylists, setUserPlaylists ] = useState([]);
	const [ offset, setOffset ] = useState(limit * (page - 1));
	const [ totalItems, setTotalItems ] = useState(0);

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		spotifyWebApi
			.getUserPlaylists({
				limit: limit,
				offset: offset
			})
			.then(
				function(data) {
					//console.log(data);
					setUserPlaylists(data.items);
					setTotalItems(data.total);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken();
				}
			);
	};

	const switchPage = (ev) => {
		if(Number.isInteger(ev)){
			setOffset(limit * (ev - 1))
		}
	};

	useEffect(
		() => {
			if (authToken) {
				getData();
				setPage(1 + (offset / limit));
			}
		},
		[ offset ]
	);

	useEffect(
		() => {
			history.push(`/playlists?page=${page}`);
		}, 
		[ page ]
	)

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum" className="playlists-content">
				<section className="content-section slide-in-left">
					<table>
						<thead>
							<tr>
								<th>Playlist</th>
								<th>Public</th>
								<th>Collaborative</th>
								<th>Nr. Songs</th>
							</tr>
						</thead>
						<tbody>
							{userPlaylists.map((result) => {
								return <PlaylistTableRow key={result.id} info={result} />;
							})}
						</tbody>
					</table>
					<div className="pagination-divider"></div>
					<Pagination
						activePage={page}
						itemsCountPerPage={limit}
						totalItemsCount={totalItems}
						pageRangeDisplayed={(totalItems / limit > 15) ? 10 : 5}
						onChange={switchPage}
					/>
				</section>
				<section className="sidebar-section slide-in-right">
					<div className="side-content">
						<Tabs>
							<TabList>
								<Tab>Go to</Tab>
							</TabList>

							<TabPanel>
								<Redirects exclude="playlists" />
							</TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

export default UserPlaylists;
