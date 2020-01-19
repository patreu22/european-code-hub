import React, { Component, } from 'react';
import { connect } from 'react-redux'
import { Divider, FormHelperText } from '@material-ui/core'
import ECHPaper from '../ECHPaper'
import ECHButton from '../ECHButton'
import ECHBackButton from './ECHBackButton'
import ECHManuallyDialogue from './ECHManuallyDialogue'
import { parseToJsonObject } from '../../helper/fileHelper'
import { objectExists } from '../../helper/objectHelper'

import { processJson } from '../../actions/jsonActions'

import { formParagraphStyle, dropzoneWrapperStyle } from './dialogueStyles'
import ImageUploader from 'react-images-upload';

class ECHJsonDialogue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jsonData: {},
            isJsonUploaded: false,
            error: {
                code: null,
                message: null
            },
        }

        this.onJsonDrop = this.onJsonDrop.bind(this);
        this.performJsonHandling = this.performJsonHandling.bind(this);
    }

    render() {
        switch (this.props.currentStep) {
            case 1:
                console.log("Step 1")
                return this._renderFirstStep();
            case 2:
                console.log("Step 2")
                return <ECHManuallyDialogue />
            default:
                console.log("Default step")
                return this._renderFirstStep();
        }
    }

    _renderFirstStep = () => <div>
        <ECHPaper title="Upload file">{this._renderContentField()}</ECHPaper>
        <ECHBackButton />
    </div>

    ///TODO: Create file preview for JSON files*/
    _renderContentField = () => {
        return <div>
            {this.props.title ? <Divider /> : null}
            <form style={formParagraphStyle}>
                <div style={dropzoneWrapperStyle}>
                    <ImageUploader
                        withIcon={true}
                        buttonText='Upload Code.json'
                        withPreview={true}
                        label=""
                        imgExtension={[".json"]}
                        onChange={this.onJsonDrop}
                        accept="accept=json"
                        singleImage={true}
                        maxFileSize={5242880}
                        disable={this.state.isJsonUploaded}
                        buttonStyles={{ display: this.state.isJsonUploaded ? 'none' : 'block' }}
                    />
                </div>
                {this._renderJsonSubmitHelperText()}
                {this._renderSubmitButton()}
            </form>
        </div>
    }

    onJsonDrop(files) {
        const fileProvided = files.length > 0
        if (fileProvided) {
            this.setState({
                json: files[0],
                isJsonUploaded: true,
                error: {}
            })
        } else {
            this.setState({
                json: {},
                isJsonUploaded: false
            })
        }
    }

    performJsonHandling() {
        console.log("Handle Json")
        const file = this.state.json;
        if (file) {
            parseToJsonObject(file)
                .then(json => {
                    this.setState({
                        isJsonUploaded: true
                    })
                    this.props.processJson(json)
                })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        error: {
                            code: 500,
                            message: 'Json couldn\'t be parsed. Check the format.'
                        }
                    })
                })
        } else {
            this.setState({
                error: {
                    code: 500,
                    message: 'No file uploaded yet.'
                }
            })
        }
    }

    _renderJsonSubmitHelperText() {
        const errorExists = objectExists(this.state.error)
        const errorMessage = errorExists
            ? this.state.error.message
            : ""
        return errorExists
            ? <FormHelperText error={errorExists}>{errorMessage}</FormHelperText>
            : null
    }

    _renderSubmitButton = () => <div style={{ width: '100%' }}>
        <ECHButton width="80%" onClick={this.performJsonHandling}>Next step</ECHButton>
    </div>
}

const mapStateToProps = state => {
    return {
        currentStep: state.createProject.addProjectCurrentStep
    }
}

const mapDispatchToProps = { processJson }

export default connect(mapStateToProps, mapDispatchToProps)(ECHJsonDialogue);
