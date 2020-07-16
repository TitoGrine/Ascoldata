import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

export class TopTracks extends Component {
    // getTopTracks = () => {
    
    //     if(this.props.auth_token){
    //         spotifyWebApi.setAccessToken(this.props.auth_token);

    //         spotifyWebApi.getMyTopTracks()
    //             .then((response) => {
    //                 console.log(response);
    //             })
    //     }
    // }

    render() {
        return (
            <p>
                { useState[0] }
            </p>
        )
    }
}

TopTracks.propTypes = {
    auth_token: PropTypes.string.isRequired
}

export default TopTracks

