import React, { useState } from 'react';
import { Navbar, Nav, Modal, Button } from 'react-bootstrap';
import logo from '../../assets/images/logo1.png';

import { clearStorage } from '../Auth/Auth';
import { useHistory } from 'react-router-dom';

function HeaderBar(props) {
	const history = useHistory();
	const [ confirmModal, setConfirmModal ] = useState(false);

	const logOut = () => {
		clearStorage();
		history.replace('/');
	};

	const getLoginState = () => {
		if (localStorage.getItem('refreshToken') !== null) {
			return <Nav.Link onClick={() => setConfirmModal(true)}>Log Out</Nav.Link>;
		}
	};

	return (
		<React.Fragment>
			<Navbar id="navbar" expand="sm">
				<Navbar.Brand href="/">
					<img src={logo} id="header_logo" alt="Ascoldata's logo." />
					Ascoldata
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Link href="/about">About</Nav.Link>
						{getLoginState()}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<Modal className="confirmation-modal" show={confirmModal} onHide={() => setConfirmModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Log Out</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to log out?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setConfirmModal(false)}>
						No
					</Button>
					<Button variant="primary" onClick={logOut}>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
}

export default HeaderBar;
