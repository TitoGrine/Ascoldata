import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

import User from './User/User';
import Login from './Login/Login';

function Home() {
	useEffect(() => {
		ReactGA.pageview('/');
	});

	return localStorage.getItem('refreshToken') ? <User /> : <Login />;
}

export default Home;
