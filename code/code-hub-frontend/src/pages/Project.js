import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import { withRouter } from "react-router";

class Project extends Component {

    render() {
        const projectName = this.props.match.params.projectname;
        return (
            <PageWrapper>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <h1> Project overview: {projectName} </h1>
                </div>
            </PageWrapper>
        );
    }
}

export default withRouter(Project);