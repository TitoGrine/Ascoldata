import React, { useState, useEffect } from 'react';
import './Top.css';
import { Link } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';
import axios from 'axios';

import HeaderBar from '../../HeaderBar';
import TableRow from './TableRow';

const spotifyWebApi = new Spotify();

function Top() {
	const [ madeCall, setMadeCall ] = useState(false);
    const [ topResults, setTopResults ] = useState([]);

    const authToken = sessionStorage.getItem('authToken');
    
    const getData = () => {
        spotifyWebApi.setAccessToken(authToken);

        spotifyWebApi.getMyTopArtists({
            limit: 15
        }).then(
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

	useEffect(() => {
		if (madeCall) return;

		setMadeCall(true);

		if (authToken) {
            getData();
		}
	});

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section slide-in-left">
					<table>
                        <thead>
                            <tr>
								<th>Artist</th>
								<th>Followers</th>
								<th>Genre</th>
								<th>Popularity</th>
							</tr>
                        </thead>
						<tbody>
                            { topResults.map((result) => {
                                return <TableRow info={ result }/>
                            }) }
						</tbody>
					</table>
				</section>
				<section className="sidebar-section slide-in-right">
					<div className="side-content">
						<div className="sidebar-tabs">
							<button>Go to</button>
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
