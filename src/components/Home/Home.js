import React from 'react';

import HeaderBar from '../HeaderBar';
import GeneralInfo from '../GeneralInfo/GeneralInfo';
import Login from '../Login/Login';

function Home() {

    if(sessionStorage.getItem('authToken')){
        return (
            <React.Fragment>
                <HeaderBar />
                <GeneralInfo/>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <HeaderBar />
                <Login />
            </React.Fragment>
        )
    }
}

export default Home;