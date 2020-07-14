import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

export class TopTracks extends Component {

    getTopTracks = () => {
    
        if(this.props.auth_token){
            spotifyWebApi.setAccessToken(this.props.auth_token);

            spotifyWebApi.getMyTopTracks()
                .then((response) => {
                    console.log(response);
                })
        }
    }

    render() {
        this.getTopTracks();
        return (
            <div>
                
            </div>
        )
    }
}

TopTracks.propTypes = {
    auth_token: PropTypes.string.isRequired
}

export default TopTracks

