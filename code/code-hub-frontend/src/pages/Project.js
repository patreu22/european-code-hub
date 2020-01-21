import React, { Component, } from 'react';
import PageWrapper from '../components/PageWrapper';
import { withRouter } from "react-router";
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'

import { connect } from 'react-redux'
import { getProjectByName } from '../actions/httpActions'

class Project extends Component {

    componentDidMount() {
        const projectName = this.props.match.params.projectname;
        this.props.getProjectByName(projectName)
    }

    render() {
        return <PageWrapper headlineTitle={this.props.match.params.projectname}>
            {this.props.isLoading
                ? <ECHLoadingIndicator />
                : this._renderContent()}
        </PageWrapper>
    }

    _renderContent() {
        if (this.props.currentProject) {
            return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1> Project overview: {'projectName'} </h1>
                {this.props.currentProject.projectName}
                {this.props.currentProject.projectDescription}
            </div>
        } else {
            //TODO: No data Placeholder
            return <div></div>
        }
    }
}


const mapStateToProps = state => {
    return {
        currentProject: state.currentProject.currentProject,
        isLoading: state.currentProject.isLoading
    }
}

const mapDispatchToProps = { getProjectByName }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Project));