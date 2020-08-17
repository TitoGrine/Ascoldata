import React from 'react';

import User from './User/User';
import Login from './Login/Login';

function Home() {
	return localStorage.getItem('refreshToken') ? <User /> : <Login />;
}

export default Home;
