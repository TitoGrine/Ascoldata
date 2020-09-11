import React, { useState, useEffect, useRef } from 'react';
import ReactGA from 'react-ga';
import HeaderBar from '../Common/HeaderBar';
import GitHubButton from 'react-github-btn';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import SideToggle from '../Common/SideToggle';
import { getRandomCharity } from '../Util/Charities';
import Redirects from '../Common/Redirects';

function About() {
	const history = useHistory();
	const loggedIn = localStorage.getItem('refreshToken');
	const [ toggled, setToggled ] = useState('nothing');
	const toggleButton = useRef(null);

	const redirectBack = () => {
		history.goBack();
	};

	useEffect(() => {
		ReactGA.pageview('/about');
	});

	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section
					className="content-section about-website"
					onClick={() => {
						if (toggled.localeCompare('toggled') === 0) toggleButton.current.click();
					}}
				>
					<h4>About the Website</h4>
					<p>
						Ascoldata is a website that grants users access to information and statistics about their
						Spotify's listening history. It also features relevant information about songs, albums, artists
						and playlists on Spotify and even allows users to request song recommendations, based on various
						attributes, using the{' '}
						<a
							href="https://developer.spotify.com/documentation/web-api/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Spotify API
						</a>.<br /> On an artist's page there is a link to it's Wikipedia page, if found, using the{' '}
						<a href="https://en.wikipedia.org/w/api.php" target="_blank" rel="noopener noreferrer">
							Wikipedia API
						</a>.<br /> On a song page there is a link to the Genius lyrics page, if found, using the{' '}
						<a href="https://genius.com/developers" target="_blank" rel="noopener noreferrer">
							Genius API
						</a>.<br />
						Check out your most listened songs and artists, or see new releases in various countries.<br />
						Explore and have fun!
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
					<strong>Ascoldata is in no way affiliated with neither Spotify, Wikipedia nor Genius.</strong>
					<h4>Technology</h4>
					<p>
						This website is built using React, bootstrapped using{' '}
						<a href="https://create-react-app.dev" target="_blank" rel="noopener noreferrer">
							create-react-app
						</a>. For making calls to the Spotify API it utilizes the{' '}
						<a
							href="https://github.com/JMPerez/spotify-web-api-js"
							target="_blank"
							rel="noopener noreferrer"
						>
							spotify-web-api-js
						</a>{' '}
						package and for the Wikipedia API the{' '}
						<a href="https://github.com/dijs/wiki" target="_blank" rel="noopener noreferrer">
							wikijs
						</a>{' '}
						package. It also uses {' '}
						<a
							href="https://firebase.google.com/products/functions/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Firebase Cloud Functions
						</a>{' '}
						for dealing with Spotify API authentication and token refreshing. It is currently being hosted
						on{' '}
						<a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
							Netlify
						</a>.
					</p>
					<p>
						For more information on how your data is used please check out the{' '}
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
					<h4>Contacts</h4>
					<p>
						{' '}
						If you discover a bug or have some question regarding this project, contact me through email at{' '}
						<a href="mailto:ascoldata@gmail.com">ascoldata@gmail.com</a>.
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
					<Tabs>
						<TabList>
							<Tab>Extra Info</Tab>
							{loggedIn && <Tab>Go to</Tab>}
						</TabList>
						<TabPanel className="extra-info">
							<p>
								Thankfully, for now, I can keep this website running without any sort of ads or
								donations.
							</p>
							<p>
								However, if you like the website, and want to make some contribution, make a donation to
								a charity!
							</p>
							<p>
								I'll randomly pick a good charity for you, here you go{' '}
								<span role="img" aria-label="Friendly emoji.">
									😊
								</span>
							</p>
							<form
								action={getRandomCharity()}
								onSubmit={(ev) => {
									ReactGA.event({
										category: 'Interaction',
										action: 'Clicked to go to charity!',
										label: 'Button Event'
									});
									ev.target.submit();
								}}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button type="submit" size="lg" className="heartbeat">
									<strong>Charity</strong>
								</Button>
							</form>
							<p>If you want you can also leave a star on the GitHub project repo or follow me.</p>
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
									Follow
								</GitHubButton>
							</div>
						</TabPanel>
						{loggedIn && (
							<TabPanel>
								<Redirects exclude="" />
							</TabPanel>
						)}
					</Tabs>
				</div>
				<SideToggle
					ref={toggleButton}
					toggleFunc={(state) => {
						setToggled(state);
					}}
				/>
			</div>
		</React.Fragment>
	);
}

export default About;
