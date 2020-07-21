import React, { useState, useEffect } from 'react';
import './Top.css';
import { Link } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';

import HeaderBar from '../../HeaderBar';

const spotifyWebApi = new Spotify();

function Top() {
	const [ madeCall, setMadeCall ] = useState(false);
	const [ topResults, setTopResults ] = useState([]);

	useEffect(() => {
		if (madeCall) return;

		setMadeCall(true);
		const authToken = sessionStorage.getItem('authToken');

		if (authToken) {
            spotifyWebApi.setAccessToken(authToken);

			spotifyWebApi.getMyTopTracks().then(
				function(data) {
					console.log(data.items);
					setTopResults(data.items);
				},
				function(err) {
					console.log(err);

					const headers = {
						refresh_token: sessionStorage.getItem('refreshToken')
					};

					axios.get('http://localhost:8000/refresh_token', { params: headers }).then(
						(response) => {
							console.log(response.data);

                            sessionStorage.setItem('authToken', response.data.access_token);
                            
                            window.location.reload();
						}
					);
				}
			);
		}
	});

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<table>
						<tbody>
							<tr>
								<th>Artist</th>
								<th>Followers</th>
								<th>Genre</th>
								<th>Popularity</th>
							</tr>
						</tbody>
					</table>
				</section>
				<section className="sidebar-section slide-in-right">
					<div className="side-content">
						<div className="sidebar-tabs">
							<button> Check Out</button>
						</div>
						<ul className="redirects">
							<li>
								{' '}
								<Link to="/top">Top</Link>{' '}
							</li>
							<li>
								{' '}
								<Link to="/">Playlists</Link>{' '}
							</li>
						</ul>
					</div>
				</section>
			</div>
		</React.Fragment>
	);
}

export default Top;
