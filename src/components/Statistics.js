import React, { Component } from 'react';
import '../App.css';
import Spotify from 'spotify-web-api-js';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { withRouter } from 'react-router-dom';

const spotifyWebApi = new Spotify();

class Statistics extends Component {
    constructor() {
        super();
        const params = this.getHashParams();
        this.state = {
            topTracks: [],
            topArtists: [],
            currentUser: {},
            loading: false,
            rangeSelection: 1
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

        spotifyWebApi.getMyTopArtists(options).then((artists) => {

            context.setState({
                topArtists: artists.items
            });

            console.log(JSON.stringify(artists));

            console.log(artists.items.length + " Top Artists loaded!");

            spotifyWebApi.getMyTopTracks(options).then((tracks) => {

                context.setState({
                    topTracks: tracks.items
                });

                console.log(JSON.stringify(tracks));

                console.log(tracks.items.length + " Top Tracks loaded!");
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
        var range = this.state.rangeSelection;
        return (
            <div className="Statistics" style={{ background: 'black' }}>

                <h1 style={{ fontFamily: 'Gotham Bold', color: 'white', marginTop: '0px' }}>Get your personal statistics</h1>
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

                    <Button variant="success" style={{ width: '260px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }} onClick={() => this.getTops()}>Check top tracks and artists</Button>

                </div>

            </div>
        );
    }
}
export default withRouter(Statistics);