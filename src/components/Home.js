import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

import User from './User/User';
import Showcase from './Showcase';

function Home() {
	useEffect(() => {
		ReactGA.pageview('/');
	});

	return localStorage.getItem('refreshToken') ? <User /> : <Showcase />;
}

export default Home;
