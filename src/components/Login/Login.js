import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Redirect, Link } from 'react-router-dom';
import { Button, Carousel } from 'react-bootstrap';
import your_stats from '../../assets/images/preview_images/your_stats.png';
import find_songs from '../../assets/images/preview_images/find_songs.png';
import album_page from '../../assets/images/preview_images/album_page.png';
import artist_page from '../../assets/images/preview_images/artist_page.png';
import playlist_page from '../../assets/images/preview_images/playlist_page.png';
import track_page from '../../assets/images/preview_images/track_page.png';

import { addToDate } from '../Util/HelperFunc';

import HeaderBar from '../Common/HeaderBar';
import { Helmet } from 'react-helmet';

class Login extends Component {
	constructor() {
		super();
		const params = this.getHashParams();

		if (params.access_token) {
			let expirationDate = addToDate(new Date(), 48);
			let bufferDate = addToDate(new Date(), 0, 2);

			localStorage.setItem('expirationDate', expirationDate.getTime());
			localStorage.setItem('bufferDate', bufferDate.getTime());
			localStorage.setItem('authToken', params.access_token);
			localStorage.setItem('refreshToken', params.refresh_token);
		}

		this.state = {
			loginRequested: false
		};
	}

	getHashParams() {
		var hashParams = {};
		var e,
			r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ((e = r.exec(q))) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	render() {
		if (!localStorage.getItem('refreshToken')) {
			return (
				<React.Fragment>
					<Helmet>
						<title>Ascoldata</title>
					</Helmet>
					<HeaderBar />
					<div id="corporum">
						<section className="content-section login-section">
							<Carousel interval={4000} controls={false} pause={false}>
								<Carousel.Item>
									<img className="d-block" src={your_stats} alt="User stats preview." />
									<Carousel.Caption>
										<p>Gain insights on your music taste!</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<img className="d-block" src={find_songs} alt="Find songs preview." />
									<Carousel.Caption>
										<p>Search for songs using various attributes and save them to a playlist!</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<img
										className="d-block"
										src={artist_page}
										alt="Artist page preview (Selena Gomez)."
									/>
									<Carousel.Caption>
										<p>Get information about artists...</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<img
										className="d-block"
										src={album_page}
										alt="Album page preview (Thriller by Michael Jackson)."
									/>
									<Carousel.Caption>
										<p>... albums ...</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<img
										className="d-block"
										src={track_page}
										alt="Song page preview (Perfect by Ed Sheeran)."
									/>
									<Carousel.Caption>
										<p>... songs ...</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<img
										className="d-block"
										src={playlist_page}
										alt="Playlist page preview (Today's Top Hits)."
									/>
									<Carousel.Caption>
										<p>... and even playlists!</p>
									</Carousel.Caption>
								</Carousel.Item>
							</Carousel>
						</section>
						<section className="sidebar-section slide-in-right login-sidebar" />
						<div className="side-content slide-in-right request-login">
							{!this.state.loginRequested && (
								<React.Fragment>
									<form
										action={process.env.REACT_APP_FIREBASE_LOGIN_FUNC}
										onSubmit={(ev) => {
											this.setState({
												loginRequested: true
											});
											ReactGA.event({
												category: 'Interaction',
												action: 'Clicked to login using Spotify.',
												label: 'Button Event'
											});
											ev.target.submit();
										}}
									>
										<Button type="submit" size="lg">
											<strong>Log in with Spotify</strong>
										</Button>
									</form>
									<p>
										By signing in you agree to our{' '}
										<Link to="/privacy_policy" className="inner-link">
											Privacy Policy
										</Link>
									</p>
								</React.Fragment>
							)}
							{this.state.loginRequested && (
								<React.Fragment>
									<p>Waiting for Spotify...</p>
								</React.Fragment>
							)}
						</div>
					</div>
				</React.Fragment>
			);
		} else {
			return <Redirect to="/" />;
		}
	}
}

export default Login;
