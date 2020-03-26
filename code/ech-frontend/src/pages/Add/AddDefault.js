import React, { Component } from 'react';
import '../../css/Home.css';
import PageWrapper from '../../components/PageWrapper';
import { Box } from '@material-ui/core'
import ECHPaper from '../../components/ECHPaper'

import { ADD_VIA_GITHUB, ADD_VIA_JSON, ADD_MANUALLY } from '../../routes'


class AddDefault extends Component {
    render() {
        return (
            <PageWrapper headlineTitle="Add a new project to the catalogue" showBackButton={true}>
                {this._renderContent()}
            </PageWrapper>
        );
    }

    _renderContent() {
        return <Box style={{ flexDirection: "row", display: 'flex' }}>
            <ECHPaper title="Do you use a Github repository?" buttonTitle="Add project via git link" buttonLink={ADD_VIA_GITHUB}>
                <div>
                    Amazing, we can do nearly all the work for you!
                    We just need the link and a couple of information and we are good to go.
                </div>
            </ECHPaper>
            <ECHPaper title="Submit a Code.json file?" buttonTitle="Add by file upload" buttonLink={ADD_VIA_JSON}>
                <div>
                    If your organization uses a Code.json file to store project metadata you can use it here to create a new entry automatically.
                </div>
            </ECHPaper>
            <ECHPaper title="Add it manually?" buttonTitle="Add project manually" buttonLink={ADD_MANUALLY}>
                <div>
                    Also great, we it only takes a couple of minutes and will help other people tremendously finding your project.
                </div>
            </ECHPaper>
        </Box>
    }
}

export default AddDefault;