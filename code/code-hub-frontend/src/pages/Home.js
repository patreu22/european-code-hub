import React, { Component, } from 'react';
import Searchbar from '../components/Searchbar';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper'



class Home extends Component {
    render() {
        return (
            <PageWrapper>
                <h1>Hey there!</h1>
                <h2>Are you looking for a cool Open-Source project?</h2>
                <br />
                <div style={{ width: '50%' }} className="center">
                    <Searchbar />
                </div>
                <br />
                <span>or do you want to add your <Link to="/add">own</Link> project?</span>
                <h3>Just want to have a look around?</h3>
                <span>Browse through the full <Link to="/catalogue">catalogue</Link></span>
            </PageWrapper>
        );
    }
}

export default Home;