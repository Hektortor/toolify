import React, { Component } from 'react';
import '../App.css';
import { withRouter, NavLink } from 'react-router-dom';

class Home extends Component {

  render() {
    return (
      <div className="App">
        <div className="container">

          <h1 className="title">Features</h1>

          <NavLink className="link" to="/releases">
            <div className="card" style={{ background: 'linear-gradient(-45deg, #52a7ea, #712e98)', boxShadow: '0px 7px 50px 0px rgba(82,167,234,0.5)' }}>
              <h2>Releases</h2>
              <h5>Get all the new releases of your followed artists in a glance</h5>
            </div>
          </NavLink>

          <NavLink className="link" to="/feelings">
            <div className="card" style={{ background: 'linear-gradient(-45deg, #f6356f, #ff5f50)', boxShadow: '0px 7px 50px 0px rgba(246,53,111,0.5)' }}>
              <h2>Feelings</h2>
              <h5>Get a playlist from your library tracks based on your current mood</h5>
            </div>
          </NavLink>

          <NavLink className="link" to="/tops">
            <div className="card" style={{ background: 'linear-gradient(-45deg, #f8ff3f, #ff9b30)', boxShadow: '0px 7px 50px 0px rgba(255,155,48,0.5)' }}>
              <h2>Tops</h2>
              <h5>Get a playlist of your top tracks of the last 1 year, 6 months or 4 weeks</h5>
            </div>
          </NavLink>

          <NavLink className="link" to="/statistics">
            <div className="card" style={{ background: 'linear-gradient(-45deg, #e1eb01, #92d000)', boxShadow: '0px 7px 50px 0px rgba(146,208,0,0.5)' }}>
              <h2>Statistics</h2>
              <h5>Get statistics of your hearing which you can't access on Spotify</h5>
            </div>
          </NavLink>

          {/* <NavLink className="link" to="/analyzer">
            <div className="card" style={{ background: 'linear-gradient(-45deg, #86f1de, #46a3b7)', boxShadow: '0px 7px 50px 0px rgba(70,163,183,0.5)' }}>
              <h2>Analyzer</h2>
              <h5>Get the mood of your playlists</h5>
            </div>
          </NavLink> */}

        </div>
      </div>
    );
  }
}
export default withRouter(Home);