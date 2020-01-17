import React, { Component, } from 'react';
import { Divider, FormHelperText } from '@material-ui/core'
import ECHPaper from '../ECHPaper'
import ECHButton from '../ECHButton'
import ECHBackButton from './ECHBackButton'
import ECHManuallyDialogue from './ECHManuallyDialogue'

import { formParagraphStyle, dropzoneWrapperStyle } from './dialogueStyles'
import ImageUploader from 'react-images-upload';
import { objectExists } from '../../helper/objectHelper'

import { connect } from 'react-redux'

class ECHJsonDialogue extends Component {

    render() {
        switch (this.props.currentStep) {
            case 1:
                console.log("Step 1")
                return this._renderFirstStep();
            case 2:
                console.log("Step 2")
                return this._renderSecondStep();
            default:
                console.log("First step")
                return this._renderFirstStep();
        }
    }

    _renderFirstStep = () => <div>
        <ECHPaper type="addProjectViaJson" title="Upload file">{this._renderContentField()}</ECHPaper>
        <ECHBackButton />
    </div>

    _renderSecondStep = () => <ECHManuallyDialogue />


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
                        disable={this.props.jsonUploaded}
                        buttonStyles={{ display: this.props.isJsonUploaded ? 'none' : 'block' }}
                    />
                </div>
                {this._renderJsonSubmitHelperText()}
                {this._renderSubmitButton()}
            </form>
        </div>
    }

    _renderJsonSubmitHelperText() {
        const errorExists = objectExists(this.props.error)
        const errorMessage = errorExists
            ? this.props.error.message
            : ""
        console.log("Error Exists: " + errorExists)
        return errorExists
            ? <FormHelperText error={this.state.formError}>{this.state.formErrorText}</FormHelperText>
            : null
    }


    //TODO: OnClick Handler --> _performJsonHandling
    _renderSubmitButton = () => <div style={{ width: '100%' }}>
        <ECHButton width="80%" onClick={this._performJsonHandling}>Next step</ECHButton>
    </div>
}

const mapStateToProps = state => {
    return {
        projectData: state.createProject.projectData,
        currentStep: state.createProject.addProjectCurrentStep,
        isJsonUploaded: state.createProject.isJsonUploaded,
        error: state.error
        // pageTitle: state.createProject.addProjectPageContent.pageTitle,
        // contentType: state.createProject.addProjectPageContent.contentType,
    }
}

const mapDispatchToProps = null //{ resetAddProjectPage }

export default connect(mapStateToProps, mapDispatchToProps)(ECHJsonDialogue);
