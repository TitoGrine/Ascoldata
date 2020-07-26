import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap';

class HeaderBar extends Component {
    render() {
        return (
            <Navbar id='navbar' expand="lg">
                <Navbar.Brand href="/" >Ascoldata</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav >
                        <Nav.Link href="/" >Home</Nav.Link>
                        <Nav.Link href="/about" >About</Nav.Link>
                        <Nav.Link href="/login" >Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}


export default HeaderBar;