import React, { Component, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import HeaderBar from './HeaderBar';
import Home from  './Home';

class Login extends Component {

    constructor(){
        super();
        const params = this.getHashParams();
    
        if(params.access_token)
            sessionStorage.setItem('authToken', params.access_token);
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
                    <HeaderBar />
                    <div className="col d-flex flex-column align-items-center justify-content-center" style = { { height: '60vh' } }>
                        <form action="http://localhost:8000/login">
                            <Button type="submit" size="lg">
                                <strong>Log in with Spotify</strong>
                            </Button>
                        </form>
                    </div>
                </React.Fragment>
            )
        } else {
            return <Redirect to='/' />
        }
        
    }
}

export default Login;