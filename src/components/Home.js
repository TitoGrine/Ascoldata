import React from 'react';

import HeaderBar from './HeaderBar';
import GeneralInfo from './General/GeneralInfo';
import Login from './Login/Login';

function Home() {
	return localStorage.getItem('refreshToken') !== null ? <GeneralInfo /> : <Login />;
}

export default Home;
