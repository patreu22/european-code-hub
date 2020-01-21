import React, { Component, } from 'react';

import PageWrapper from '../components/PageWrapper';
import { withRouter } from "react-router";
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHPaper from '../components/ECHPaper'
import ECHCopyBox from '../components/ECHCopyBox'

import { connect } from 'react-redux'
import { getProjectByName } from '../actions/httpActions'
import { resetCurrentProject } from '../slices/currentProjectSlice'
import { objectExists } from '../helper/objectHelper'

class Project extends Component {

    componentDidMount() {
        const projectName = this.props.match.params.projectname;
        this.props.getProjectByName(projectName)
    }

    render() {
        const content = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this._renderContent()

        return <PageWrapper headlineTitle={this.props.match.params.projectname}>
            {content}
        </PageWrapper>
    }

    componentWillUnmount() {
        this.props.resetCurrentProject()
    }

    _renderContent() {
        const flexContainer = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 0,
            width: '85vw',
            marginTop: '1vh',
            justifyContent: 'flex-start'
        };

        if (objectExists(this.props.currentProject)) {
            console.log(this.props.currentProject)
            return <div style={flexContainer}>
                {this._renderDescriptionBox()}
                {this._renderContactBox()}
                {this._renderCodeBox()}
            </div>
        } else {
            //TODO: No data Placeholder
            return <div></div>
        }
    }

    _renderDescriptionBox() {
        return <ECHPaper title="Description">
            <div>
                {this.props.currentProject.projectDescription}
            </div>
        </ECHPaper>
    }

    _renderCodeBox() {
        const url = this.props.currentProject.repoUrl
        return <ECHPaper title="Code Repository" buttonTitle="Go to repository page" href={url}>
            <ECHCopyBox repoUrl={url} />
        </ECHPaper >
    }

    _renderContactBox() {
        return <ECHPaper title="Contact">
            <div>
                Name: {this.props.currentProject.contact.name} <br />
                Email: <a href={`mailto:${this.props.currentProject.contact.email}`}>{this.props.currentProject.contact.email}</a>
            </div>
        </ECHPaper>
    }
}


const mapStateToProps = state => {
    return {
        currentProject: state.currentProject.currentProject,
        isLoading: state.currentProject.isLoading
    }
}

const mapDispatchToProps = { getProjectByName, resetCurrentProject }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Project));