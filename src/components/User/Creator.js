import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { Textfit } from 'react-textfit';
import Spotify from 'spotify-web-api-js';
import { Link } from 'react-router-dom';

const spotifyWebApi = new Spotify();

function Creator(props) {
	const [ creatorPlaylists, setCreatorPlaylists ] = useState(0);
	const [ authToken, setAuthToken ] = useState(localStorage.getItem('authToken'));

	const getPlaylists = () => {
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
				}
			);
	};

	useEffect(
		() => {
			if (authToken) {
				spotifyWebApi.setAccessToken(authToken);
				getPlaylists();
			}
		},
		[ authToken ]
	);

	return (
		<div className="playlist-creator">
			<Image src={props.info.images.length > 0 ? props.info.images[0].url : ''} thumbnail />
			<iframe
				src={`https://open.spotify.com/follow/1/?uri=${props.info.uri}&size=basic&theme=light&show-count=0`}
				width="95"
				height="25"
				scrolling="no"
				frameBorder="0"
				style={{ border: 'none', overflow: 'hidden' }}
				allowtransparency="true"
			/>
			<Textfit mode="single" min={20} max={30}>
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
			<a href={props.info.external_urls.spotify} target="_blank" className="inner-link">
				Go to Spotify page.
			</a>
		</div>
	);
}

export default Creator;
