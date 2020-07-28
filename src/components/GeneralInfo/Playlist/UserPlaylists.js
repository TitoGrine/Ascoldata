import React, { useState, useEffect } from 'react';
import './UserPlaylists.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';

import { refreshToken } from '../../Auth/TokenFunc';

import HeaderBar from '../../HeaderBar';
import Redirects from '../../Redirects';
import PlaylistTableRow from './PlaylistTableRow';

const spotifyWebApi = new Spotify();

function UserPlaylists() {
	const authToken = sessionStorage.getItem('authToken');
	const [ userPlaylists, setUserPlaylists ] = useState([]);
	const [ offset, setOffset ] = useState(0);

	const getData = () => {
		spotifyWebApi.setAccessToken(authToken);

		spotifyWebApi
			.getUserPlaylists({
				limit: 20,
				offset: offset
			})
			.then(
				function(data) {
					console.log(data);
					setUserPlaylists(data.items);
				},
				function(err) {
					console.log(err);

					if (err.status === 401) refreshToken();
				}
			);
	};

	useEffect(
		() => {
			if (authToken && userPlaylists.length === 0) {
				getData();
			}
		},
		[ authToken ]
	);

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
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
