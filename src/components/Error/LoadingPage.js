import React from 'react';
import logo from '../../assets/images/logo.svg';

function LoadingPage() {
	return (
		<div id="loading-page">
			<div id="logo-container">
				<img src={logo} id="loading-logo" alt="Ascoldata's logo." />
			</div>
		</div>
	);
}

export default LoadingPage;
