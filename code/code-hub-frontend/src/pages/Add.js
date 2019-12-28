import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Add extends Component {
    render() {
        return (
            <PageWrapper headlineTitle="Add a new project">
            </PageWrapper>
        );
    }
}

export default Add;