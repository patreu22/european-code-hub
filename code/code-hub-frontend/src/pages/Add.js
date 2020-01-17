import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import ECHGitDialogue from '../components/addProjectDialogues/ECHGitDialogue'
import ECHChooseDialogue from '../components/addProjectDialogues/ECHChooseDialogue'
import ECHJsonDialogue from '../components/addProjectDialogues/ECHJsonDialogue'
import ECHManuallyDialogue from '../components/addProjectDialogues/ECHManuallyDialogue'

import { connect } from 'react-redux'
import { resetAddProjectPage } from '../slices/createProjectSlice'


//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Add extends Component {

    componentWillUnmount() {
        this.props.resetAddProjectPage();
    }

    render() {
        var contentToRender;
        switch (this.props.contentType) {
            case "choose":
                contentToRender = <ECHChooseDialogue />;
                break
            case "git":
                contentToRender = <ECHGitDialogue />;
                break
            case "json":
                switch (this.props.currentStep) {
                    case 1:
                        contentToRender = <ECHJsonDialogue />;
                        break
                    case 2:
                        contentToRender = <ECHManuallyDialogue />
                        break
                    default:
                        contentToRender = <ECHJsonDialogue />;
                        break
                }
                break
            case "manually":
                contentToRender = <ECHManuallyDialogue />
                break
            default:
                contentToRender = <ECHChooseDialogue />;
                break
        }

        return (
            <PageWrapper headlineTitle={this.props.pageTitle}>
                {contentToRender}
            </PageWrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        projectData: state.createProject.projectData,
        currentStep: state.createProject.addProjectCurrentStep,
        pageTitle: state.createProject.addProjectPageContent.pageTitle,
        contentType: state.createProject.addProjectPageContent.contentType,
    }
}

const mapDispatchToProps = { resetAddProjectPage }

export default connect(mapStateToProps, mapDispatchToProps)(Add);