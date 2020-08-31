import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

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

export default Login;
