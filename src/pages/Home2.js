import React, { Component } from 'react';
import './extra.css'

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: '',
            tracks: [],
            selected: [],
            recommendations: [],
            value: { min: 0.2, max: 0.8 },
            client_id: '878a266c1fb44e9f9e030135f07c6876',
            client_secret: process.env.CLIENT_SECRET,
        }
        
        this.searchTrack = this.searchTrack.bind(this)
        this.addTrack = this.addTrack.bind(this)
        this.findTracks = this.findTracks.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
        this.remove = this.remove.bind(this)
        this.add = this.add.bind(this)
    }

    // componentDidMount() {
    //     // Set URL Encoded form
    //     var data = new URLSearchParams();
    //     data.append('grant_type', 'client_credentials')
        
    //     // Get API token
    //     fetch('https://accounts.spotify.com/api/token', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //             'Authorization': 'Basic ' + (new Buffer(this.state.client_id + ':' + this.state.client_secret).toString('base64'))
    //         },
    //         body: data
    //     })
    //     .then(response => response.json())
    //     .then(body => {
    //         // token
    //         var accessToken = body.access_token;
    //         this.setState({ token:accessToken });
    //     })
    // }

    searchTrack() {
        // URL for spotify search API
        var url = encodeURI('https://api.spotify.com/v1/search?q=' + document.getElementById('search').value + '&type=track&limit=15')
        // Set URL Encoded form
        var data = new URLSearchParams();
        data.append('grant_type', 'client_credentials')

        // Get API token
        fetch('https://accounts.spotify.com/api/token', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': 'Basic ' + (new Buffer(this.state.client_id + ':' + this.state.client_secret).toString('base64'))
                    },
                    body: data
                })
                .then(response => response.json())
                .then(body => {
                    // token
                    var token = body.access_token;
                    // Use Spotify API to search track
                    fetch(url, {
                            method: "GET",
                            headers: { 'Authorization': 'Bearer ' + token }
                    })
                    .then(response => response.json())
                    .then(body => {
                        if(body.tracks && body.tracks.items.length > 0) {
                            // // print track names
                            // for(var i=0;i<10;i++) {
                            //     console.log(body.tracks.items[i].name + " - " + body.tracks.items[i].artists[0].name + " [" + body.tracks.items[i].id + "]");
                            // }
                            //add tracks to state
                            this.setState({ tracks: body.tracks.items })
                        }else console.log("no search results")
                    })
        })

    } // END OF SEARCHTRACK()

    addTrack(t) {
        var same = false;
        this.state.selected.map( (s,i) => {
            if(t.name === s.name) same = true
            return true
        })

        if(!same) {
            var newArr = this.state.selected
            newArr.push(t)
            this.setState({ selected: newArr })
        }

        // console.log(this.state.selected)
    } // END OF ADDTRACK()

    findTracks() {
        var url = 'https://api.spotify.com/v1/recommendations?limit=12&seed_tracks='
        var search = ''
        this.state.selected.map( (s,i) => {
            search = search + s.id + ','
            return true
        })
        url = encodeURI(url+search)

        // Set URL Encoded form
        var data = new URLSearchParams();
        data.append('grant_type', 'client_credentials')

        // Get API token
        fetch('https://accounts.spotify.com/api/token', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': 'Basic ' + (new Buffer(this.state.client_id + ':' + this.state.client_secret).toString('base64'))
                    },
                    body: data
                })
                .then(response => response.json())
                .then(body => {
                    // token
                    var token = body.access_token;

                    // Use Spotify API to find recommended tracks
                    fetch(url, {
                            method: "GET",
                            headers: { 'Authorization': 'Bearer ' + token }
                        })
                        .then(response => response.json())
                        .then(body => {
                            this.setState({ recommendations: body.tracks })
                    })
                })

    } // END OF FINDTRACKS()

    removeTrack(t) {
        var arr = this.state.selected
        for(var i = arr.length - 1; i >= 0; i--) {
            if(arr[i] === t) {
                arr.splice(i, 1);
            }
        }

        this.setState({ selected:arr })
    } // END OF REMOVETRACK()

    remove(t) {
        var arr = this.state.tracks
        for(var i = arr.length - 1; i >= 0; i--) {
            if(arr[i] === t) {
                arr.splice(i, 1);
            }
        }

        this.setState({ tracks:arr })
    } // END OF REMOVE()

    add(t) {
        var arr = this.state.tracks
        arr.unshift(t)

        this.setState({ tracks:arr })
    } // END OF ADD()


    render() { return (
    <div>
        {/* Banner */}
        <section id="banner">
			<div className="inner">
				<header>
					<h1>This is Channel69</h1>
					<p>Find similar songs based on what you like.</p>
				</header>
				<a href="#main" className="button big alt scrolly">Search</a>
			</div>
		</section>

        <div id="main">
            <section className="wrapper style1">
				<div className="inner">
					{/* Search Bar */}
					<div className="wrap">
						<div className="search 6u">
							<input id="search" type="text" className="searchTerm" placeholder="Track Title"/>
							<button type="submit" className="searchButton" onClick={this.searchTrack}>
							    <i className="fa fa-search"></i>
							</button>
						</div>
					</div>

				    {/* Search results */}
					
						<div className="flex flex-3 extra">
                        {
                            this.state.tracks.map( (t,i) => {
                                var url = "https://open.spotify.com/embed/track/" + t.id
                                return (
                                    <div key={i} className="col" style={{ overflow:"hidden" }}>
                                        <button onClick={() => {this.addTrack(t); this.remove(t)}} >+</button> {t.name} - {t.artists[0].name}
                                        <iframe title={i} src={url} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                                    </div>
                                )
                            })
                        }
						</div>
					
				</div>
            </section> 

            <section className="wrapper style2">
				<div className="inner">
					<header className="align-center">
						<h2>Your Tracks</h2>
                        {
                            this.state.selected.length === 0 &&
                                <p>It's empty. Try searching songs.</p>
                        }
					</header>
                    <div className="flex flex-3 extra">
                        {
                            this.state.selected.map( (t,i) => {
                                var url = "https://open.spotify.com/embed/track/" + t.id
                                return (
                                    <div key={i} className="col" style={{ overflow:"hidden" }}>
                                        <button onClick={() => {this.removeTrack(t); this.add(t)}} >x</button> {t.name} - {t.artists[0].name}
                                        <iframe title={i} src={url} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        this.state.selected.length >= 1 &&
                            <div className="align-center"><button onClick={this.findTracks} >Find Tracks</button></div>
                    }
				</div>
				</section>

            <section className="wrapper style1">
				<div className="inner">
					<header className="align-center">
						<h2>Similar Tracks</h2>
						{
                            this.state.selected.length === 0 &&
                                <p>It's empty. Try adding songs.</p>
                        }
					</header>

                    <div className="flex flex-3">
                    {
                        this.state.recommendations.map( (t,i) => {
                            var url = "https://open.spotify.com/embed/track/" + t.id
                            return (
                                <div key={i} className="col">
                                    <iframe title={i} src={url} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                                </div>
                            )
                        })
                    }
					</div>
				</div>
			</section>
        </div>

        <footer id="footer">
				<div class="copyright">
					<ul class="icons">
						<li><a href="https://twitter.com/jcdarcilla" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
						<li><a href="https://www.facebook.com/jcdarcilla" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
						<li><a href="https://instagram.com/jcdarcilla" class="icon fa-instagram"><span class="label">Instagram</span></a></li>
						<li><a href="https://www.snapchat.com/add/jcdarcilla" class="icon fa-snapchat"><span class="label">Snapchat</span></a></li>
					</ul>
					&copy; Untitled. Design: <a href="https://templated.co">TEMPLATED</a>. Images: <a href="https://unsplash.com">Coverr</a>.
				</div>
			</footer>

    </div>
    )}

}

export default Home
