import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import './App.css';
import Spotify from 'spotify-web-api-js';

// import history from "./history";
// import queryString from 'query-string';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Home from "./components//Home";
import Releases from "./components/Releases";
import Feelings from "./components/Feelings";
import Tops from "./components/Tops";
import Statistics from "./components/Statistics";
import About from "./components/About";
import NotFound from "./components/NotFound";

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientId = "8df5f41dfa6d43e0b6f2bf7be259268d";
const redirectUri = "http%3A%2F%2Flocalhost%3A3000%2F";
// var redirectUri = "https%3A%2F%2Fhektortor.github.io%2Fspotify-tools%2F";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-birthdate",
  "user-follow-read",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "playlist-modify-private"
];

const spotifyWebApi = new Spotify();

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      currentUser: {}
    };
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getUserProfile() {

    spotifyWebApi.getMe()
      .then((response) => {

        var newCurrentUser = {
          id: response.id,
          name: response.display_name,
          country: response.country,
          email: response.email,
          spotifyUrl: response.external_urls.spotify,
          totalFollowers: response.followers.total,
          imageUrl: response.images.length !== 0 ? response.images[0].url : "https://azpinesmotel.com/wp-content/uploads/2014/11/user-avatar-placeholder.png",
          product: response.product
        };
        this.setState({
          currentUser: newCurrentUser,
          loggedIn: true
        });
      })
      .catch((err) => {
        console.log("Error:" + err);
      });
  }

  logout() {
    spotifyWebApi.setAccessToken(null);
    this.params = null;
    this.setState({
      loggedIn: false
    });
  }

  componentDidMount() {

    if (spotifyWebApi.getAccessToken()) {
      this.getUserProfile();
    }

    // const { match, location, history } = this.props;
    // const { location } = this.props;

    // if (location !== undefined) {
    //   const values = queryString.parse(location.search);
    //   console.log(values.token);
    // }
  }

  render() {
    var loggedIn = this.state.loggedIn;
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="App">
          <Navbar collapseOnSelect expand="lg" variant="dark" sticky="top" style={{ background: 'black' }}>
            <NavLink to="/"><Navbar.Brand style={{ fontFamily: "Gotham Bold" }}>Spotify Tools</Navbar.Brand></NavLink>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <NavLink className="link" exact to="/">Home</NavLink>
                <NavLink className="link" exact to="/releases">Releases</NavLink>
                <NavLink className="link" exact to="/feelings">Feelings</NavLink>
                <NavLink className="link" exact to="/tops">Tops</NavLink>
                <NavLink className="link" exact to="/statistics">Statistics</NavLink>
                <NavLink className="link" exact to="/about">About</NavLink>
              </Nav>
              <Nav>
                {
                  loggedIn
                    ?
                    <Button className="button" variant="success" onClick={() => this.logout()}>Logout</Button>
                    :
                    <Button className="button" variant="success" href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>Login with Spotify</Button>
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          {
            loggedIn
              ?
              <a href={this.state.currentUser.spotifyUrl} target="_blank" rel="noopener noreferrer">
                <div className="card" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px' }}>
                  <div>
                    <div style={{ float: 'left' }}>
                      <img src={this.state.currentUser.imageUrl} style={{ borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} alt="cover" />
                    </div>
                    <div style={{ float: 'left', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px', maxWidth: '70%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} >
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto', boxSizing: 'border-box' }}>{this.state.currentUser.name} · {this.state.currentUser.country}</div>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto', boxSizing: 'border-box' }}>{this.state.currentUser.email}</div>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto', boxSizing: 'border-box' }}>{this.state.currentUser.spotifyUrl}</div>
                    </div>
                  </div>
                </div>
              </a>
              :
              <div></div>
          }
          <div className="content" style={{ height: '100vh' }}>
            {
              loggedIn
                ?
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/releases" component={Releases} />
                  <Route path="/feelings" component={Feelings} />
                  <Route path="/tops" component={Tops} />
                  <Route path="/statistics" component={Statistics} />
                  <Route path="/about" component={About} />
                  <Route component={NotFound} />
                </Switch>
                :
                <div>
                  <h2 style={{ fontFamily: 'Gotham Bold' }}>Please login and try again!</h2>
                  <Button href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`} variant="success" style={{ margin: '20px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }}>Login with Spotify</Button>
                </div>
            }
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;