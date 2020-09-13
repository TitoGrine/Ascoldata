import React, { useState, useRef } from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Login() {
	const [ loginRequested, setLoginRequested ] = useState(false);
	const inputRef = useRef(null);
	const [ loginLink ] = useState(
		process.env.REACT_APP_MODE.localeCompare('testing') === 0
			? process.env.REACT_APP_TEST_FIREBASE_LOGIN_FUNC
			: process.env.REACT_APP_FIREBASE_LOGIN_FUNC
	);

	return (
		<div className="side-content slide-in-right request-login">
			{!loginRequested && (
				<React.Fragment>
					<form action={loginLink}>
						<input type="submit" id="login_submit" ref={inputRef} style={{ display: 'none' }} />
						<Button
							type="submit"
							size="lg"
							onClick={(ev) => {
								ReactGA.event({
									category: 'Interaction',
									action: 'Clicked to login using Spotify.',
									label: 'Button Event'
								});

								setLoginRequested(true);
								inputRef.current.click();
							}}
						>
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
			{loginRequested && (
				<React.Fragment>
					<p>Waiting for Spotify...</p>
				</React.Fragment>
			)}
		</div>
	);
}

export default Login;
