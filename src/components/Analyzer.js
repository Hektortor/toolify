import React, { Component } from 'react';
import '../App.css';
import Spotify from 'spotify-web-api-js';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { withRouter } from 'react-router-dom';

const spotifyWebApi = new Spotify();

class Analyzer extends Component {
    constructor() {
        super();
        const params = this.getHashParams();
        this.state = {
            playlists: [],
            playlistTracks: [],
            analysis: [],
            lastPlaylistId: "",
            lastTrackId: "",
            userId: "",
            loading: false,
            created: false,
            error: false
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

    forEachPromiseTracksPerPlaylist(list, options, newList, func, context) {
        return list.reduce(function (promise, list) {
            return promise.then(function () {
                return func(list, options, newList, context);
            });
        }, Promise.resolve());
    }

    forEachPromiseAudio(list, options, newList, func, context) {
        return list.reduce(function (promise, list) {
            return promise.then(function () {
                return func(list, options, newList, context);
            });
        }, Promise.resolve());
    }

    addReleases(artist, options, newReleases, context) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                spotifyWebApi.getArtistAlbums(artist.id, options)
                    .then((response) => {
                        response.items.forEach(function (release) {
                            var newRelease = {
                                interpret: artist.name,
                                id: release.id,
                                name: release.name,
                                type: release.album_type,
                                date: release.release_date,
                                url: release.external_urls.spotify,
                                imageSmall: release.images[2].url
                            };
                            newReleases.push(newRelease);
                        });
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        context.setState({
                            loading: false,
                            error: true
                        });
                    });
            });
        });
    }

    addTracksPerPlaylist(playlist, options, lastTrackId, newPlaylistTracks, context) {

        return new Promise((resolve, reject) => {
            process.nextTick(() => {

                lastTrackId = context.state.lastTrackId;
                options = {};
                if (lastTrackId === "") {
                    options = { limit: 100 };
                } else {
                    options = { limit: 100, after: lastTrackId };
                }

                spotifyWebApi.getPlaylistTracks(playlist.id, options)
                    .then((tracks) => {

                        var newTracks = new Map();

                        tracks.items.forEach(track => {
                            newTracks.push(track.track.id);
                            lastTrackId = track.track.id;

                        });
                        newPlaylistTracks.set(playlist.id, newTracks);
                        context.setState({
                            lastTrackId: lastTrackId
                        });
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        context.setState({
                            loading: false,
                            error: true
                        });
                    });
            });
        });
    }

    forEachPromisePlaylists(list, options, lastId, newList, context, func) {
        return list.reduce(function (promise, list) {
            return promise.then(function () {
                return func(list, options, lastId, context, newList);
            });
        }, Promise.resolve());
    }

    addPlaylists(playlist, options, lastPlaylistId, context, newPlaylists) {

        return new Promise((resolve, reject) => {
            process.nextTick(() => {

                lastPlaylistId = context.state.lastPlaylistId;
                var userId = context.state.userId;
                options = {};
                if (lastPlaylistId === "") {
                    options = { limit: 100 };
                } else {
                    options = { limit: 100, after: lastPlaylistId };
                }

                spotifyWebApi.getUserPlaylists(userId, options)
                    .then((playlistResponse) => {

                        playlistResponse.items.forEach(function (playlist) {

                            var newPlaylist = {
                                id: playlist.id,
                                name: playlist.name,
                                image: playlist.images[0],
                                url: playlist.external_urls.spotify,
                                total: playlist.tracks.total
                            };
                            newPlaylists.push(newPlaylist);
                            lastPlaylistId = playlist.id;
                        });
                        context.setState({
                            lastPlaylistId: lastPlaylistId
                        });
                        resolve();

                    })
                    .catch((err) => {
                        console.log(err);
                        context.setState({
                            loading: false,
                            error: true
                        });
                    });
            })
        });
    }

    addAudioAnalysis(playlist, options, lastPlaylistTrackId, context, newAnalysis) {

        return new Promise((resolve, reject) => {
            process.nextTick(() => {

                lastPlaylistTrackId = context.state.lastPlaylistTrackId;
                options = {};
                if (lastPlaylistTrackId === "") {
                    options = { limit: 100 };
                } else {
                    options = { limit: 100, after: lastPlaylistTrackId };
                }

                spotifyWebApi.getAudioFeaturesForTracks(playlist.splice(100), options)
                    .then((response) => {

                        var newAnalysises = [];

                        response.audio_features.forEach(audio => {

                            var newAnalysis = { tempo: audio.tempo };
                            newAnalysises.push(newAnalysis);
                            lastPlaylistTrackId = playlist.get(100).id;
                        });
                        context.setState({
                            lastPlaylistTrackId: lastPlaylistTrackId
                        });
                        resolve();

                    })
                    .catch((err) => {
                        console.log(err);
                        context.setState({
                            loading: false,
                            error: true
                        });
                    });
            });
        });
    }

    getAudioAnalysis() {

        const playlistTracks = this.state.playlistTracks;
        var newAnalysis = [];
        var context = this;

        var options = {};

        this.forEachPromiseAudio(playlistTracks, options, newAnalysis, this.addAudioAnalysis, context)
            .then(() => {
                console.log(newAnalysis.length + " Playlists Analysis loaded");
                this.setState({
                    analysis: newAnalysis,
                    loading: false,
                    created: true
                });
            });
    }

    getTracksPerPlaylist() {

        const playlists = this.state.playlists;
        var newPlaylistTracks = [];
        var context = this;

        var options = {};

        this.forEachPromiseTracksPerPlaylist(playlists, options, newPlaylistTracks, this.addTracksPerPlaylist, context)
            .then(() => {
                console.log(newPlaylistTracks.length + " Playlists Tracks loaded");
                this.setState({
                    playlistTracks: newPlaylistTracks
                });
                this.getAudioAnalysis();
            });
    }

    getUsersPlaylists() {

        this.setState({
            loading: true,
            error: false,
            playlists: [],
            analysis: []
        });

        var context = this;

        spotifyWebApi.getMe()
            .then((user) => {

                context.setState({
                    userId: user.id
                });

                spotifyWebApi.getUserPlaylists(user.id, { limit: 1 })
                    .then((playlistResponse) => {

                        var playlists = playlistResponse.items;


                        var emptyOptions = "";
                        var total = playlistResponse.total;
                        var newPlaylists = [];
                        var list = [];
                        var length = total / 100;
                        var lastPlaylistId = "";

                        if (length === 0) {
                            length = 1;
                        }

                        for (var i = 0; i < length; i++) {
                            list.push(1);
                        }

                        this.forEachPromisePlaylists(list, emptyOptions, newPlaylists, lastPlaylistId, context, this.addPlaylists).then(() => {
                            console.log(newPlaylists.length + " Playlists loaded");
                            this.setState({
                                playlists: newPlaylists
                            });
                            this.getTracksPerPlaylist();
                        });

                        // var playlistNames = [];
                        // playlists.forEach(playlist => {
                        //     playlistNames.push("<option>playlist.name</option>");
                        // });
                        // context.setState({
                        //     playlistNames: playlistNames
                        // });

                        // auf prozentwerte bringen
                        // darstellen

                    })
                    .catch((err) => {
                        console.log(err);
                        context.setState({
                            loading: false,
                            error: true
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                context.setState({
                    loading: false,
                    error: true
                });
            });
    }

    setRange(range) {
        this.setState({
            rangeSelection: range
        });
    }


    componentDidMount() {

        // this.getPlaylists();

    }

    startButton() {
        this.getPlaylists();
    }

    render() {
        var loading = this.state.loading;
        var error = this.state.error;
        return (
            <div className="Tops">
                <div className="container">

                    <h1 className="title">Get The Mood of your Playlists</h1>
                    {!loading ? <div></div> : <Spinner animation="grow" variant="success" />}

                    <div className="formLayout" style={{ margin: '0px', paddingTop: '20px', paddingBottom: '20px' }}>


                        <Form>
                            <Form.Group controlId="form.feeling">
                                <Form.Label>Select Playlist...</Form.Label>
                                <Form.Control as="select" onChange={(event) => this.handleFeelingChange(event)} value={this.state.playlistNames || ['Loading...']} />
                            </Form.Group>
                            <Button className="button" variant="success"
                                //  onClick={() => this.startButton()}
                                disabled>
                                {/* Get Analysis */}
                                Coming Soon
                         </Button>
                        </Form>
                        {
                            error
                                ?
                                <h3 style={{ marginTop: '20px', fontFamily: 'Gotham Bold' }}>Error occurred</h3>
                                :
                                <div></div>
                        }
                        <ListGroup>
                            {
                                this.state.analysis.map(analysis => {
                                    return (
                                        <div key={analysis.id} className="cardRelease" style={{ background: 'rgb(24, 24, 24)', textAlign: 'center' }}>

                                            <div id="oben" style={{ height: '64px', clear: 'both' }}>

                                                <div id="obenLinks" style={{ float: 'left', height: '64px' }}>
                                                    <a href={analysis.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                                        {
                                                            analysis.hasImage
                                                                ?
                                                                <img src={analysis.images[1].url} style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                                                :
                                                                <img style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                                        }
                                                    </a>
                                                    <div style={{ float: 'left', marginTop: '18px', marginBottom: '18px', marginLeft: '4px', textAlign: 'left' }}>
                                                        <div style={{ fontSize: '17px', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{analysis.name}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div id="unten" style={{ clear: 'both', marginTop: '8px', color: 'grey' }}>
                                                <div style={{ marginLeft: '6px', fontSize: '14px', fontWeight: '500', float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{this.formatFollowers(analysis.followers.total)}</div>
                                                <div style={{ marginRight: '6px', fontSize: '12px', fontWeight: '400', float: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{analysis.popularity}%</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </ListGroup>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(Analyzer);