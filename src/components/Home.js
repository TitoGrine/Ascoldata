import React from 'react';

import HeaderBar from './HeaderBar';
import GeneralInfo from './General/GeneralInfo';
import Login from './Login/Login';

function Home() {
	return (
		<React.Fragment>
			<HeaderBar />
			{localStorage.getItem('refreshToken') !== null ? <GeneralInfo /> : <Login />}
		</React.Fragment>
	);
}

export default Home;
