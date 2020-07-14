import React, { Component } from 'react';
import './App.css';
import TopTracks from './components/TopTracks';

class App extends Component {

  constructor(){
    super();
    const params = this.getHashParams();

    console.log(params.access_token)
    this.state = {
      auth_token: params.access_token,
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

  render(){
    return (
      <div className="App">
        <h1>Spotify Stats</h1>
        <div>
          <form action="http://localhost:8000">
            <input type="submit" value="Login with Spotify"/>
          </form>
          <TopTracks auth_token={this.state.auth_token}/>
        </div>
      </div>
    );
  }
}

export default App;
