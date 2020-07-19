import React, { Component, useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js';
import { Container, Row, Col, Image } from 'react-bootstrap';

import HeaderBar from '../HeaderBar';
import LoginWarning from '../LoginWarning';

const spotifyWebApi = new Spotify();

function Home() {

    const [user, setUser] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');

        if(authToken){
            spotifyWebApi.setAccessToken(authToken);

            spotifyWebApi.getMe()
                .then((response) => {
                    console.log(response.images[0].url);
                    setUser(response.display_name)
                    setImage(response.images[0].url)
                });
        }
    });

    if(user != ''){
        console.log({ user })
        return (
            <React.Fragment>
                <HeaderBar />
                <div id='corporum'>
                    <section className='content-section'>
                    <Row className="justify-content-md-center">
                        <Col xs={6} md={4}>
                            <Image src={ image } rounded />
                        </Col>
                        <Col>
                            <h2> Welcome { user }</h2>
                        </Col>
                    </Row>
                    </section>
                    <section className='sidebar-section'>
                    </section>
                </div>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <HeaderBar />
                <div id='corporum'>
                    <section className='content-section'>
                        <LoginWarning/>
                    </section>
                    <section className='sidebar-section'>
                    </section>
                </div>
            </React.Fragment>
        )
    }

    
}

export default Home;