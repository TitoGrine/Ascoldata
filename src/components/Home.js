import React from 'react';

import HeaderBar from './Common/HeaderBar';
import User from './User/User';
import Login from './Login/Login';

function Home() {
	return localStorage.getItem('refreshToken') !== null ? <User /> : <Login />;
}

export default Home;
