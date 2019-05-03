import React, { Component } from 'react';
import '../App.css';
import Spotify from 'spotify-web-api-js';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ListGroup from 'react-bootstrap/ListGroup';
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
            created: false,
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

        this.setState({
            loading: true,
            created: false,
            topTracks: [],
            topArtists: []
        });

        var context = this;
        var range = this.state.rangeSelection;

        var options = {};

        switch (range) {
            case 1:
                options = { limit: 10, time_range: "long_term" };
                break;
            case 2:
                options = { limit: 10, time_range: "medium_term" };
                break;
            case 3:
                options = { limit: 10, time_range: "short_term" };
                break;

            default:
                options = { limit: 10, time_range: "medium_term" };
                break;
        }

        spotifyWebApi.getMyTopArtists(options).then((artists) => {

            artists.items.forEach(element => {
                if ((typeof (element.images) !== 'undefined') && (element.images !== null)) {
                    if (element.images.length === 0) {
                        element.hasImage = false;
                    } else {
                        element.hasImage = true;
                    }
                } else {
                    element.hasImage = false;
                }
            });

            context.setState({
                topArtists: artists.items
            });

            console.log(artists.items.length + " Top Artists loaded!");

            spotifyWebApi.getMyTopTracks(options).then((tracks) => {

                tracks.items.forEach(element => {
                    if ((typeof (element.album.images) !== 'undefined') && (element.album.images !== null)) {
                        if (element.album.images.length === 0) {
                            element.hasImage = false;
                        } else {
                            element.hasImage = true;
                        }
                    } else {
                        element.hasImage = false;
                    }
                });

                context.setState({
                    topTracks: tracks.items,
                    loading: false,
                    created: true
                });

                console.log(tracks.items.length + " Top Tracks loaded!");
            });
        });

    }



    setRange(range) {
        this.setState({
            rangeSelection: range
        });
    }

    formatDate(dateString) {
        var dateArr = dateString.split('-');
        if (dateArr.length > 1) {
            return dateArr[2] + "." + dateArr[1] + "." + dateArr[0];
        } else {
            return "" + dateArr[0];
        }
    }

    formatFollowers(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    render() {
        var loading = this.state.loading;
        var range = this.state.rangeSelection;
        var created = this.state.created;
        return (
            <div className="Statistics" style={{ background: 'black' }}>

                <h1 style={{ fontFamily: 'Gotham Bold', color: 'white', marginTop: '0px' }}>Get your Personal Top Tracks and Artists</h1>
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

                    <Button variant="success" style={{ width: '260px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }} onClick={() => this.getTops()}>Check Statistics</Button>

                    {
                        created
                            ?
                            <h2 style={{ fontFamily: 'Gotham Bold', color: 'white', marginTop: '30px' }}>Top 10 Artists</h2>
                            :
                            <div></div>
                    }

                    <ListGroup style={{ background: 'black', textAlign: 'center', margin: '10px' }}>
                        {
                            this.state.topArtists.map(artist => {
                                return (
                                    <div key={artist.id} className="cardRelease" style={{ background: 'rgb(24, 24, 24)', textAlign: 'center' }}>

                                        <div id="oben" style={{ height: '64px', clear: 'both' }}>

                                            <div id="obenLinks" style={{ float: 'left', height: '64px' }}>
                                                <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                                    {
                                                        artist.hasImage
                                                            ?
                                                            <img src={artist.images[1].url} style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                                            :
                                                            <img style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                                    }
                                                </a>
                                                <div style={{ float: 'left', marginTop: '18px', marginBottom: '18px', marginLeft: '4px', textAlign: 'left' }}>
                                                    <div style={{ fontSize: '17px', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.name}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="unten" style={{ clear: 'both', marginTop: '8px', color: 'grey' }}>
                                            <div style={{ marginLeft: '6px', fontSize: '14px', fontWeight: '500', float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{this.formatFollowers(artist.followers.total)}</div>
                                            <div style={{ marginRight: '6px', fontSize: '12px', fontWeight: '400', float: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.popularity}%</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ListGroup>

                    {
                        created
                            ?
                            <h2 style={{ fontFamily: 'Gotham Bold', color: 'white', marginTop: '20px' }}>Top 10 Tracks</h2>
                            :
                            <div></div>
                    }

                    <ListGroup style={{ background: 'black', textAlign: 'center', margin: '10px' }}>
                        {
                            this.state.topTracks.map(track => {
                                return (

                                    <div key={track.id} className="cardRelease" style={{ background: 'rgb(24, 24, 24)', textAlign: 'center' }}>

                                        <div id="oben" style={{ height: '64px', clear: 'both' }}>

                                            <div id="obenLinks" style={{ float: 'left', height: '64px' }}>
                                                <a href={track.url} target="_blank" rel="noopener noreferrer">
                                                    {
                                                        track.hasImage
                                                            ?
                                                            <img src={track.album.images[2].url} style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                                            :
                                                            <img style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                                    }
                                                    <div className="tooltip"></div>
                                                </a>
                                                <div style={{ float: 'left', marginTop: '10px', marginBottom: '10px', marginLeft: '4px', textAlign: 'left' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.name}</div>
                                                    <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.album.artists[0].name}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="unten" style={{ clear: 'both', marginTop: '8px', color: 'grey' }}>
                                            <div style={{ marginLeft: '6px', fontSize: '14px', fontWeight: '500', float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{this.formatDate(track.album.release_date)}</div>
                                            <div style={{ marginRight: '6px', fontSize: '12px', fontWeight: '400', float: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.popularity}%</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ListGroup>

                </div>

            </div>
        );
    }
}
export default withRouter(Statistics);