import React, { Component } from 'react';
import '../App.css';
import Spotify from 'spotify-web-api-js';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { withRouter } from 'react-router-dom';

const spotifyWebApi = new Spotify();

class Feelings extends Component {
    constructor() {
        super();
        const params = this.getHashParams();
        this.state = {
            tracks: [],
            playlist: [],
            currentPlaylist: {},
            lastTrackId: "",
            typeSelection: 1,
            loading: false,
            created: false,
            error: false,
            name: "Pure Love",
            amount: 8,
            feeling: "Love",
            trackCount: 0
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


    forEachPromiseSavedTracks(list, options, newTracks, lastTrackId, context, func, feeling) {
        return list.reduce(function (promise, list) {
            return promise.then(function () {
                return func(list, options, lastTrackId, context, newTracks, feeling);
            });
        }, Promise.resolve());
    }

    addSavedTracks(list, options, lastTrackId, context, newTracks, feeling) {

        return new Promise((resolve, reject) => {
            process.nextTick(() => {


                lastTrackId = context.state.lastTrackId;
                options = {};
                if (lastTrackId === "") {
                    options = { limit: 50 };
                } else {
                    options = { limit: 50, after: lastTrackId };
                }


                spotifyWebApi.getMySavedTracks(options).then((response) => {

                    response.items.forEach(track => {

                        newTracks.push(track.track.id);
                        lastTrackId = track.track.id;

                    });
                    context.setState({
                        lastTrackId: lastTrackId,
                        tracks: newTracks
                    });
                    resolve();
                });
            });
        });
    }

    getSavedTracks(count) {

        var emptyOptions = "";
        var newTracks = [];
        var list = [];
        var length = count / 50;
        var lastTrackId = "";
        var context = this;

        for (var i = 0; i < length; i++) {
            list.push(1);
        }

        this.forEachPromiseSavedTracks(list, emptyOptions, newTracks, lastTrackId, context, this.addSavedTracks).then(() => {
            console.log(newTracks.length + " Tracks loaded");
            this.setState({
                tracks: newTracks
            });

            // TRACKS API
            // liste durchgehen
            // wenn stimmung passt in endliste packen -> spotifyWebApi.getAudioFeaturesForTracks()
            // endlist mit amount von form vergleichen und anpassen
            this.getTracksFeelings(newTracks);

        });

    }

    equals(feeling, audio) {


        if (!feeling.danceability(audio.danceability)) {
            return false;
        }

        if (!feeling.acousticness(audio.acousticness)) {
            return false;
        }

        if (!feeling.energy(audio.energy)) {
            return false;
        }

        if (!feeling.loudness(audio.loudness)) {
            return false;
        }

        if (!feeling.instrumentalness(audio.instrumentalness)) {
            return false;
        }

        if (!feeling.liveness(audio.liveness)) {
            return false;
        }

        if (!feeling.mode(audio.mode)) {
            return false;
        }

        if (!feeling.speechiness(audio.speechiness)) {
            return false;
        }

        if (!feeling.tempo(audio.tempo)) {
            return false;
        }

        if (!feeling.time_signature(audio.time_signature)) {
            return false;
        }

        if (!feeling.valence(audio.valence)) {
            return false;
        }

        if (!feeling.key(audio.key)) {
            return false;
        }

        return true;
    }

    less(x) {
        return function (y) {
            return y < x;
        }
    }

    greater(x) {
        return function (y) {
            return y > x;
        }
    }

    and(p1, p2) {
        return function (x) {
            return p1(x) && p2(x);
        }
    }

    matchesFeeling(feeling, audio) {


        var love = {
            danceability: this.less(1),
            acousticness: this.less(1),
            energy: this.less(1),
            loudness: this.less(10),
            instrumentalness: this.less(1),
            liveness: this.less(1),
            mode: this.less(1),
            speechiness: this.less(1),
            tempo: this.less(130),
            time_signature: this.less(30),
            valence: this.less(1),
            key: this.less(20)
        };

        var sorrow = {
            danceability: 1,
            acousticness: 1,
            energy: 1,
            loudness: 1,
            instrumentalness: 1,
            liveness: 1,
            mode: 1,
            speechiness: 1,
            tempo: 1,
            time_signature: 1,
            valence: 1,
            key: 1
        };

        var joy = {
            danceability: 1,
            acousticness: 1,
            energy: 1,
            loudness: 1,
            instrumentalness: 1,
            liveness: 1,
            mode: 1,
            speechiness: 1,
            tempo: 1,
            time_signature: 1,
            valence: 1,
            key: 1
        };

        var rage = {
            danceability: 1,
            acousticness: 1,
            energy: 1,
            loudness: 1,
            instrumentalness: 1,
            liveness: 1,
            mode: 1,
            speechiness: 1,
            tempo: 1,
            time_signature: 1,
            valence: 1,
            key: 1
        };


        // const danceability = audio.danceability;
        // const energy = audio.energy;
        // const loudness = audio.loudness;
        // const instrumentalness = audio.instrumentalness;
        // const liveness = audio.liveness;
        // const mode = audio.mode;
        // const speechiness = audio.speechiness;
        // const tempo = audio.tempo;
        // const time_signature = audio.time_signature;
        // const valence = audio.valence;
        // const key = audio.key;

        var audioObject = {
            danceability: audio.danceability,
            acousticness: audio.acousticness,
            energy: audio.energy,
            loudness: audio.loudness,
            instrumentalness: audio.instrumentalness,
            liveness: audio.liveness,
            mode: audio.mode,
            speechiness: audio.speechiness,
            tempo: audio.tempo,
            time_signature: audio.time_signature,
            valence: audio.valence,
            key: audio.key
        };

        switch (feeling) {

            case "Love":
                return this.equals(love, audioObject);
            case "Sorrow":
                return this.equals(sorrow, audioObject);
            case "Joy":
                return this.equals(joy, audioObject);
            case "Rage":
                return this.equals(rage, audioObject);
            default:
                return this.equals(love, audioObject);
        }
    }

    createPlaylist(newPlaylist) {

        this.setState({
            loading: true,
            created: false,
            error: false,
            currentPlaylist: {}
        });

        var context = this;
        var name = this.state.name;

        spotifyWebApi.getMe()
            .then((user) => {

                var options = {
                    name: name,
                    description: "Autogenerated by Spotify Tools by Viktor Frohnapfel",
                    public: false
                };

                spotifyWebApi.createPlaylist(user.id, options)
                    .then((playlist) => {

                        spotifyWebApi.addTracksToPlaylist(playlist.id, newPlaylist)
                            .then((response) => {

                                spotifyWebApi.getPlaylist(playlist.id)
                                    .then((playlist) => {

                                        var image = playlist.images[0].url;

                                        var details = { name: playlist.name, uri: playlist.uri, image: image };

                                        context.setState({
                                            created: true,
                                            loading: false,
                                            currentPlaylist: details
                                        });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        context.setState({
                                            created: false,
                                            loading: false,
                                            error: true
                                        });
                                    });
                            })
                            .catch((err) => {
                                console.log(err);
                                context.setState({
                                    created: false,
                                    loading: false,
                                    error: true
                                });
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        context.setState({
                            created: false,
                            loading: false,
                            error: true
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                context.setState({
                    created: false,
                    loading: false,
                    error: true
                });
            });
    }

    getTracksFeelings(trackIds) {

        var newPlaylist = [];
        var context = this;
        var feeling = this.state.feeling;
        var amount = this.state.amount;
        var newTrackCount = this.state.trackCount;

        spotifyWebApi.getAudioFeaturesForTracks(trackIds).then((response) => {

            response.audio_features.forEach(audio => {


                if (this.matchesFeeling(feeling, audio) && newPlaylist.length < amount) {
                    newPlaylist.push(audio.uri);
                    newTrackCount++;
                    console.log(JSON.stringify(audio));
                }
            });
            context.setState({
                playlist: newPlaylist,
                trackCount: newTrackCount
            });

            // PLAYLIST API
            // create playlist mit infos
            // jeden track von endliste in playlist einfügen
            // tracks in playlist shuffeln -> spotifyWebApi.reorderTracksInPlaylist()
            this.createPlaylist(newPlaylist);

        });
    }


    // TODO tracksfeelings zu promise umformen und mit 1000 tracks testen


    // forEachPromiseTracksFeelings(list, lastTrackId, context, newPlaylist, func) {
    //     return list.reduce(function (promise, list) {
    //         return promise.then(function () {
    //             return func(list, lastTrackId, context, newPlaylist);
    //         });
    //     }, Promise.resolve());
    // }

    // AddFeelingsTracks(list, lastTrackId, context, newPlaylist) {

    //     return new Promise((resolve, reject) => {
    //         process.nextTick(() => {

    //             lastTrackId = context.state.lastTrackId;
    //             options = {};
    //             if (lastTrackId === "") {
    //                 options = { limit: 50 };
    //             } else {
    //                 options = { limit: 50, after: lastTrackId };
    //             }

    //             spotifyWebApi.getFollowedArtists(options).then((response) => {

    //                 response.artists.items.forEach(function (artist) {

    //                     var newArtist = { id: artist.id, name: artist.name };
    //                     newArtists.push(newArtist);
    //                     lastArtistId = artist.id;
    //                 });
    //                 context.setState({
    //                     lastArtistId: lastArtistId
    //                 });
    //                 resolve();
    //             });
    //         });
    //     });
    // }

    // getTracksFeelings() {

    //     var emptyOptions = "";
    //     var total = response.artists.total;
    //     var newArtists = [];
    //     var list = [];
    //     var length = total / 50;
    //     var lastArtistId = "";
    //     var context = this;

    //     for (var i = 0; i < length; i++) {
    //         list.push(1);
    //     }

    //     this.forEachPromiseTracksFeelings(list, emptyOptions, newPlaylist, lastTrackId, context, this.addFeelingsTracks).then(() => {
    //         console.log(newArtists.length + " Artists loaded");
    //         this.setState({
    //             artists: newArtists
    //         });
    //         this.createPlaylist(newPlaylist);
    //     });
    // }


    createFeelingPlaylist() {

        var name = this.state.name;

        if (name !== "") {

            // LIBRARY API
            // alle gespeicherten tracks bekommen -> spotifyWebApi.getMySavedTracks();
            // jeden in liste packen
            this.getSavedTracks(50);
        }
    }

    handleAmountChange(e) {
        this.setState({ amount: e.target.value });
    }

    handleFeelingChange(e) {
        this.setState({ feeling: e.target.value });
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }

    render() {
        var loading = this.state.loading;
        var created = this.state.created;
        var error = this.state.error;
        return (
            <div className="App">
                <h1 style={{ fontFamily: 'Gotham Bold' }}>Create playlists from your library with your current feelings</h1>
                <div className="formLayout">
                    <Form>
                        <Form.Group controlId="form.name">
                            <Form.Label>Playlist Name</Form.Label>
                            <Form.Control type="text" placeholder="e. g. Pure Love" onChange={(event) => this.handleNameChange(event)} />
                        </Form.Group>
                        <Form.Group controlId="form.feeling">
                            <Form.Label>Select feeling...</Form.Label>
                            <Form.Control as="select" onChange={(event) => this.handleFeelingChange(event)}>
                                <option>Love</option>
                                <option>Sorrow</option>
                                <option>Joy</option>
                                <option>Rage</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="form.amount">
                            <Form.Label>Select amount of tracks</Form.Label>
                            <Form.Control as="select" onChange={(event) => this.handleAmountChange(event)}>
                                <option>8</option>
                                <option>16</option>
                                <option>32</option>
                                <option>64</option>
                                <option>96</option>
                                <option>128</option>
                            </Form.Control>
                        </Form.Group>
                        <Button className="button" variant="success"
                            //  onClick={() => this.createFeelingPlaylist()}
                            disabled>
                            {/* Create playlist */}
                            Coming Soon
                         </Button>
                    </Form>
                    {!loading ? <div></div> : <Spinner animation="grow" variant="success" />}
                    {
                        error
                            ?
                            <h3 style={{ marginTop: '20px', fontFamily: 'Gotham Bold' }}>Error occurred</h3>
                            :
                            <div></div>
                    }
                    {
                        created
                            ?
                            <a href={this.state.currentPlaylist.uri} target="_blank" rel="noopener noreferrer">
                                <div className="card" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px' }}>
                                    <div>
                                        <div style={{ float: 'left', borderRadius: '4px' }}>
                                            <img src="https://cdn3.iconfinder.com/data/icons/UltimateGnome/256x256/apps/gnome-cd.png" style={{ borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                        </div>
                                        <div style={{ float: 'left', paddingLeft: '10px', paddingRight: '10px', paddingTop: '3px', paddingBottom: '3px' }} >
                                            <div style={{ fontSize: '18px', fontWeight: '500', color: 'white', margin: 'auto' }}>{this.state.currentPlaylist.name}</div>
                                            <div style={{ fontSize: '16px', fontWeight: '500', color: 'white', margin: 'auto' }}>{this.state.trackCount} Tracks</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            :
                            <div></div>
                    }
                </div>
            </div >
        );
    }
}
export default withRouter(Feelings);