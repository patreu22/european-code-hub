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
                    <ECHPaper title="Is your project on Github?" buttonTitle="Add project via Github link">
                        Amazing, we can do all the work for you!
                        We just need the link and a couple of information and we are good to go.
                    </ECHPaper>
                    <ECHPaper title="Do you use a project.json file?" buttonTitle="Add project manually">
                        Also great, we can use it to fill all the necessary fields for you!
                    </ECHPaper>
                </Box>
            </PageWrapper>
        );
    }
}

export default Add;