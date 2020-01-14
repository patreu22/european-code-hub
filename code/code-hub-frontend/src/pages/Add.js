import React, { Component } from 'react';
import '../css/Home.css';
import PageWrapper from '../components/PageWrapper';
import ECHPaper from '../components/ECHPaper'
import { Box } from '@material-ui/core';
import ECHButton from '../components/ECHButton'

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Add extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //Choose for boxes, git to enter Git repo, manually to enter manually
            contentType: "choose",
            pageTitle: "Add a new project"
        }

        this._onManuallyClick = this._onManuallyClick.bind(this)
        this._onGitClick = this._onGitClick.bind(this)
        this._renderChooseDialogue = this._renderChooseDialogue.bind(this)
        this._renderEnterGitDialogue = this._renderEnterGitDialogue.bind(this)
        this._renderManuallyDialogue = this._renderManuallyDialogue.bind(this)
        this._renderJsonDialogue = this._renderJsonDialogue.bind(this)
    }

    render() {
        console.log(this)
        var contentToRender;
        switch (this.state.contentType) {
            case "git":
                contentToRender = this._renderEnterGitDialogue;
                break
            case "json":
                contentToRender = this._renderJsonDialogue;
                break
            case "manually":
                contentToRender = this._renderManuallyDialogue;
                break
            default:
                contentToRender = this._renderChooseDialogue;
                break
        }

        return (
            <PageWrapper headlineTitle={this.state.pageTitle}>
                {contentToRender()}
            </PageWrapper>
        );
    }

    _renderManuallyDialogue() {
        return <div>
            <ECHPaper type="addProjectManually" title="Enter data"></ECHPaper>
            {this._renderBackButton()}
        </div>
    }

    _renderEnterGitDialogue() {
        return <div>
            <ECHPaper type="addProjectViaGit" title="Enter URL"></ECHPaper>
            {this._renderBackButton()}
        </div>
    }

    _renderJsonDialogue() {
        return <div>
            <ECHPaper type="addProjectViaJson" title="Upload file"></ECHPaper>
            {this._renderBackButton()}
        </div>
    }

    _renderBackButton() {
        return <ECHButton onClick={() => this.setState({
            contentType: "choose",
            pageTitle: "Add a new project"
        })}>Back</ECHButton>
    }

    _onManuallyClick = () => this.setState({
        contentType: "manually",
        pageTitle: "Add manually"
    })

    _onGitClick = () => this.setState({
        contentType: "git",
        pageTitle: "Add via Git repository"
    })

    _onCodeJsonClick = () => this.setState({
        contentType: "json",
        pageTitle: "Add project via Code.json file"
    })

    _renderChooseDialogue() {
        console.log(this)
        return <Box flexDirection="row" flex="1" display="flex">
            <ECHPaper title="Do you use a Git repository?" buttonTitle="Add project via git link" onButtonClickHandler={this._onGitClick}>
                Amazing, we can do all the work for you!
                We just need the link and a couple of information and we are good to go.
            </ECHPaper>
            <ECHPaper title="Submit a Code.json file?" buttonTitle="Add by file upload" onButtonClickHandler={this._onCodeJsonClick}>
                If your organization uses a Code.json file to store project metadata you can use it here to create a new entry automatically.
            </ECHPaper>
            <ECHPaper title="Add it manually?" buttonTitle="Add project manually" onButtonClickHandler={this._onManuallyClick}>
                Also great, we it only takes a couple of minutes and will help other people tremendously finding your project.
            </ECHPaper>
        </Box>
    }
}

export default Add;