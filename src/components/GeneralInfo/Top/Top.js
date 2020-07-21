import React, { useState, useEffect } from 'react';
import './Top.css';
import { Link } from 'react-router-dom';
import Spotify from 'spotify-web-api-js';

import HeaderBar from '../../HeaderBar';

const spotifyWebApi = new Spotify();

function Top() {

    const [madeCall, setMadeCall] = useState(false);
    const [topResults, setTopResults] = useState([]);
    const authToken = sessionStorage.getItem('authToken');

    useEffect(() => {
        if(madeCall)
            return;

        setMadeCall(true);

        if(authToken){
            spotifyWebApi.getMyTopArtists()
                .then((response) => {
                    console.log(response.items);
                    setTopResults(response.items)
                });
        }
    });

    return (
        <React.Fragment>
            <HeaderBar />
            <div id='corporum'>
            <section className='content-section slide-in-left'>
                <table>
                <tbody>
                    <tr>
                        <th>Artist</th>
                        <th>Followers</th>
                        <th>Genre</th>
                        <th>Popularity</th>
                    </tr>
                </tbody>
                </table>
            </section>
            <section className='sidebar-section slide-in-right'>
                <div className='side-content'>
                    <div className='sidebar-tabs'>
                        <button> Check Out</button>
                    </div>
                    <ul className='redirects'>
                        <li> <Link to="/top">Top</Link> </li>
                        <li> <Link to="/">Playlists</Link> </li>
                    </ul>
                </div>
            </section>
        </div>
        </React.Fragment>
    )
}

export default Top