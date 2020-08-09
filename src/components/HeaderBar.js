import React, { useState } from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';

import { clearStorage } from './Auth/Auth';
import { useHistory } from 'react-router-dom';

function HeaderBar(props) {
	const history = useHistory();

	const logOut = () => {
		clearStorage();
		history.replace('/');
	};

	const getLoginState = () => {
		if (localStorage.getItem('refreshToken') !== null) {
			return <Nav.Link onClick={logOut}>Log Out</Nav.Link>;
		}
	};

	return (
		<Navbar id="navbar" expand="lg">
			<Navbar.Brand href="/">Ascoldata</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
				<Nav>
					<Nav.Link href="/about">About</Nav.Link>
					{getLoginState()}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default HeaderBar;
