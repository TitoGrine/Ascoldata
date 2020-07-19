import React from 'react';
import { Link } from 'react-router-dom';

function LoginWarning() {
    return (
        <div className="col d-flex flex-column align-items-center justify-content-center" style = { { height: '90%' } }>
            <strong style={ warningStyle }>Please <Link to={ '/login' } style={ linkStyle }> log in </Link> with Spotify to import data.</strong>
        </div>
    )
}

const warningStyle = {
    color: 'antiquewhite'
};

const linkStyle = {
    color: '#1DB954'
};

export default LoginWarning
