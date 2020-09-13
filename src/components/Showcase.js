import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import MediaQuery from 'react-responsive';
import { Helmet } from 'react-helmet';

import your_stats from '../assets/images/preview_images/your_stats.png';
import your_stats_mobile from '../assets/images/preview_images/your_stats_mobile.png';
import find_songs from '../assets/images/preview_images/find_songs.png';
import find_songs_mobile from '../assets/images/preview_images/find_songs_mobile.png';
import album_page from '../assets/images/preview_images/album_page.png';
import album_page_mobile from '../assets/images/preview_images/album_page_mobile.png';
import artist_page from '../assets/images/preview_images/artist_page.png';
import artist_page_mobile from '../assets/images/preview_images/artist_page_mobile.png';
import playlist_page from '../assets/images/preview_images/playlist_page.png';
import playlist_page_mobile from '../assets/images/preview_images/playlist_page_mobile.png';
import track_page from '../assets/images/preview_images/track_page.png';
import track_page_mobile from '../assets/images/preview_images/track_page_mobile.png';

import { setTokens } from './Auth/Auth';
import HeaderBar from './Common/HeaderBar';
import Login from './Login/Login';

class Showcase extends Component {
	constructor() {
		super();
		const params = this.getHashParams();

		if (params.access_token) setTokens(params);
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
						<section className="content-section showcase-section">
							<Carousel interval={4000} controls={false} pause={false}>
								<Carousel.Item>
									<MediaQuery minWidth={501}>
										<img className="d-block" src={your_stats} alt="User stats preview." />
									</MediaQuery>
									<MediaQuery maxWidth={500}>
										<img className="d-block" src={your_stats_mobile} alt="User stats preview." />
									</MediaQuery>
									<Carousel.Caption>
										<p>Gain insights on your music taste!</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<MediaQuery minWidth={501}>
										<img className="d-block" src={find_songs} alt="Find songs preview." />
									</MediaQuery>
									<MediaQuery maxWidth={500}>
										<img className="d-block" src={find_songs_mobile} alt="Find songs preview." />
									</MediaQuery>
									<Carousel.Caption>
										<p>Search for songs using various attributes and save them to a playlist!</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<MediaQuery minWidth={501}>
										<img
											className="d-block"
											src={artist_page}
											alt="Artist page preview (Selena Gomez)."
										/>
									</MediaQuery>
									<MediaQuery maxWidth={500}>
										<img
											className="d-block"
											src={artist_page_mobile}
											alt="Artist page preview (Selena Gomez)."
										/>
									</MediaQuery>
									<Carousel.Caption>
										<p>Get information about artists...</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<MediaQuery minWidth={501}>
										<img
											className="d-block"
											src={album_page}
											alt="Album page preview (Thriller by Michael Jackson)."
										/>
									</MediaQuery>
									<MediaQuery maxWidth={500}>
										<img
											className="d-block"
											src={album_page_mobile}
											alt="Album page preview (Thriller by Michael Jackson)."
										/>
									</MediaQuery>

									<Carousel.Caption>
										<p>... albums ...</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<MediaQuery minWidth={501}>
										<img
											className="d-block"
											src={track_page}
											alt="Song page preview (Perfect by Ed Sheeran)."
										/>
									</MediaQuery>
									<MediaQuery maxWidth={500}>
										<img
											className="d-block"
											src={track_page_mobile}
											alt="Song page preview (Perfect by Ed Sheeran)."
										/>
									</MediaQuery>
									<Carousel.Caption>
										<p>... songs ...</p>
									</Carousel.Caption>
								</Carousel.Item>
								<Carousel.Item>
									<MediaQuery minWidth={501}>
										<img
											className="d-block"
											src={playlist_page}
											alt="Playlist page preview (Today's Top Hits)."
										/>
									</MediaQuery>
									<MediaQuery maxWidth={500}>
										<img
											className="d-block"
											src={playlist_page_mobile}
											alt="Playlist page preview (Today's Top Hits)."
										/>
									</MediaQuery>
									<Carousel.Caption>
										<p>... and even playlists!</p>
									</Carousel.Caption>
								</Carousel.Item>
							</Carousel>
						</section>
						<section className="sidebar-section slide-in-right login-sidebar" />
						<Login />
					</div>
				</React.Fragment>
			);
		} else {
			return <Redirect to="/" />;
		}
	}
}

export default Showcase;
