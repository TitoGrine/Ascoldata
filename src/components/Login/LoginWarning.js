import React from 'react';
import { Link } from 'react-router-dom';

function LoginWarning() {
    return (
        <div id='corporum'>
            <section className='content-section slide-in-left'>
                <div className="col d-flex flex-column align-items-center justify-content-center" style = { { height: '90%' } }>
                    <p style={ warningStyle }>Please <Link to={ '/login' } style={ linkStyle }> log in </Link> with Spotify to import data.</p>
                </div>
            </section>
            <section className='sidebar-section slide-in-right'>
            </section>
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
