import React, { Component, useState, useEffect } from 'react';
import HeaderBar from './HeaderBar';

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
        return (
            <React.Fragment>
                <HeaderBar />
                <div>
                    <form action="http://localhost:8000/login">
                        <input type="submit" value="Login with Spotify"/>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default Login;