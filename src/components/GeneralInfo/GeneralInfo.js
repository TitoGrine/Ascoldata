import React, { useState, useEffect } from 'react';
import './GeneralInfo.css';
import { Image } from 'react-bootstrap';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

function GeneralInfo() {

    const [user, setUser] = useState('');
    const [id, setId] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [followers, setFollowers] = useState('');
    const [product, setProduct] = useState('');
    const [link, setLink] = useState('');
    const [uri, setURI] = useState('');

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');

        if(authToken && user === ''){
            spotifyWebApi.setAccessToken(authToken);

            spotifyWebApi.getMe()
                .then((response) => {
                    console.log(response);
                    setUser(response.display_name);
                    setImage(response.images[0].url);
                    setId(response.id);
                    setEmail(response.email);
                    setCountry(response.country);
                    setFollowers(response.followers.total);
                    setProduct(response.product);
                    setLink(response.external_urls.spotify);
                    setURI(response.uri);
                });
        }
    });

    return (
        <div id="profile-info">
            <div id="image">
                <Image src={ image } rounded />
            </div>
            <div id="info">
                <h2> Hello { user }</h2>
                <ul>
                    <li> ID: { id }</li>
                    <li> Email: { email }</li>
                    <li> Country: { country }</li>
                    <li> Subscription: { product }</li>
                    <li> No. followers: { followers }</li>
                    <li> Spotify link: { link }</li>
                    <li> Spotify URI: { uri }</li>
                </ul>
            </div>
        </div>
    )
}

export default GeneralInfo
