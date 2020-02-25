import React, { Component, } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Divider, FormHelperText } from '@material-ui/core'
import PageWrapper from '../../components/PageWrapper'
import ECHPaper from '../../components/ECHPaper'
import ECHButton from '../../components/ECHButton'
import { parseToJsonObject } from '../../helper/fileHelper'
import { objectExists } from '../../helper/objectHelper'
import { ADD_MANUALLY, LOGIN } from '../../routes'

import { processJson } from '../../actions/jsonActions'

import ImageUploader from 'react-images-upload-json-extension';

class AddViaJson extends Component {

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
        if (this.props.cookie) {
            var content;
            switch (this.props.currentStep) {
                case 0:
                    content = this._renderFirstStep();
                    break
                case 1:
                    return <Redirect to={ADD_MANUALLY} />
                default:
                    content = this._renderFirstStep();
            }
            return <PageWrapper headlineTitle={"Add project via Code.json file"} showBackButton={true}>{content}</PageWrapper>
        } else {
            return <Redirect to={LOGIN} />
        }
    }

    _renderFirstStep = () => <div>
        <ECHPaper title="Upload file">{this._renderContentField()}</ECHPaper>
    </div>

    _renderContentField = () => {
        const formParagraphStyle = {
            textAlign: 'center',
            padding: '2vH 1vw 2vH 1vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }

        const dropzoneWrapperStyle = {
            maxWidth: '80%',
            paddingBottom: '1vw',
        }


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
        currentStep: state.createProject.addProjectCurrentStep,
        cookie: state.user.cookie
    }
}

const mapDispatchToProps = { processJson }

export default connect(mapStateToProps, mapDispatchToProps)(AddViaJson);
