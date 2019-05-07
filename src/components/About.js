import React, { Component } from 'react';
import '../App.css';
import author from '../img/author.jpg';
import { withRouter } from 'react-router-dom';

class About extends Component {

  render() {
    return (
      <div className="container" style={{ fontFamily: 'Gotham Bold', textAlign: 'left' }}>
        <h1 className="title">Toolify</h1>
        <h5 style={{ fontFamily: 'Gotham Book' }}>Toolify is a collection of extra functionality for Spotify!</h5>
        <h3 style={{ fontFamily: 'Gotham Medium_1' }} className="title">Made with ♥ by</h3>
        <div>
          <img src={author} style={{ float: 'left', borderRadius: '26px', width: '64px', height: '64px' }} />
          <div>
            <h4 style={{ fontFamily: 'Gotham Medium_1', float: 'left', paddingTop: '18px', paddingBottom: '18px', paddingLeft: '8px' }}>Viktor Frohnapfel</h4>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(About);