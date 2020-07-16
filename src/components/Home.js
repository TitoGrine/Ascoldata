import React, { Component, useState } from 'react';
import HeaderBar from './HeaderBar';

class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <HeaderBar />
                <div>
                    <h1> HomePage </h1>
                </div>
            </React.Fragment>
        )
    }
}

export default Home;