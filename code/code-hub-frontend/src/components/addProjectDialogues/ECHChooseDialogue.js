import React, { Component, } from 'react';
import { Box } from '@material-ui/core'
import { connect } from 'react-redux'
import { updateAddProjectPageContent, incrementSteps } from '../../slices/createProjectSlice'
import ECHPaper from '../ECHPaper'


class ECHChooseDialogue extends Component {

    render() {
        return <Box flexDirection="row" flex="1" display="flex">
            <ECHPaper title="Do you use a Github repository?" buttonTitle="Add project via git link" onButtonClickHandler={this.onGitClick}>
                <div>
                    Amazing, we can do nearly all the work for you!
                    We just need the link and a couple of information and we are good to go.
                </div>
            </ECHPaper>
            <ECHPaper title="Submit a Code.json file?" buttonTitle="Add by file upload" onButtonClickHandler={this.onCodeJsonClick}>
                <div>
                    If your organization uses a Code.json file to store project metadata you can use it here to create a new entry automatically.
                </div>
            </ECHPaper>
            <ECHPaper title="Add it manually?" buttonTitle="Add project manually" onButtonClickHandler={this.onManuallyClick}>
                <div>
                    Also great, we it only takes a couple of minutes and will help other people tremendously finding your project.
                </div>
            </ECHPaper>
        </Box>
    }

    onManuallyClick = () => {
        this.props.updateAddProjectPageContent({
            pageTitle: "Add a new project",
            contentType: "manually"
        })
        this.props.incrementSteps();
    }

    onGitClick = () => {
        this.props.updateAddProjectPageContent({
            pageTitle: "Add via Git repository",
            contentType: "git"
        })
        this.props.incrementSteps();
    }

    onCodeJsonClick = () => {
        this.props.updateAddProjectPageContent({
            pageTitle: "Add project via Code.json file",
            contentType: "json",
        })
        this.props.incrementSteps();
    }
}

const mapDispatchToProps = { updateAddProjectPageContent, incrementSteps }

export default connect(null, mapDispatchToProps)(ECHChooseDialogue);
