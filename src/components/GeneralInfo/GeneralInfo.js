import React, { useState, useEffect } from 'react';
import './GeneralInfo.css';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

function GeneralInfo() {
	const [ user, setUser ] = useState('');
	const [ id, setId ] = useState('');
	const [ image, setImage ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ country, setCountry ] = useState('');
	const [ followers, setFollowers ] = useState('');
	const [ product, setProduct ] = useState('');
	const [ link, setLink ] = useState('');
	const [ uri, setURI ] = useState('');

	useEffect(() => {
		const authToken = sessionStorage.getItem('authToken');

		if (authToken && user === '') {
			spotifyWebApi.setAccessToken(authToken);

			spotifyWebApi.getMe().then(
				function(data) {
					setUser(data.display_name);
					setImage(data.images[0].url);
					setId(data.id);
					setEmail(data.email);
					setCountry(data.country);
					setFollowers(data.followers.total);
					setProduct(data.product);
					setLink(data.external_urls.spotify);
					setURI(data.uri);
				},
				function(err) {
					console.log("Oof that's no bueno.");
				}
			);
		}
	});

	return (
		<div id="corporum">
			<section className="content-section slide-in-left">
				<div id="profile-info">
					<h2>
						{' '}
						· Hello <strong>{user}</strong> ·
					</h2>
					<div id="info">
						<div id="image">
							<Image src={image} thumbnail />
						</div>
						<ul>
							<li>
								{' '}
								<strong>ID:</strong> {id}
							</li>
							<li>
								{' '}
								<strong>Email:</strong> {email}
							</li>
							<li>
								{' '}
								<strong>Country:</strong> {country}
							</li>
							<li>
								{' '}
								<strong>Subscription:</strong> {product}
							</li>
							<li>
								{' '}
								<strong>No. followers:</strong> {followers}
							</li>
							<li>
								{' '}
								<strong>Spotify link:</strong> {link}
							</li>
							<li>
								{' '}
								<strong>Spotify URI:</strong> {uri}
							</li>
						</ul>
					</div>
				</div>
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
	);
}

export default GeneralInfo;
