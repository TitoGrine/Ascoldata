import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Login extends Component {

    constructor(){
        super();
        const params = this.getHashParams();
    
        if(params.access_token){
            sessionStorage.setItem('authToken', params.access_token);
            sessionStorage.setItem('refreshToken', params.refresh_token);
        }
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    render() {
        if(!sessionStorage.getItem('authToken')){
            return (
                <React.Fragment>
                <div id='corporum'>
                    <section className='content-section slide-in-left'>
                        <div className="col d-flex flex-column align-items-center justify-content-center" style={{ height: '100%'}}>
                            <form action="http://localhost:8000/login">
                                <Button type="submit" size="lg" style={ buttonStyle }>
                                    <strong>Log in with Spotify</strong>
                                </Button>
                            </form>
                            <p style={ textStyle }>In order to access your data, please log in with your Spotify account.</p>
                        </div>
                    </section>
                    <section className='sidebar-section slide-in-right'>
                        Sidebar
                    </section>
                </div>
            </React.Fragment>
            )
        } else {
            return <Redirect to='/' />
        }
        
    }
}

const textStyle = {
    padding: '1.2em 0.5em',
    fontWeight: '300'
}

const buttonStyle = {
    padding: '0.6em 1.4em',
    fontSize: '1.3rem',
    fontWeight: '400',
    backgroundColor: '#1db954',
    color: '#191414',
    borderWidth: '0',
}

export default Login;