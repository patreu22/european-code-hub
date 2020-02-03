import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import ECHGitDialogue from '../components/addProjectDialogues/ECHGitDialogue'
import ECHChooseDialogue from '../components/addProjectDialogues/ECHChooseDialogue'
import ECHJsonDialogue from '../components/addProjectDialogues/ECHJsonDialogue'
import ECHManuallyDialogue from '../components/addProjectDialogues/ECHManuallyDialogue'
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'

import { connect } from 'react-redux'
import { resetAddProjectPage } from '../slices/createProjectSlice'


class Add extends Component {

    componentWillUnmount() {
        this.props.resetAddProjectPage();
    }

    render() {
        const content = this.props.isLoading ? <ECHLoadingIndicator /> : this._renderContent()
        return (
            <PageWrapper headlineTitle={this.props.pageTitle} showBackButton={true}>
                {content}
            </PageWrapper>
        );
    }

    _renderContent() {
        switch (this.props.contentType) {
            case "choose":
                return <ECHChooseDialogue />;
            case "git":
                return <ECHGitDialogue />
            case "json":
                return <ECHJsonDialogue />;
            case "manually":
                return <ECHManuallyDialogue />
            default:
                return <ECHChooseDialogue />;
        }
    }
}

const mapStateToProps = state => {
    return {
        pageTitle: state.createProject.addProjectPageContent.pageTitle,
        contentType: state.createProject.addProjectPageContent.contentType,
        isLoading: state.createProject.isLoading
    }
}

const mapDispatchToProps = { resetAddProjectPage }

export default connect(mapStateToProps, mapDispatchToProps)(Add);