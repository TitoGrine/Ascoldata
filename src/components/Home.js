import React, { Component, useState, useEffect } from 'react';
import HeaderBar from './HeaderBar';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

function Home() {

    const [user, setUser] = useState('');

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');

        if(authToken){
            spotifyWebApi.setAccessToken(authToken);

            spotifyWebApi.getMe()
                .then((response) => {
                    console.log(response);
                    setUser(response.display_name)
                });
        }
    });

    return (
            <React.Fragment>
                <HeaderBar />
                <div>
                    <h1> HomePage of user { user } </h1>

                </div>
            </React.Fragment>
        )
}

export default Home;