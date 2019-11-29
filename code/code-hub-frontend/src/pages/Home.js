import React, { Component, } from 'react';
import Toolbar from '../components/Toolbar';
// import Placeholder from '../components/Placeholder';
// import { makeStyles } from '@material-ui/core/styles';
import { Search as SearchIcon } from '@material-ui/icons';
import { Box, InputBase } from '@material-ui/core';
import { Link } from 'react-router-dom';



class Home extends Component {
    render() {
        return (
            <div>
                <Toolbar />
                <h1>Hey there!</h1>
                <h2>Are you looking for a cool Open-Source project?</h2>
                <div >
                    <div>
                        <SearchIcon />
                        <InputBase
                            placeholder="Search…"
                        />
                    </div>
                </div>
                <span>or do you want to add your <Link to="/add">own</Link> project?</span>
                <h3>Just want to have a look around?</h3>
                <p>Browse through the full <Link to="/catalogue">catalogue</Link></p>
            </div>
        );
    }

}

export default Home;