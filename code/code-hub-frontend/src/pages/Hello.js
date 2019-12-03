import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Hello extends Component {
    render() {
        return (
            < PageWrapper >
                <h1>Hello World!</h1>
            </PageWrapper >
        );
    }
}

export default Hello;