import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import ECHPaper from '../components/ECHPaper'
import { Box } from '@material-ui/core';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Add extends Component {
    render() {
        return (
            <PageWrapper headlineTitle="Add a new project">
                <Box flexDirection="row" flex="1" display="flex">
                    <ECHPaper title="Is your project on Github?">
                        Amazing, we can do all the work for you!
                    </ECHPaper>
                    <ECHPaper title="Do you use a project.json file?">
                        Also great, we can use it to fill all the necessary fields for you!
                    </ECHPaper>
                </Box>
            </PageWrapper>
        );
    }
}

export default Add;