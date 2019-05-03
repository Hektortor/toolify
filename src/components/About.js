import React, { Component } from 'react';
import '../App.css';
import { withRouter, NavLink } from 'react-router-dom';

class About extends Component {

  render() {
    return (
      <div className="App">
        <h2 style={{ fontFamily: 'Gotham Bold', marginTop: '40px' }}>Made by Viktor Frohnapfel with ♥</h2>
      </div>
    );
  }
}
export default withRouter(About);