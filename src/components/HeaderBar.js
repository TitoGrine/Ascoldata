import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap';

class HeaderBar extends Component {
    render() {
        return (
            <Navbar expand="lg" style={ navStyle }>
                <Navbar.Brand href="/" style={ linkStyle }><strong>Spotify Stats</strong></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav >
                        <Nav.Link href="/" style={ linkStyle }>Home</Nav.Link>
                        <Nav.Link href="/login" style={ linkStyle }>Login</Nav.Link>
                        <Nav.Link href="/top_tracks" style={ linkStyle }>Top</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const linkStyle = {
    color: '#191414'
}

const navStyle = {
    backgroundColor: '#1DB954'
}

export default HeaderBar;