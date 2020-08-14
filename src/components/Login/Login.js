import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import HeaderBar from '../HeaderBar';
import LoadingSpinner from '../LoadingSpinner';

class Login extends Component {
	constructor() {
		super();
		const params = this.getHashParams();

		if (params.access_token) {
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
					<HeaderBar />
					<div id="corporum">
						<section className="content-section">
							<div
								className="col d-flex flex-column align-items-center justify-content-center"
								style={{ height: '100%' }}
							>
								{!this.state.loginRequested && (
									<React.Fragment>
										<form
											action={process.env.REACT_APP_FIREBASE_LOGIN_FUNC}
											onSubmit={(ev) => {
												this.setState({
													loginRequested: true
												});
												ev.target.submit();
											}}
										>
											<Button type="submit" size="lg" style={buttonStyle}>
												<strong>Log in with Spotify</strong>
											</Button>
										</form>
										<p style={textStyle}>
											<strong>Please log in with your Spotify account.</strong>
											<br />
											No data from your Spotify account or activity is collected.
										</p>
									</React.Fragment>
								)}
								{this.state.loginRequested && (
									<React.Fragment>
										<p style={textStyle}>Waiting for Spotify...</p>
									</React.Fragment>
								)}
							</div>
						</section>
						<section className="sidebar-section slide-in-right sidebar-nothing" />
					</div>
				</React.Fragment>
			);
		} else {
			return <Redirect to="/" />;
		}
	}
}

const textStyle = {
	padding: '1.2em 0.5em',
	fontWeight: '400',
	fontSize: '1.3em',
	textAlign: 'center'
};

const buttonStyle = {
	padding: '0.6em 1.4em',
	fontSize: '1.3rem',
	fontWeight: '400',
	backgroundColor: 'var(--color-primary)',
	color: 'var(--color-neutral)',
	borderWidth: '0'
};

export default Login;
