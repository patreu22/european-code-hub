import React, { Component, } from 'react';
import Toolbar from '../components/Toolbar';
import Searchbar from '../components/Searchbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../css/Home.css';



class Home extends Component {
    render() {
        return (
            <div>
                <Toolbar />
                <div className="home">
                    <h1>Hey there!</h1>
                    <h2>Are you looking for a cool Open-Source project?</h2>
                    <br />
                    <div style={{ width: '50%' }} className="center">
                        <Searchbar placeholderText />
                    </div>
                    <br />
                    <span>or do you want to add your <Link to="/add">own</Link> project?</span>
                    <h3>Just want to have a look around?</h3>
                    <p>Browse through the full <Link to="/catalogue">catalogue</Link></p>
                    <h1>Hey there!</h1>
                    <h2>Are you looking for a cool Open-Source project?</h2>
                    <br />
                    <div style={{ width: '50%' }} className="center">
                        <Searchbar placeholderText />
                    </div>
                    <br />
                    <span>or do you want to add your <Link to="/add">own</Link> project?</span>
                    <h3>Just want to have a look around?</h3>
                    <p>Browse through the full <Link to="/catalogue">catalogue</Link></p>
                    <h1>Hey there!</h1>
                    <h2>Are you looking for a cool Open-Source project?</h2>
                    <br />
                    <div style={{ width: '50%' }} className="center">
                        <Searchbar placeholderText />
                    </div>
                    <br />
                    <span>or do you want to add your <Link to="/add">own</Link> project?</span>
                    <h3>Just want to have a look around?</h3>
                    <p>Browse through the full <Link to="/catalogue">catalogue</Link></p>
                    <h1>Hey there!</h1>
                    <h2>Are you looking for a cool Open-Source project?</h2>
                    <br />
                    <div style={{ width: '50%' }} className="center">
                        <Searchbar placeholderText />
                    </div>
                    <br />
                    <span>or do you want to add your <Link to="/add">own</Link> project?</span>
                    <h3>Just want to have a look around?</h3>
                    <p>Browse through the full <Link to="/catalogue">catalogue</Link></p>
                </div>
                <Footer />
            </div>
        );
    }

}

export default Home;