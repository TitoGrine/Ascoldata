import React, { useState, useEffect } from 'react';
import './GeneralInfo.css';
import { Link } from 'react-router-dom';
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
        <div id='corporum'>
            <section className='content-section'>
                <div id="profile-info">
                    <h2> · Hello <strong>{ user }</strong> ·</h2>
                    <div id="info">
                        <div id="image">
                            <Image src={ image } thumbnail />
                        </div>
                        <ul>
                            <li> <strong>ID:</strong> { id }</li>
                            <li> <strong>Email:</strong> { email }</li>
                            <li> <strong>Country:</strong> { country }</li>
                            <li> <strong>Subscription:</strong> { product }</li>
                            <li> <strong>No. followers:</strong> { followers }</li>
                            <li> <strong>Spotify link:</strong> { link }</li>
                            <li> <strong>Spotify URI:</strong> { uri }</li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className='sidebar-section'>
                <div className='side-content'>
                    <div className='sidebar-tabs'>
                        <button> Check Out</button>
                    </div>
                    <ul className='redirects'>
                        <li> <Link to="/">Top</Link> </li>
                        <li> <Link to="/">Playlists</Link> </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default GeneralInfo
