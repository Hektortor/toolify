import React, { Component } from 'react';
import '../App.css';
import './Releases.css';
import check from '../img/check.png';
import Spotify from 'spotify-web-api-js';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';

const spotifyWebApi = new Spotify();

class Releases extends Component {
    constructor() {
        super();
        const params = this.getHashParams();
        this.state = {
            artists: [],
            releases: [],
            lastArtistId: "",
            lastReleaseId: "",
            typeSelection: 1,
            loading: false
        };
        if (params.access_token) {
            spotifyWebApi.setAccessToken(params.access_token);
        }
    }

    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g, q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    compareReleases(a, b) {
        var aDate = a.date.split('-').join('');
        var bDate = b.date.split('-').join('');

        var aInterpret = a.interpret;
        var bInterpret = b.interpret;

        if (aDate < bDate) {
            return 1;
        } else if (aDate > bDate) {
            return -1;
        } else {
            return aInterpret.localeCompare(bInterpret);
        }
    }

    // forEachPromiseSaves(list, options, newList, lastReleaseId, context, func) {
    //     return list.reduce(function (promise, list) {
    //         return promise.then(function () {
    //             return func(list, options, lastReleaseId, context, newList);
    //         });
    //     }, Promise.resolve());
    // }

    // addSaves(list, options, lastReleaseId, context, newSaves) {

    //     return new Promise((resolve, reject) => {
    //         process.nextTick(() => {

    //             lastReleaseId = context.state.lastReleaseId;
    //             options = {};
    //             if (lastReleaseId === "") {
    //                 options = { limit: 50 };
    //                 list.splice(50);
    //             } else {
    //                 options = { limit: 50, after: lastReleaseId };
    //                 var index = 0;
    //                 for (let i = 0; i < list.length; i++) {
    //                     if (list[i].id === lastReleaseId) {
    //                         index = i;
    //                         break;
    //                     }
    //                 }
    //                 list.splice(0, index + 1);
    //             }

    //             spotifyWebApi.containsMySavedTracks(list, options).then((response) => {

    //                 for (var i = 0; i < response.length; i++) {
    //                     const newSave = { id: list[i], isSaved: response[i] };
    //                     newSaves.push(newSave);
    //                 }

    //                 context.setState({
    //                     lastReleaseId: lastReleaseId
    //                 });
    //                 resolve();
    //             });
    //         });
    //     });
    // }


    // getLibrarySaves() {

    //     var newSaves = [];
    //     var lastReleaseId = "";
    //     var context = this;
    //     var newReleases = this.state.releases;

    //     var options = {};
    //     var newIds = [];
    //     newReleases.forEach(release => {
    //         release.tracks.forEach(track => {
    //             const newId = { id: track.id, isSaved: false };
    //             newIds.push(newId);
    //         });
    //     });

    //     this.forEachPromiseSaves(newIds, options, lastReleaseId, context, this.addSaves).then(() => {
    //         console.log(newSaves.length + " Saves loaded");

    //         newReleases.forEach(release => {

    //             var oneSaved = false;
    //             release.tracks.forEach(track => {

    //                 if (this.isTrackSaved(newSaves, track.id)) {
    //                     track.isSaved = true;
    //                     oneSaved = true;
    //                 }
    //             });
    //             release.isSaved = oneSaved;
    //         });

    //         this.setState({
    //             releases: newReleases,
    //             loading: false
    //         });
    //         this.getLibrarySaves();
    //     });
    // }

    // isTrackSaved(saves, trackId) {

    //     const save = saves.find(track => { return track.id === trackId });

    //     if (typeof saves !== 'undefined' && saves.length > 0 && typeof save !== 'undefined') {
    //         return save.isSaved;
    //     } else {
    //         return false;
    //     }
    // }

    forEachPromiseReleases(list, options, newList, func) {
        return list.reduce(function (promise, list) {
            return promise.then(function () {
                return func(list, options, newList);
            });
        }, Promise.resolve());
    }

    // addReleases(artist, options, newReleases) {
    //     return new Promise((resolve, reject) => {
    //         process.nextTick(() => {
    //             spotifyWebApi.getArtistAlbums(artist.id, options).then((response) => {

    //                 response.items.forEach((album) => {
    //                     var newRelease = {
    //                         interpret: artist.name,
    //                         releaseAlbumId: album.id,
    //                         tracks: [],
    //                         name: album.name,
    //                         type: album.album_type,
    //                         date: album.release_date,
    //                         url: album.external_urls.spotify,
    //                         imageSmall: album.images[2].url,
    //                         isSaved: false
    //                     }
    //                     newReleases.push(newRelease);
    //                     console.log(JSON.stringify(newRelease)); 
    //                 });
    //                 return newReleases;

    //             }).then((newReleases) => {

    //                 var newRelease = newReleases[newReleases.length - 1];

    //                 console.log(JSON.stringify(newRelease));

    //                 spotifyWebApi.getAlbum(newRelease.releaseAlbumId).then((album) => {

    //                     album.tracks.items.forEach(track => {
    //                         newRelease.tracks.push({ id: track.id, isSaved: false });
    //                     });
    //                     // newReleases.push(newRelease);
    //                     resolve();

    //                 });
    //             });
    //         });
    //     });
    // }

    addReleases(artist, options, newReleases) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                spotifyWebApi.getArtistAlbums(artist.id, options).then((response) => {
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
                });
            });
        });
    }

    getLatestReleases() {

        const artists = this.state.artists;
        var newReleases = [];
        var selection = this.state.typeSelection;

        var options = {};
        switch (selection) {
            case 1:
                options = { include_groups: "album", limit: 1 };
                break;
            case 2:
                options = { include_groups: "single", limit: 1 };
                break;
            case 3:
                options = { include_groups: "album,single", limit: 1 };
                break;
            default:
                options = { limit: 1 };
                break;
        }

        this.forEachPromiseReleases(artists, options, newReleases, this.addReleases).then(() => {
            console.log(newReleases.length + " Releases loaded");
            newReleases.sort(this.compareReleases);
            this.setState({
                releases: newReleases,
                loading: false
            });
        });
    }

    forEachPromiseArtists(list, options, newList, lastArtistId, context, func) {
        return list.reduce(function (promise, list) {
            return promise.then(function () {
                return func(list, options, lastArtistId, context, newList);
            });
        }, Promise.resolve());
    }

    addArtists(list, options, lastArtistId, context, newArtists) {

        return new Promise((resolve, reject) => {
            process.nextTick(() => {

                lastArtistId = context.state.lastArtistId;
                options = {};
                if (lastArtistId === "") {
                    options = { limit: 50 };
                } else {
                    options = { limit: 50, after: lastArtistId };
                }

                spotifyWebApi.getFollowedArtists(options).then((response) => {

                    response.artists.items.forEach(function (artist) {

                        var newArtist = { id: artist.id, name: artist.name };
                        newArtists.push(newArtist);
                        lastArtistId = artist.id;
                    });
                    context.setState({
                        lastArtistId: lastArtistId
                    });
                    resolve();
                });
            });
        });
    }

    getFollowedArtists() {

        spotifyWebApi.getFollowedArtists({ limit: 1 }).then((response) => {

            var emptyOptions = "";
            var total = response.artists.total;
            var newArtists = [];
            var list = [];
            var length = total / 50;
            var lastArtistId = "";
            var context = this;

            for (var i = 0; i < length; i++) {
                list.push(1);
            }

            this.forEachPromiseArtists(list, emptyOptions, newArtists, lastArtistId, context, this.addArtists).then(() => {
                console.log(newArtists.length + " Artists loaded");
                this.setState({
                    artists: newArtists
                });
                this.getLatestReleases();
            });
        });

    }

    getNewFollowedArtists() {
        this.setState({
            loading: true
        });
        var artists = this.state.artists;
        if (typeof artists !== 'undefined' && artists.length > 0) {
            this.setState({
                releases: []
            });
            this.getLatestReleases();
        } else {
            this.getFollowedArtists();
        }
    }

    addAlbumToLibrary(id, name) {

        var ids = [];
        ids.push(id);

        spotifyWebApi.addToMySavedAlbums(ids).then((response) => {
            console.log(name + " successfully saved to library");
        });
    }

    // removeAlbumToLibrary(id, name, type) {

    //     var ids = [];
    //     ids.push(id);

    //     spotifyWebApi.removeFromMySavedAlbums(ids).then((response) => {
    //         console.log(name + " successfully removed to library");
    //     });
    // }

    setType(type) {
        this.setState({
            typeSelection: type
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

    // albumIsAlreadySaved(id) {
    //     var ids = [];
    //     ids.push(id);
    //     spotifyWebApi.containsMySavedAlbums(ids).then((response) => {
    //         console.log(id + " -> " + response);
    //         return response;
    //     });
    // }

    render() {
        var loading = this.state.loading;
        var type = this.state.typeSelection;
        return (
            <div style={{ background: 'black', textAlign: 'center' }}>

                <h1 style={{ fontFamily: 'Gotham Bold', color: 'white', marginTop: '0px' }}>New Releases of your Followed Artists</h1>
                {!loading ? <div></div> : <Spinner animation="grow" variant="success" />}

                <div className="formLayout" style={{ margin: '0px', paddingTop: '20px', paddingBottom: '20px', textAlign: 'center' }}>

                    <ToggleButtonGroup variant="success" type="radio" name="typeSelection" defaultValue={1} style={{ margin: '8px', padding: '0px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}>

                        {
                            type === 1 ?
                                <ToggleButton variant="success" style={{ background: 'black', color: 'rgb(15, 185, 88)', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '30px 2px 2px 30px', paddingLeft: '30px' }} onClick={() => this.setType(1)} value={1}>Albums</ToggleButton>
                                :
                                <ToggleButton variant="success" style={{ background: 'black', color: 'white', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '30px 2px 2px 30px', paddingLeft: '30px' }} onClick={() => this.setType(1)} value={1}>Albums</ToggleButton>
                        }
                        {
                            type === 2 ?
                                <ToggleButton variant="success" style={{ background: 'black', color: 'rgb(15, 185, 88)', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }} onClick={() => this.setType(2)} value={2}>Singles</ToggleButton>
                                :
                                <ToggleButton variant="success" style={{ background: 'black', color: 'white', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }} onClick={() => this.setType(2)} value={2}>Singles</ToggleButton>
                        }
                        {
                            type === 3 ?
                                <ToggleButton variant="success" style={{ background: 'black', color: 'rgb(15, 185, 88)', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '2px 30px 30px 2px', paddingRight: '30px' }} onClick={() => this.setType(3)} value={3}>Both</ToggleButton>
                                :
                                <ToggleButton variant="success" style={{ background: 'black', color: 'white', textTransform: 'uppercase', fontWeight: '600', fontSize: '14px', cursor: 'pointer', borderRadius: '2px 30px 30px 2px', paddingRight: '30px' }} onClick={() => this.setType(3)} value={3}>Both</ToggleButton>
                        }

                    </ToggleButtonGroup>

                    <Button variant="success" style={{ width: '260px', background: 'rgb(15, 185, 88)', borderRadius: '30px', textTransform: 'uppercase', fontWeight: '600', paddingRight: '30px', paddingLeft: '30px', fontSize: '14px' }} onClick={() => this.getNewFollowedArtists()}>Check followed artists</Button>

                </div>


                {/* <a href='www.google.de' target="_blank" rel="noopener noreferrer">
                    <div className="cardRelease" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px' }}>
                        <div className="box1" style={{ float: 'left', padding: '0px', borderStyle: 'solid', borderWidth: '1px' }}>

                            <img src='https://www.rap-n-blues.com/wp-content/uploads/2013/09/drake-nothing-was-the-same-cover.jpg' style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />

                            <div style={{ padding: '10px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>Songname</div>
                                <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>Interpret</div>
                            </div>

                        </div>

                        <div className="box2" style={{ padding: '0px', borderStyle: 'solid', borderWidth: '1px' }}>

                            <div style={{}}>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>12 · 04 · 19</div>
                                <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>single</div>
                            </div>

                            <img style={{ width: 30, height: 30, cursor: 'pointer' }} src={check} ref={this.attachRef} onClick={() => this.addAlbumToLibrary("", "")} />

                            <Overlay target={target} show={show} placement="right">
                                {({ placement, scheduleUpdate, arrowProps, ...props }) => (
                                    <div style={{ backgroundColor: 'rgba(255, 100, 100, 0.85)', padding: '2px 10px', color: 'white', borderRadius: 3 }}>Simple tooltip</div>
                                )}
                            </Overlay>

                        </div>
                    </div>
                </a> */}

                {/* <div className="cardRelease" style={{ background: 'rgb(24, 24, 24)' }}>

                    <div id="oben" style={{ height: '64px', clear: 'both' }}>
                        <div id="obenRechts" style={{ float: 'right' }}>
                            <img style={{ width: 30, height: 30, marginTop: '17px', marginBottom: '17px', cursor: 'pointer' }} src={check} ref={this.attachRef} onClick={() => this.addAlbumToLibrary("", "")} />
                        </div>
                        <div id="obenLinks" style={{ float: 'left', height: '64px' }}>
                            <img src='https://www.rap-n-blues.com/wp-content/uploads/2013/09/drake-nothing-was-the-same-cover.jpg' style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                            <div style={{ float: 'left', marginTop: '10px', marginBottom: '10px', marginLeft: '4px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>Songname</div>
                                <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey' }}>Interpret</div>
                            </div>
                        </div>
                    </div>

                    <div id="unten" style={{ clear: 'both', marginTop: '8px', color: 'grey' }}>
                        <div style={{ marginLeft: '6px', fontSize: '14px', fontWeight: '500', float: 'left', wordWrap: 'break-word' }}>12 · 04 · 19</div>
                        <div style={{ marginRight: '6px', fontSize: '12px', fontWeight: '400', float: 'right', wordWrap: 'break-word' }}>single</div>
                    </div>
                </div> */}

                {/* <div className="cardRelease" style={{ background: 'rgb(24, 24, 24)' }}>

                    <div id="oben" style={{ height: '64px', clear: 'both' }}>

                        <div id="obenRechts" style={{ float: 'right' }}>
                            <img style={{ width: 30, height: 30, marginTop: '17px', marginBottom: '17px', cursor: 'pointer' }} src={check} onClick={() => this.addAlbumToLibrary("item.id", "item.name")} />

                        </div>

                        <div id="obenLinks" style={{ float: 'left', height: '64px' }}>
                            <a href="item.url" target="_blank" rel="noopener noreferrer">
                                <img src='https://www.rap-n-blues.com/wp-content/uploads/2013/09/drake-nothing-was-the-same-cover.jpg' style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                            </a>
                        <div style={{ float: 'left', marginTop: '10px', marginBottom: '10px', marginLeft: '4px', overflow: 'auto' }}>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderStyle: 'solid', borderWidth: '1px' }}>item.name</div>
                            <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderStyle: 'solid', borderWidth: '1px' }}>item.interpret</div>
                        </div>
                    </div>
                </div>

                <div id="unten" style={{ clear: 'both', marginTop: '8px', color: 'grey' }}>
                    <div style={{ marginLeft: '6px', fontSize: '14px', fontWeight: '500', float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>this.formatDate(item.date)</div>
                    <div style={{ marginRight: '6px', fontSize: '12px', fontWeight: '400', float: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>item.type</div>
                </div>
            </div> */}



                <ListGroup style={{ background: 'black', textAlign: 'center' }}>
                    {
                        this.state.releases.map(item => {
                            return (
                                <div className="cardRelease" style={{ background: 'rgb(24, 24, 24)', textAlign: 'center' }}>

                                    <div id="oben" style={{ height: '64px', clear: 'both' }}>

                                        <div id="obenRechts" style={{ float: 'right' }}>
                                            <img style={{ width: 30, height: 30, marginTop: '17px', marginBottom: '17px', cursor: 'pointer' }} alt="cover" src={check} onClick={() => this.addAlbumToLibrary(item.id, item.name)} />
                                        </div>

                                        <div id="obenLinks" style={{ float: 'left', height: '64px' }}>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <img src={item.imageSmall} style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />
                                            </a>
                                            <div style={{ float: 'left', marginTop: '10px', marginBottom: '10px', marginLeft: '4px', textAlign: 'left' }}>
                                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                                <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.interpret}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="unten" style={{ clear: 'both', marginTop: '8px', color: 'grey' }}>
                                        <div style={{ marginLeft: '6px', fontSize: '14px', fontWeight: '500', float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{this.formatDate(item.date)}</div>
                                        <div style={{ marginRight: '6px', fontSize: '12px', fontWeight: '400', float: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.type}</div>
                                    </div>
                                </div>

                                // <div className="cardRelease" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px' }}>
                                //     <div className="box1" style={{ float: 'left', padding: '0px' }}>

                                //         <a href={item.url} target="_blank" rel="noopener noreferrer">
                                //             <img src={item.imageSmall} style={{ marginRight: '4px', float: 'left', borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px', cursor: 'pointer' }} alt="cover" />
                                //         </a>

                                //         <div style={{ padding: '10px' }}>
                                //             <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>{item.name}</div>
                                //             <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{item.interpret}</div>
                                //         </div>

                                //     </div>

                                //     <div className="box2" style={{ padding: '0px' }}>

                                //         <div style={{}}>
                                //             <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>{this.formatDate(item.date)}</div>
                                //             <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{item.type}</div>
                                //         </div>

                                //         <img style={{ width: 30, height: 30, cursor: 'pointer' }} src={check} ref={this.attachRef} onClick={() => this.addAlbumToLibrary(item.id, item.name)} />

                                //     </div>
                                // </div>

                                // <a href={item.url} target="_blank" rel="noopener noreferrer">
                                //     <div className="cardRelease" style={{ background: 'rgb(24, 24, 24)', borderColor: '#464646', borderWidth: '2px' }}>
                                //         <div className="box1">
                                //             <div style={{ float: 'left', borderRadius: '4px' }}>
                                //                 <img src={item.imageSmall} style={{ borderRadius: '26px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" />

                                //                 <div style={{ float: 'left', padding: '10px' }} >
                                //                     <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>{item.name}</div>
                                //                     <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{item.interpret}</div>
                                //                 </div>
                                //             </div>
                                //         </div>

                                //         <div className="box2">
                                //             <div style={{ padding: '10px', margin: 'auto' }} >
                                //                 <span className="cardDiv" style={{ margin: '8px' }}>{this.formatDate(item.date)}</span>
                                //                 <div className="cardDiv" style={{ backgroundColor: 'white', borderRadius: '4px', margin: '8px' }}>
                                //                     <div className="badge">{item.type}</div>
                                //                 </div>
                                //                 <img className="cardDiv" style={{ filter: 'invert(1)', width: 30, height: 30, cursor: 'pointer', margin: '8px' }} src={this.check} onClick={() => this.addAlbumToLibrary(item.releaseAlbumId, item.name)} />
                                //             </div>
                                //         </div>
                                //     </div>
                                // </a>
                                // <Card className="card2" style={{ background: 'rgb(24, 24, 24)', borderRadius: '12px', borderColor: '#464646', borderWidth: '2px', margin: '5px' }}>
                                //     <Card.Body className="trackCard" style={{ borderRadius: '10px' }}>
                                //         <div className="box1">
                                //             <div className="cardDiv" style={{ borderRadius: '4px' }}>
                                //                 <a href={item.url} target="_blank" rel="noopener noreferrer"><img src={item.imageSmall} style={{ borderRadius: '8px', borderColor: '#464646', borderWidth: '7px', width: '64px', height: '64px' }} alt="cover" /></a>
                                //             </div>
                                //             <div className="cardDiv" style={{ padding: '10px' }} >
                                //                 <div style={{ fontSize: '14px', fontWeight: '500', color: 'white', margin: 'auto' }}>{item.name}</div>
                                //                 <div style={{ fontSize: '12px', fontWeight: '400', color: 'grey', margin: 'auto' }}>{item.interpret}</div>
                                //             </div>
                                //         </div>
                                // <div className="box2">
                                //     <div style={{ padding: '10px', margin: 'auto' }} >
                                //         <span className="cardDiv" style={{ margin: '8px' }}>{this.formatDate(item.date)}</span>
                                //         <div className="cardDiv" style={{ backgroundColor: 'white', borderRadius: '4px', margin: '8px' }}>
                                //             <div className="badge">{item.type}</div>
                                //         </div>
                                //         {
                                //             /* {
                                //             item.isSaved
                                //                 ?
                                //                 <img className="cardDiv" style={{ filter: 'invert(1)', width: 30, height: 30, cursor: 'pointer', margin: '8px' }} src="http://iconshow.me/media/images/ui/slim-square-icons/png/512/add.png" onClick={() => this.addAlbumToLibrary(item.releaseAlbumId, item.name, item.type)} />
                                //                 :
                                //                 <img className="cardDiv" style={{ filter: 'invert(1)', width: 30, height: 30, cursor: 'pointer', margin: '8px' }} src="https://cdn1.iconfinder.com/data/icons/material-core/20/check-circle-outline-512.png" onClick={() => this.removeAlbumToLibrary(item.releaseAlbumId, item.name, item.type)} />
                                //         } */
                                //         }
                                //         <img className="cardDiv" style={{ filter: 'invert(1)', width: 30, height: 30, cursor: 'pointer', margin: '8px' }} src="./img/check.png" onClick={() => this.addAlbumToLibrary(item.releaseAlbumId, item.name)} />
                                //     </div>
                                // </div>
                                //     </Card.Body>
                                // </Card>
                            )
                        })
                    }
                </ListGroup>
            </div >
        );
    }
}

export default withRouter(Releases);