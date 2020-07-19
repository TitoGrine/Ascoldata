import React from 'react';
import { Link } from 'react-router-dom';

function LoginWarning() {
    return (
        <div className="col d-flex flex-column align-items-center justify-content-center" style = { { height: '90%' } }>
            <p style={ warningStyle }>Please <Link to={ '/login' } style={ linkStyle }> log in </Link> with Spotify to import data.</p>
        </div>
    )
}

const warningStyle = {
    color: 'antiquewhite',
    fontSize: '1.3em',
    fontWeight: '300',
};

const linkStyle = {
    color: '#1DB954',
};

export default LoginWarning
