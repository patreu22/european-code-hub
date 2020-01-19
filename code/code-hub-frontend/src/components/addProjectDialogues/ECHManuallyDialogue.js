import React, { Component, } from 'react';
import { connect } from 'react-redux'
import { Divider } from '@material-ui/core'
import ECHPaper from '../ECHPaper'
import ECHBackButton from './ECHBackButton'
import ECHButton from '../ECHButton'
import ECHTextfield from '../ECHTextfield'
import { objectExists } from '../../helper/objectHelper'
import { isValidText } from '../../helper/validationHelper'
import { formParagraphStyle } from './dialogueStyles'

import { updateProjectDataAttribute } from '../../slices/createProjectSlice'

class ECHManuallyDialogue extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projectNameErrorMessage: ''
        }
    }

    render() {
        const title = objectExists(this.props.projectData) ? "Check data" : "Enter data"
        return <div>
            <ECHPaper title={title}>{this._renderContentField()}</ECHPaper>
            <ECHBackButton />
        </div>
    }

    _renderContentField() {
        return <div>
            {this.props.title ? <Divider /> : null}
            {this._renderAddProjectManuallyForm()}
        </div>
    }

    _renderAddProjectManuallyForm() {
        return <form style={formParagraphStyle}>
            {this._renderField({
                label: "Project name",
                value: this.props.projectData.projectName,
                errorMessageName: "projectNameErrorMessage",
                errorMessage: this.state.projectNameErrorMessage,
                validationType: "text",
            })}
            {this._renderSubmitButton()}
        </form>
    }

    _renderField({ label, value, errorMessageName, errorMessage, validationType }) {
        const showError = errorMessage ? true : false
        return <ECHTextfield
            label={label}
            value={value ?? ""}
            onChange={(event) => this.onTextfieldChanged(event)}
            onBlur={(event) => this.onTextfieldBlurred(errorMessageName, validationType, event)}
            error={showError}
            helperText={errorMessage}
        />
    }

    onTextfieldBlurred(errorMessageName, validationType, event) {
        if (validationType === "text") {
            const isValid = isValidText(event.target.value)
            this.setState({
                [errorMessageName]: isValid ? "" : "Invalid text."
            })
        }
    }

    onTextfieldChanged(event) {
        this.props.updateProjectDataAttribute({ key: "projectName", value: event.target.value })
    }

    performManuallyHandling() {
        console.log("TODO: Handle data")
    }

    _renderSubmitButton = () => {
        //TODO Check if review or new entry
        return <div style={{ width: '100%' }}>
            <ECHButton width="80%" onClick={this.performManuallyHandling}>Next step</ECHButton>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        projectData: state.createProject.projectData,
    }
}

const mapDispatchToProps = { updateProjectDataAttribute }

export default connect(mapStateToProps, mapDispatchToProps)(ECHManuallyDialogue);
