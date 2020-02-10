import React, { Component, } from 'react';
import PageWrapper from '../../components/PageWrapper'
import ECHPaper from '../../components/ECHPaper'

class AddViaGithub extends Component {

    render() {
        return <PageWrapper headlineTitle={"Add project via Github repository"} showBackButton={true}>
            <div>
                <ECHPaper type="addProjectViaGit" title="Enter URL"></ECHPaper>
            </div>
        </PageWrapper>
    }
}

export default AddViaGithub;
