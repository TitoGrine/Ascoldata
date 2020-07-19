import React from 'react';

import HeaderBar from '../HeaderBar';
import LoginWarning from '../LoginWarning';
import GeneralInfo from '../GeneralInfo/GeneralInfo';

function Home() {

    if(sessionStorage.getItem('authToken')){
        return (
            <React.Fragment>
                <HeaderBar />
                <div id='corporum'>
                    <section className='content-section'>
                        <GeneralInfo/>
                    </section>
                    <section className='sidebar-section'>
                    </section>
                </div>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <HeaderBar />
                <div id='corporum'>
                    <section className='content-section'>
                        <LoginWarning/>
                    </section>
                    <section className='sidebar-section'>
                    </section>
                </div>
            </React.Fragment>
        )
    }

    
}

export default Home;