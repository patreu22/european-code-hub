import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper'
import { Box } from '@material-ui/core';

class Contribute extends Component {

    render() {
        const headlineStyling = {
            margin: 0,
            padding: 10,
            paddingTop: '20px',
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center',
            padding: '2vh 0 2vh 0'
        }
        return (
            <PageWrapper>
                <Box style={heroStyling}>
                    <h1 style={headlineStyling}>Contribute to this project</h1>
                </Box>
            </PageWrapper>
        );
    }
}

export default Contribute;