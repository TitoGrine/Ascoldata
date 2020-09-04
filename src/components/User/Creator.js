import React, { useState, useEffect, useCallback } from 'react';
import ReactGA from 'react-ga';
import { Image } from 'react-bootstrap';
import { Textfit } from 'react-textfit';
import Spotify from 'spotify-web-api-js';
import { Link } from 'react-router-dom';
import default_image from '../../assets/images/default_pic.png';
import { refreshToken } from '../Auth/Auth';

const spotifyWebApi = new Spotify();

function Creator(props) {
	const [ creatorPlaylists, setCreatorPlaylists ] = useState(0);
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));

	const getPlaylists = useCallback(
		() => {
			spotifyWebApi
				.getUserPlaylists(props.info.id, {
					limit: 1
				})
				.then(
					function(data) {
						setCreatorPlaylists(data.total);
					},
					function(err) {
						console.log(err);

						if (err.status === 401) refreshToken((new_token) => setAuthToken(new_token));
					}
				);
		},
		[ props ]
	);

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);
				getPlaylists();
			}
		},
		[ authToken, getPlaylists ]
	);

	return (
		<div className="playlist-creator">
			<Image src={props.info.images.length > 0 ? props.info.images[0].url : default_image} thumbnail />
			<iframe
				src={`https://open.spotify.com/follow/1/?uri=${props.info.uri}&size=basic&theme=light&show-count=0`}
				width="95"
				height="25"
				scrolling="no"
				frameBorder="0"
				title="follow_user"
				style={{ border: 'none', overflow: 'hidden' }}
				allowtransparency="true"
			/>
			<Textfit mode="single" min={10} max={28} className="creator-name">
				<strong>· {props.info.display_name} ·</strong>
			</Textfit>
			<div>
				Followers: <strong>{props.info.followers.total}</strong>
			</div>
			<div>
				Playlists:{' '}
				<Link to={`/creator_playlists?id=${props.info.id}&page=${1}`} style={{ color: 'var(--color-primary)' }}>
					{creatorPlaylists}
				</Link>
			</div>
			<a
				href={props.info.external_urls.spotify}
				target="_blank"
				rel="noopener noreferrer"
				className="inner-link"
				onClick={() => {
					ReactGA.event({
						category: 'Interaction',
						action: 'Clicked on Spotify link for creator.',
						label: 'Link Event'
					});
				}}
			>
				Go to Spotify page.
			</a>
		</div>
	);
}

export default Creator;
