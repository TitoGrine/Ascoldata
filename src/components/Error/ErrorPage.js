import React from 'react';
import { Helmet } from 'react-helmet';

import logo from '../../assets/images/logo.svg';
import HeaderBar from '../Common/HeaderBar';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function ErrorPage(props) {
	const history = useHistory();

	const redirectHome = () => {
		history.push('/');
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${props.errorCode} ${props.errorShort} - Ascoldata`}</title>
			</Helmet>
			<HeaderBar />
			<div id="page-error-content">
				<img src={logo} id="error-logo" alt="Ascoldata's logo." />
				<strong>{`${props.errorCode} ${props.errorShort}`}</strong>
				{props.errorDescription}
				<Button
					className="return-home-button"
					size="lg"
					onClick={() => {
						redirectHome();
					}}
				>
					<strong>Return Home</strong>
				</Button>
			</div>
		</React.Fragment>
	);
}

export default ErrorPage;
