import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import InputGroup from 'react-bootstrap/InputGroup'
// import InputRange from 'react-input-range';
import {Search} from 'react-bootstrap-icons'
import 'react-input-range/lib/css/index.css'

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tracks: [],
            selected: [],
            recommendations: [],
            value: { min: 0.2, max: 0.8 },
            client_id: '878a266c1fb44e9f9e030135f07c6876',
            client_secret: 'f64c8b888d1d40eeabbbf162f6650b2b',
        }
        
        this.searchTrack = this.searchTrack.bind(this)
        this.addTrack = this.addTrack.bind(this)
        this.findTracks = this.findTracks.bind(this)
        this.removeTrack = this.removeTrack.bind(this)
    }

    searchTrack() {
        // URL for spotify search API
        var url = encodeURI('https://api.spotify.com/v1/search?q=' + document.getElementById('search').value + '&type=track&limit=10')
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
        var url = 'https://api.spotify.com/v1/recommendations?limit=10&seed_tracks='
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
    } // END OF REMOVETRACK()

    renderNavbar() {
        return (
            <Container>
                <Navbar className="tb-navbar justify-content-center fixed-top" variant="dark" bg="dark">	
                    <Nav className="tb-nav">
                        <Nav.Item>
                            <Nav.Link href="/" active="true">channel69</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar>
            </Container>

        )
    }


    render() { return (
        <div>
            {/* Navbar */}
            <Row>{this.renderNavbar()}</Row>

            {/* Get Recommendations */}
            
            <Row style={{ paddingTop:55 }}>
                
                {/* Selected and Searches */}
                <Col md={{ span:3, offset:2 }}>
                {/* Selected Tracks */}
                {
                    this.state.selected.map( (t,i) => {
                        var url = "https://open.spotify.com/embed/track/" + t.id
                        return (
                            <Row key={i} className="pt-1 pb-1 pl-2">
                                <Button type="Button" variant="danger" onClick={() => this.removeTrack(t)} >x</Button>
                                {/* <p>{t.name} - {t.artists[0].name}</p> */}
                                <iframe title={i} src={url} width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                            </Row>
                        )
                    })
                }
                {
                    this.state.selected.length >= 2 &&
                        <Row className="pt-1 pb-1"><Button type="Button" variant="info" onClick={this.findTracks} >Find tracks!</Button></Row>
                }
                
                {/* Search Bar */}
                <InputGroup className="mt-2 mb-2">
                    <Form.Control id="search" type="text" placeholder="Track Title"/> 
                    <InputGroup.Append>
                        <Button size="sm" type="Button" variant="dark" onClick={this.searchTrack} ><Search/></Button>
                    </InputGroup.Append>                
                </InputGroup>

                {/* Search Results */}
                {
                    this.state.tracks.map( (t,i) => {
                        var url = "https://open.spotify.com/embed/track/" + t.id
                        return (
                            <Row key={i} className="pt-1 pb-1 pl-2">
                                <Button type="Button" variant="dark" onClick={() => this.addTrack(t)} >+</Button>
                                {/* <p>{t.name} - {t.artists[0].name}</p> */}
                                <iframe title={i} src={url} width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                            </Row>
                        )
                    })
                }

                </Col>
                
                
                {/* Recommendations */}
                <Col md={{ span:3, offset:2 }}>
                {
                    this.state.recommendations.map( (r,i) => {
                        var url = "https://open.spotify.com/embed/track/" + r.id
                        return (
                            <Row key={i} className="pt-1 pb-1" style={{backgroundColor:"gray"}}>
                                {/* <p>{r.name} - {r.artists[0].name}</p> */}
                                <iframe title={i} src={url} style={{marginLeft:45}} width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                            </Row> 
                        )
                    })
                }
                </Col>
                
            </Row>

            


            {/* Slider */}
            {/* <Container>
                <Jumbotron>
                    <InputRange
                        maxValue={1}
                        minValue={0}
                        step={0.01}
                        value={this.state.value}
                        onChange={value => this.setState({ value })} />
                </Jumbotron>
            </Container> */}




        </div>)
    }
}

export default Home
