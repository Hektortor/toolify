/* eslint-disable no-cond-assign */
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
            lastTrackIndex: 0,
            lastFeelingIndex: 0,
            loading: false,
            created: false,
            error: false,
            errorText: "Error occurred",
            name: "Deep Love",
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

    forEachPromise(list, newList, context, func) {
        return list.reduce(function (promise) {
            return promise.then(function () {
                return func(newList, context);
            });
        }, Promise.resolve());
    }

    createFeelingPlaylist() {

        var name = this.state.name;
        if (name !== "") {
            this.getSavedTracks();
        }
    }

    getSavedTracks() {
        this.setState({
            loading: true,
            error: false,
            created: false,
            playlist: [],
            currentPlaylist: {}
        });

        var context = this;

        spotifyWebApi.getMySavedTracks({ limit: 1 })
            .then((response) => {

                var newTracks = [];
                var list = [];
                var length = response.total / 50;

                for (var i = 0; i < length; i++) {
                    list.push(1);
                }

                context.forEachPromise(list, newTracks, context, this.addSavedTracks)
                    .then(() => {
                        console.log(newTracks.length + " Tracks loaded");
                        this.setState({
                            tracks: newTracks
                        });
                        this.getTracksFeelings();
                    });
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                    error: true,
                    created: false,
                    errorText: err
                });
            });
    }

    addSavedTracks(newTracks, context) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {

                var lastTrackIndex = context.state.lastTrackIndex;
                var options = {};
                if (lastTrackIndex === 0) {
                    options = { limit: 50 };
                } else {
                    options = { limit: 50, offset: lastTrackIndex };
                }

                spotifyWebApi.getMySavedTracks(options)
                    .then((response) => {

                        response.items.forEach((track) => {

                            newTracks.push(track.track.id);
                        });
                        context.setState({
                            lastTrackIndex: lastTrackIndex + 50
                        });
                        resolve();
                    })
                    .catch((err) => {
                        context.setState({
                            loading: false,
                            error: true,
                            created: false,
                            errorText: err
                        });
                    });
            });
        });
    }

    getTracksFeelings() {

        var tracks = this.state.tracks;
        var newPlaylist = [];
        var list = [];
        var context = this;
        var length = tracks.length / 100;

        for (var i = 0; i < length; i++) {
            list.push(1);
        }

        this.forEachPromise(list, newPlaylist, context, this.addTracksFeelings).then(() => {
            console.log(newPlaylist.length + " Tracks in Playlist loaded");

            this.shuffleArray(newPlaylist);
            this.setState({
                playlist: newPlaylist
            });

            this.createPlaylist(newPlaylist);
        });
    }

    addTracksFeelings(newPlaylist, context) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {


                var feeling = context.state.feeling;
                var amount = context.state.amount;
                var newTrackCount = context.state.trackCount;
                var lastFeelingIndex = context.state.lastFeelingIndex;
                var trackIds = context.state.tracks;

                var newTrackIds = [];
                trackIds.forEach(id => {
                    newTrackIds.push(id);
                });

                if (lastFeelingIndex === 0) {

                    newTrackIds.splice(100);
                    lastFeelingIndex = newTrackIds.length - 1;

                } else {

                    var first = lastFeelingIndex + 1;
                    var last = first + 99;

                    if (last > newTrackIds.length - 1) {
                        lastFeelingIndex = newTrackIds.length - 1;
                        newTrackIds.splice(0, first - 1);
                    } else {
                        newTrackIds.splice(0, first - 1);
                        newTrackIds.splice(100);
                        lastFeelingIndex = last;
                    }
                }

                spotifyWebApi.getAudioFeaturesForTracks(newTrackIds)
                    .then((response) => {

                        response.audio_features.forEach(audio => {

                            if (context.matchesFeeling(feeling, audio) && newPlaylist.length < amount) {
                                newPlaylist.push(audio.uri);
                                newTrackCount++;
                            }
                        });
                        context.setState({
                            trackCount: newTrackCount,
                            lastFeelingIndex: lastFeelingIndex
                        });
                        resolve();
                    })
                    .catch((err) => {
                        context.setState({
                            loading: false,
                            created: false,
                            error: true,
                            errorText: err
                        });
                    });
            });
        });
    }

    equals(feeling, audio) {


        if (feeling.danceabilityMin > audio.danceability || feeling.danceabilityMax < audio.danceability) {
            return false;
        }

        if (feeling.acousticnessMin > audio.acousticness || feeling.acousticnessMax < audio.acousticness) {
            return false;
        }

        if (feeling.energyMin > audio.energy || feeling.energyMax < audio.energy) {
            return false;
        }

        if (feeling.loudnessMin > audio.loudness || feeling.loudnessMax < audio.loudness) {
            return false;
        }

        if (feeling.instrumentalnessMin > audio.instrumentalness || feeling.instrumentalnessMax < audio.instrumentalness) {
            return false;
        }

        if (feeling.livenessMin > audio.liveness || feeling.livenessMax < audio.liveness) {
            return false;
        }

        if (feeling.modeMin > audio.mode || feeling.modeMax < audio.mode) {
            return false;
        }

        if (feeling.speechinessMin > audio.speechiness || feeling.speechinessMax < audio.speechiness) {
            return false;
        }

        if (feeling.tempoMin > audio.tempo || feeling.tempoMax < audio.tempo) {
            return false;
        }

        if (feeling.time_signatureMin > audio.time_signature || feeling.time_signatureMax < audio.time_signature) {
            return false;
        }

        if (feeling.valenceMin > audio.valence || feeling.valenceMax < audio.valence) {
            return false;
        }

        if (feeling.keyMin > audio.key || feeling.keyMax < audio.key) {
            return false;
        }

        return true;
    }

    matchesFeeling(feeling, audio) {

        // danceability     -> 0.0 - 1.0    , including tempo, rhythm stability, beat strength, and overall regularity
        // acousticness     -> 0.0 - 1.0    , 1.0 represents high confidence the track is acoustic
        // energy           -> 0.0 - 1.0    , intensity and activity, For example, death metal has high energy, while a Bach prelude scores low on the scale.
        // loudness         -> -60 - 0      , lautstärke
        // instrumentalness -> 0.0 - 1.0    , high means its an instrumental
        // liveness         -> 0.0 - 1.0    , je höher desto mehr live aufnahme
        // mode             -> 0.0 - 1.0    , dur = 1, moll = 0
        // speechiness      -> 0.0 - 1.0    , 1 = e.g. talk show, audio book, poetry; 0.66 = music with little text part; 0.33 = music
        // tempo            -> 0.0 - 200.0  , tempo
        // time_signature   -> 0   - 20     , how many beats are in each bar
        // valence          -> 0.0 - 1.0    , high = positive (e.g. happy, cheerful, euphoric), low = negative (e.g. sad, depressed, angry)
        // key              -> 0   - 12     , Tonart

        var love = {
            danceabilityMax: 1.0,
            danceabilityMin: 0.0,
            acousticnessMax: 1.0,
            acousticnessMin: 0.3,
            energyMax: 1.0,
            energyMin: 0.0,
            loudnessMax: 0,
            loudnessMin: -60,
            instrumentalnessMax: 1.0,
            instrumentalnessMin: 0.0,
            livenessMax: 1.0,
            livenessMin: 0.0,
            modeMax: 1.0,
            modeMin: 0.0,
            speechinessMax: 1.0,
            speechinessMin: 0.0,
            tempoMax: 100.0,
            tempoMin: 0.0,
            time_signatureMax: 20,
            time_signatureMin: 0,
            valenceMax: 1.0,
            valenceMin: 0.5,
            keyMax: 12,
            keyMin: 0
        };

        var sorrow = {
            danceabilityMax: 0.7,
            danceabilityMin: 0.0,
            acousticnessMax: 1.0,
            acousticnessMin: 0.0,
            energyMax: 1.0,
            energyMin: 0.0,
            loudnessMax: -2,
            loudnessMin: -60,
            instrumentalnessMax: 1.0,
            instrumentalnessMin: 0.0,
            livenessMax: 1.0,
            livenessMin: 0.0,
            modeMax: 1.0,
            modeMin: 0.0,
            speechinessMax: 1.0,
            speechinessMin: 0.0,
            tempoMax: 100.0,
            tempoMin: 0.0,
            time_signatureMax: 20,
            time_signatureMin: 0,
            valenceMax: 0.5,
            valenceMin: 0.0,
            keyMax: 12,
            keyMin: 0
        };

        var nightDrive = {
            danceabilityMax: 1.0,
            danceabilityMin: 0.0,
            acousticnessMax: 1.0,
            acousticnessMin: 0.0,
            energyMax: 0.5,
            energyMin: 0.0,
            loudnessMax: 0,
            loudnessMin: -20,
            instrumentalnessMax: 1.0,
            instrumentalnessMin: 0.0,
            livenessMax: 0.3,
            livenessMin: 0.0,
            modeMax: 1.0,
            modeMin: 0.0,
            speechinessMax: 1.0,
            speechinessMin: 0.0,
            tempoMax: 300.0,
            tempoMin: 90.0,
            time_signatureMax: 20,
            time_signatureMin: 0,
            valenceMax: 0.3,
            valenceMin: 0.0,
            keyMax: 12,
            keyMin: 0
        };

        var joy = {
            danceabilityMax: 1.0,
            danceabilityMin: 0.3,
            acousticnessMax: 1.0,
            acousticnessMin: 0.0,
            energyMax: 1.0,
            energyMin: 0.1,
            loudnessMax: 0,
            loudnessMin: -15,
            instrumentalnessMax: 1.0,
            instrumentalnessMin: 0.0,
            livenessMax: 1.0,
            livenessMin: 0.0,
            modeMax: 1.0,
            modeMin: 0.0,
            speechinessMax: 0.7,
            speechinessMin: 0.0,
            tempoMax: 300.0,
            tempoMin: 80.0,
            time_signatureMax: 20,
            time_signatureMin: 0,
            valenceMax: 1.0,
            valenceMin: 0.7,
            keyMax: 12,
            keyMin: 0
        };

        var lateNight = {
            danceabilityMax: 1.0,
            danceabilityMin: 0.5,
            acousticnessMax: 0.8,
            acousticnessMin: 0.0,
            energyMax: 1.0,
            energyMin: 0.5,
            loudnessMax: 0,
            loudnessMin: -20,
            instrumentalnessMax: 0.7,
            instrumentalnessMin: 0.0,
            livenessMax: 1.0,
            livenessMin: 0.0,
            modeMax: 1.0,
            modeMin: 0.0,
            speechinessMax: 1.0,
            speechinessMin: 0.2,
            tempoMax: 300.0,
            tempoMin: 90.0,
            time_signatureMax: 20,
            time_signatureMin: 0,
            valenceMax: 1.0,
            valenceMin: 0.5,
            keyMax: 12,
            keyMin: 0
        };

        var summerVibes = {
            danceabilityMax: 1.0,
            danceabilityMin: 0.7,
            acousticnessMax: 1.0,
            acousticnessMin: 0.0,
            energyMax: 1.0,
            energyMin: 0.0,
            loudnessMax: 0,
            loudnessMin: -10,
            instrumentalnessMax: 1.0,
            instrumentalnessMin: 0.0,
            livenessMax: 1.0,
            livenessMin: 0.0,
            modeMax: 1.0,
            modeMin: 0.0,
            speechinessMax: 1.0,
            speechinessMin: 0.0,
            tempoMax: 300.0,
            tempoMin: 80.0,
            time_signatureMax: 20,
            time_signatureMin: 0,
            valenceMax: 1.0,
            valenceMin: 0.7,
            keyMax: 12,
            keyMin: 0
        };

        var power = {
            danceabilityMax: 1.0,
            danceabilityMin: 0.5,
            acousticnessMax: 1.0,
            acousticnessMin: 0.0,
            energyMax: 1.0,
            energyMin: 0.7,
            loudnessMax: 0,
            loudnessMin: -7,
            instrumentalnessMax: 1.0,
            instrumentalnessMin: 0.0,
            livenessMax: 1.0,
            livenessMin: 0.0,
            modeMax: 1.0,
            modeMin: 0.0,
            speechinessMax: 1.0,
            speechinessMin: 0.0,
            tempoMax: 200.0,
            tempoMin: 80.0,
            time_signatureMax: 20,
            time_signatureMin: 0,
            valenceMax: 1.0,
            valenceMin: 0.5,
            keyMax: 12,
            keyMin: 0
        };

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

            case "Deep Love":
                return this.equals(love, audioObject);
            case "Fuckin' Sorrow":
                return this.equals(sorrow, audioObject);
            case "Pure Joy":
                return this.equals(joy, audioObject);
            case "Night Drive":
                return this.equals(nightDrive, audioObject);
            case "Late Night":
                return this.equals(lateNight, audioObject);
            case "Summer Vibes":
                return this.equals(summerVibes, audioObject);
            case "Full Power":
                return this.equals(power, audioObject);
            default:
                return this.equals(love, audioObject);
        }
    }

    createPlaylist(newPlaylist) {

        var context = this;
        var name = this.state.name;

        if (newPlaylist.length > 0) {

            spotifyWebApi.getMe()
                .then((user) => {

                    var options = {
                        name: name,
                        description: "Generated by Toolify by Viktor Frohnapfel",
                        public: false
                    };

                    spotifyWebApi.createPlaylist(user.id, options)
                        .then((playlist) => {

                            spotifyWebApi.addTracksToPlaylist(playlist.id, newPlaylist)
                                .then(() => {

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
                                            context.setState({
                                                created: false,
                                                loading: false,
                                                error: true,
                                                errorText: err
                                            });
                                        });
                                })
                                .catch((err) => {
                                    context.setState({
                                        created: false,
                                        loading: false,
                                        error: true,
                                        errorText: err
                                    });
                                });
                        })
                        .catch((err) => {
                            context.setState({
                                created: false,
                                loading: false,
                                error: true,
                                errorText: err
                            });
                        });
                })
                .catch((err) => {
                    context.setState({
                        created: false,
                        loading: false,
                        error: true,
                        errorText: err
                    });
                });

        } else {
            context.setState({
                created: false,
                loading: false,
                error: true,
                errorText: "No matching song found! :("
            });
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
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
        var errorText = this.state.errorText;
        return (
            <div className="App container">
                <h1 className="title">Create Playlists from your Library Tracks based on your current Mood</h1>
                {!loading ? <div></div> : <Spinner animation="grow" variant="success" />}
                <div className="formLayout">
                    <Form>
                        <Form.Group controlId="form.name">
                            <Form.Label>Title of Playlist</Form.Label>
                            <Form.Control type="text" placeholder="e. g. Deep Love" onChange={(event) => this.handleNameChange(event)} />
                        </Form.Group>
                        <Form.Group controlId="form.feeling">
                            <Form.Label>Select Feeling...</Form.Label>
                            <Form.Control as="select" onChange={(event) => this.handleFeelingChange(event)}>
                                <option>Deep Love</option>
                                <option>Fuckin' Sorrow</option>
                                <option>Pure Joy</option>
                                <option>Night Drive</option>
                                <option>Late Night</option>
                                <option>Summer Vibes</option>
                                <option>Full Power</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="form.amount">
                            <Form.Label>Select Amount of Tracks...</Form.Label>
                            <Form.Control as="select" onChange={(event) => this.handleAmountChange(event)}>
                                <option>8</option>
                                <option>16</option>
                                <option>32</option>
                                <option>64</option>
                                <option>96</option>
                            </Form.Control>
                        </Form.Group>
                        <Button className="button" variant="success" onClick={() => this.createFeelingPlaylist()}>Create playlist</Button>
                    </Form>
                    {
                        error
                            ?
                            <h3 className="title">{errorText}</h3>
                            :
                            <div></div>
                    }
                    {
                        created
                            ?
                            <a href={this.state.currentPlaylist.uri} target="_blank" rel="noopener noreferrer">
                                <div className="card" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px', marginTop: '20px' }}>
                                    <div>
                                        <div style={{ float: 'left', borderRadius: '4px' }}>
                                            <img src={this.state.currentPlaylist.image} style={{ borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                        </div>
                                        <div style={{ float: 'left', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px' }} >
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
            </div>
        );
    }
}
export default withRouter(Feelings);