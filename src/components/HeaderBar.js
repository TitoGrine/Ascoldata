import React, { useState } from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';

function HeaderBar() {
	const [ profilePicture ] = useState(sessionStorage.getItem('profile-picture'));

	const getLoginState = () => {
		if (sessionStorage.getItem('refreshToken') !== null) {
			return (
				<Nav.Link href="/">
					<div id="image">
						<Image style={profileStyle} src={profilePicture} roundedCircle />
					</div>
				</Nav.Link>
			);
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

const profileStyle = {
	width: '50px',
	height: '50px'
};

export default HeaderBar;
