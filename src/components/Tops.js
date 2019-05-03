import React, { Component } from 'react';
import '../App.css';
import Spotify from 'spotify-web-api-js';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { withRouter } from 'react-router-dom';

const spotifyWebApi = new Spotify();

class Tops extends Component {
    constructor() {
        super();
        const params = this.getHashParams();
        this.state = {
            topTracks: [],
            currentPlaylist: {},
            loading: false,
            created: false,
            rangeSelection: 1,
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

    getProfile() {

        var context = this;

        spotifyWebApi.getMe().then((userInfo) => {

            context.setState({
                currentUser: userInfo
            });

        });
    }

    getTops() {

        var context = this;
        var range = this.state.rangeSelection;

        var options = {};

        switch (range) {
            case 1:
                options = { limit: 50, time_range: "long_term" };
                break;
            case 2:
                options = { limit: 50, time_range: "medium_term" };
                break;
            case 3:
                options = { limit: 50, time_range: "short_term" };
                break;

            default:
                options = { limit: 50, time_range: "medium_term" };
                break;
        }

        spotifyWebApi.getMyTopTracks(options).then((tracks) => {

            var newTopTracks = [];
            var newUris = [];

            tracks.items.forEach(track => {

                var newTopTrack = { type: track.type, name: track.name, interpret: track.artists[0].name, uri: track.uri };
                newTopTracks.push(newTopTrack);
                newUris.push(track.uri);

            });

            context.setState({
                topTracks: newTopTracks
            });

            this.createPlaylist(newUris);
        });
    }

    formatDate(date) {

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + '/' + (monthIndex + 1) + '/' + year;
    }

    createPlaylist(topTracks) {

        var context = this;
        var range = this.state.rangeSelection;

        var firstDate = new Date();

        switch (range) {
            case 1:
                firstDate.setFullYear(firstDate.getFullYear() - 1);
                break;
            case 2:
                firstDate.setMonth(firstDate.getMonth() - 6);
                break;
            case 3:
                firstDate.setDate(firstDate.getDate() - 28);
                break;

            default:
                firstDate.setMonth(firstDate.getMonth() - 6);
                break;
        }

        spotifyWebApi.getMe().then((response) => {

            var name = "My Top Tracks " + this.formatDate(firstDate) + " - " + this.formatDate(new Date());

            var options = {
                name: name,
                description: "Autogenerated by Spotify Tools by Viktor Frohnapfel",
                public: false
            };

            var userId = response.id;

            spotifyWebApi.createPlaylist(userId, options).then((response) => {

                var uri = response.uri;
                var playlistId = response.id;
                var name = response.name;

                spotifyWebApi.addTracksToPlaylist(userId, playlistId, topTracks).then((response) => {


                    spotifyWebApi.getPlaylist(userId, playlistId).then((response) => {

                        var image = response.images[0].url;

                        var details = { name: name, uri: uri, image: image };

                        // FEEDBACK
                        // link zur playlist darstellen oder playlist darstellen
                        context.setState({
                            created: true,
                            loading: false,
                            currentPlaylist: details
                        });
                    });
                });
            });
        });
    }

    setRange(range) {
        this.setState({
            rangeSelection: range
        });
    }

    render() {
        var loading = this.state.loading;
        var created = this.state.created;
        var range = this.state.rangeSelection;
        return (
            <div className="Tops" style={{ background: 'black' }}>

                <h1 style={{ fontFamily: 'Gotham Bold', color: 'white', marginTop: '0px' }}>Get Your Personal Top Playlists</h1>
                {!loading ? <div></div> : <Spinner animation="grow" variant="success" />}

                <div className="formLayout" style={{ margin: '0px', paddingTop: '20px', paddingBottom: '20px' }}>

                    <ToggleButtonGroup variant="success" type="radio" name="rangeSelection" defaultValue={1} style={{ margin: '8px', padding: '0px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}>

                        {
                            range === 1 ?
                                <ToggleButton variant="success" style={{ background: 'black', color: 'rgb(15, 185, 88)', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '30px 2px 2px 30px', paddingLeft: '30px' }} onClick={() => this.setRange(1)} value={1}>1 year</ToggleButton>
                                :
                                <ToggleButton variant="success" style={{ background: 'black', color: 'white', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '30px 2px 2px 30px', paddingLeft: '30px' }} onClick={() => this.setRange(1)} value={1}>1 year</ToggleButton>
                        }
                        {
                            range === 2 ?
                                <ToggleButton variant="success" style={{ background: 'black', color: 'rgb(15, 185, 88)', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }} onClick={() => this.setRange(2)} value={2}>6 months</ToggleButton>
                                :
                                <ToggleButton variant="success" style={{ background: 'black', color: 'white', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }} onClick={() => this.setRange(2)} value={2}>6 months</ToggleButton>
                        }
                        {
                            range === 3 ?
                                <ToggleButton variant="success" style={{ background: 'black', color: 'rgb(15, 185, 88)', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '2px 30px 30px 2px', paddingRight: '30px' }} onClick={() => this.setRange(3)} value={3}>4 weeks</ToggleButton>
                                :
                                <ToggleButton variant="success" style={{ background: 'black', color: 'white', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '2px 30px 30px 2px', paddingRight: '30px' }} onClick={() => this.setRange(3)} value={3}>4 weeks</ToggleButton>
                        }

                    </ToggleButtonGroup>

                    <Button variant="success" style={{ width: '260px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }} onClick={() => this.getTops()}>Get top tracks playlist</Button>

                    {created ?
                        <a href={this.state.currentPlaylist.uri} target="_blank" rel="noopener noreferrer">
                            <div className="card" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px' }}>
                                <div>
                                    <div style={{ float: 'left', borderRadius: '4px' }}>
                                        <img src={this.state.currentPlaylist.image} style={{ borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                    </div>
                                    <div style={{ float: 'left', paddingLeft: '6px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px' }} >
                                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{this.state.currentPlaylist.name}</div>
                                        <div style={{ fontSize: '12px', fontWeight: '500', color: 'white' }}>50 Tracks</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        :
                        <div></div>
                    }
                </div>
            </div>
        );
    }
}
export default withRouter(Tops);