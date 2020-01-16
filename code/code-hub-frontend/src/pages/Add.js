import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import { connect } from 'react-redux'
import ECHGitDialogue from '../components/addProjectDialogues/ECHGitDialogue'
import ECHChooseDialogue from '../components/addProjectDialogues/ECHChooseDialogue'
import ECHJsonDialogue from '../components/addProjectDialogues/ECHJsonDialogue'
import ECHManuallyDialogue from '../components/addProjectDialogues/ECHManuallyDialogue'

import { resetAddProjectPage } from '../slices/ProjectSlice'


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
        projectData: state.projectData,
        currentStep: state.addProjectCurrentStep,
        pageTitle: state.addProjectPageContent.pageTitle,
        contentType: state.addProjectPageContent.contentType,
    }
}

const mapDispatchToProps = { resetAddProjectPage }

export default connect(mapStateToProps, mapDispatchToProps)(Add);