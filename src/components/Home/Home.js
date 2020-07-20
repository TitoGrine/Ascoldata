import React from 'react';

import HeaderBar from '../HeaderBar';
import LoginWarning from '../LoginWarning';
import GeneralInfo from '../GeneralInfo/GeneralInfo';

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
                <LoginWarning />
            </React.Fragment>
        )
    }
}

export default Home;