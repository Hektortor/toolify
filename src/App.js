import React, { Component } from 'react';
import './App.css';
import history from "./history";
import Spotify from 'spotify-web-api-js';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import queryString from 'query-string';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import Home from "./components//Home";
import Releases from "./components/Releases";
import Feelings from "./components/Feelings";
import Tops from "./components//Tops";
import Statistics from "./components//Statistics";
import NotFound from "./components//NotFound";

export var authEndpoint = 'https://accounts.spotify.com/authorize';

var clientId = "8df5f41dfa6d43e0b6f2bf7be259268d";
var redirectUri = "http%3A%2F%2Flocalhost%3A3000%2F";
var scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-birthdate",
  "user-follow-read",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "playlist-modify-private"
];

// // Get the hash of the url
// const hash = window.location.hash
//   .substring(1)
//   .split("&")
//   .reduce(function (initial, item) {
//     if (item) {
//       var parts = item.split("=");
//       initial[parts[0]] = decodeURIComponent(parts[1]);
//     }
//     return initial;
//   }, {});
// window.location.hash = "";


const spotifyWebApi = new Spotify();

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      currentUser: {},
      token: null
    };
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token);
      this.setState({
        loggedIn: true
      });
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

    spotifyWebApi.getMe().then((response) => {

      console.log(JSON.stringify(response));

      var newCurrentUser = {
        id: response.id,
        name: response.display_name,
        country: response.country,
        email: response.email,
        spotifyUrl: response.external_urls.spotify,
        totalFollowers: response.followers.total,
        imageUrl: response.images.length !== 0 ? response.images[0].url : "https://www.flynz.co.nz/wp-content/uploads/profile-placeholder.png",
        product: response.product
      };
      this.setState({
        currentUser: newCurrentUser
      });
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
    // Set token
    // let _token = hash.access_token;
    // if (_token) {
    //   // Set token
    //   this.setState({
    //     token: _token,
    //     loggedIn: _token ? true : false
    //   });
    //   spotifyWebApi.setAccessToken(_token);
    // }
    this.getUserProfile();

    const { match, location, history } = this.props;

    if (location !== undefined) {

      const values = queryString.parse(location.search);
      console.log(values.token);
    }

  }

  render() {
    var loggedIn = this.state.loggedIn;
    return (
      <BrowserRouter>
        <div className="App" style={{ background: 'black', textAlign: 'center' }}>
          <Navbar collapseOnSelect expand="lg" variant="dark" sticky="top" style={{ backgroundColor: 'black', background: 'black', textAlign: 'center' }}>
            <NavLink to="/"><Navbar.Brand style={{ fontFamily: "Gotham Bold" }}>Spotify Tools</Navbar.Brand></NavLink>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <NavLink className="link" exact to="/">Home</NavLink>
                <NavLink className="link" exact to="/releases">Releases</NavLink>
                <NavLink className="link" exact to="/feelings">Feelings</NavLink>
                <NavLink className="link" exact to="/tops">Tops</NavLink>
                <NavLink className="link" exact to="/statistics">Statistics</NavLink>
              </Nav>
              <Nav>
                {
                  loggedIn ?

                    <Button variant="success" onClick={() => this.logout()} style={{ background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }}>Logout</Button>

                    :
                    <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
                      <Button variant="success" style={{ background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }}>Login with Spotify</Button>
                    </a>
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          {
            loggedIn ?

              <a href={this.state.currentUser.spotifyUrl} target="_blank" rel="noopener noreferrer">
                <div className="card" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px' }}>
                  <div>
                    <div style={{ float: 'left', borderRadius: '4px' }}>
                      <img src={this.state.currentUser.imageUrl} style={{ borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                    </div>
                    <div style={{ float: 'left', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px' }} >
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>{this.state.currentUser.name} · {this.state.currentUser.country}</div>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{this.state.currentUser.email}</div>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{this.state.currentUser.spotifyUrl}</div>
                    </div>
                  </div>
                </div>
              </a>

              // <div id="profileLayout">
              //   <div className="card" style={{ background: 'rgb(24, 24, 24)', borderRadius: '12px', borderColor: '#464646', borderWidth: '2px' }}>
              //       <div class="box1">
              //         <div style={{ borderRadius: '4px' }}>
              //           <img src={this.state.currentUser.imageUrl} style={{ borderRadius: '8px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
              //         </div>
              //         <div style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px' }} >
              //           <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>{this.state.currentUser.name} · {this.state.currentUser.country}</div>
              //           <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{this.state.currentUser.email}</div>
              //           <a href={this.state.currentUser.spotifyUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{this.state.currentUser.spotifyUrl}</div></a>
              //         </div>
              //       </div>
              //   </div>
              // </div>
              :
              <div></div>
          }
          <div className="content" style={{ height: '100vh' }}>

            {
              loggedIn ?

                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/releases" component={Releases} />
                  <Route path="/feelings" component={Feelings} />
                  <Route path="/tops" component={Tops} />
                  <Route path="/statistics" component={Statistics} />
                  <Route component={NotFound} />
                </Switch>
                :
                <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
                  <Button variant="success" style={{ margin: '20px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }}>Login with Spotify</Button>
                </a>
            }

          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;