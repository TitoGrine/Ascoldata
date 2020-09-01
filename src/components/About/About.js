import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import HeaderBar from '../Common/HeaderBar';
import GitHubButton from 'react-github-btn';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import logo from '../../assets/images/logo.svg';

import SideToggle from '../Common/SideToggle';

function About() {
	const history = useHistory();
	const [ toggled, setToggled ] = useState('nothing');

	const redirectBack = () => {
		history.push('/');
	};

	useEffect(() => {
		ReactGA.pageview('/about');
	});

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section about-website">
					<h4>About the Website</h4>
					<p>
						Ascoldata is a website that allows users to get access to information and statistics about their
						Spotify's listening history. It also gives information about songs, albums, artists and
						playlists on Spotify and even allows users to request song recommendations using Spotify's API.
						Explore your favourite songs and artists and maybe discover some interesting patterns in your
						listening habits.
					</p>
					<p>
						The idea for Ascoldata came when I wanted to explore APIs and build something as a summer
						project and remembered seeing this awesome website{' '}
						<a href="https://musictaste.space" target="_blank" rel="noopener noreferrer">
							musictaste.space
						</a>{' '}
						(you should really check it out!), which inspired me to use Spotify's API and see what I could
						do.
					</p>
					<h4>Technology</h4>
					<p>
						This website is built using React, bootstrapped using{' '}
						<a href="https://create-react-app.dev" target="_blank" rel="noopener noreferrer">
							create-react-app
						</a>. It uses {' '}
						<a
							href="https://firebase.google.com/products/functions/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Firebase Cloud Functions
						</a>{' '}
						for dealing with Spotify API OAuth2 authentication and token refreshing. It is currently hosted
						using{' '}
						<a href="" target="_blank" rel="noopener noreferrer">
							Netlify
						</a>.
					</p>
					<p>
						If you want more information on how your data is used please check out our{' '}
						<Link to="/privacy_policy" className="inner-link">
							Privacy Policy
						</Link>{' '}
						page.
					</p>
					<p>
						Besides the Firebase functions that, for security reasons, are kept private, the code is public
						and avaliable on GitHub{' '}
						<a href="https://github.com/TitoGrine/Ascoldata" target="_blank" rel="noopener noreferrer">
							here
						</a>.
					</p>
					<p>
						{' '}
						If you discover a bug or are interested in working on this project, contact me through email at
						(insert)
					</p>
					<Button
						className="go-back-button"
						size="lg"
						onClick={() => {
							redirectBack();
						}}
					>
						<strong>Go Back</strong>
					</Button>
				</section>
				<section className={`sidebar-section slide-in-right sidebar-${toggled}`} />
				<div className={`side-content slide-in-right sidebar-${toggled} about-sidebar`}>
					<img src={logo} className="logo" alt="Ascoldata's logo." />
					<p>Thankfully, for now, I can keep this website running without any sort of ads or donations.</p>
					<p>
						If you like the website and want to show some support, consider leaving a star on the GitHub
						project repo.
					</p>
					<p>If you want, feel free to follow me as well 😄!</p>
					<div className="github-buttons">
						<GitHubButton
							href="https://github.com/TitoGrine/Ascoldata"
							data-color-scheme="no-preference: dark; light: dark; dark: dark;"
							data-icon="octicon-star"
							data-size="large"
							data-show-count="true"
							aria-label="Star TitoGrine/Ascoldata on GitHub"
						>
							Star
						</GitHubButton>
						<GitHubButton
							href="https://github.com/TitoGrine"
							data-color-scheme="no-preference: dark; light: dark; dark: dark;"
							data-size="large"
							aria-label="Follow @TitoGrine on GitHub"
						>
							Follow Me
						</GitHubButton>
					</div>
				</div>
				<SideToggle
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default About;
