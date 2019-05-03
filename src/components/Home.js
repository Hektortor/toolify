import React, { Component } from 'react';
import '../App.css';
import { withRouter, NavLink } from 'react-router-dom';

class Home extends Component {

  render() {
    return (
      <div className="App">

        <h1 style={{ fontFamily: 'Gotham Bold', marginTop: '40px' }}>Home</h1>

        <NavLink className="link" to="/releases">
          <div className="card" style={{ background: 'linear-gradient(-45deg, #52a7ea, #712e98)', boxShadow: '0px 7px 50px 0px rgba(82,167,234,0.5)' }}>
            <h1>Releases</h1>
            <h4>Get all the new releases of your followed artists in a glance</h4>
          </div>
        </NavLink>

        <NavLink className="link" to="/feelings">
          <div className="card" style={{ background: 'linear-gradient(-45deg, #f6356f, #ff5f50)', boxShadow: '0px 7px 50px 0px rgba(246,53,111,0.5)' }}>
            <h1>Feelings</h1>
            <h4>Get a playlist based on your current feelings from your library tracks</h4>
          </div>
        </NavLink>

        <NavLink className="link" to="/tops">
          <div className="card" style={{ background: 'linear-gradient(-45deg, #f8ff3f, #ff9b30)', boxShadow: '0px 7px 50px 0px rgba(255,155,48,0.5)' }}>
            <h1>Tops</h1>
            <h4>Get a playlist of your top tracks of the last 1 year, 6 months or 4 weeks</h4>
          </div>
        </NavLink>

        <NavLink className="link" to="/statistics">
          <div className="card" style={{ background: 'linear-gradient(-45deg, #e1eb01, #92d000)', boxShadow: '0px 7px 50px 0px rgba(146,208,0,0.5)' }}>
            <h1>Statistics</h1>
            <h4>Get statistics of your hearing which you can't access on Spotify</h4>
          </div>
        </NavLink>

      </div >
    );
  }
}
export default withRouter(Home);