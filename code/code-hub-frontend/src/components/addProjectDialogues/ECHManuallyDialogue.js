import React, { Component, } from 'react';
import { connect } from 'react-redux'
import { Divider } from '@material-ui/core'
import ECHPaper from '../ECHPaper'
import ECHBackButton from './ECHBackButton'
import ECHButton from '../ECHButton'
import ECHTextfield from '../ECHTextfield'
import ECHMultipleSelect from '../ECHMultipleSelect'
import { objectExists } from '../../helper/objectHelper'
import { isValidText, isValidUrl } from '../../helper/validationHelper'
import { formParagraphStyle } from './dialogueStyles'

import { updateProjectDataAttribute } from '../../slices/createProjectSlice'

class ECHManuallyDialogue extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projectNameErrorMessage: '',
            projectDescriptionErrorMessage: '',
            organizationErrorMessage: '',
            repoUrlErrorMessage: '',
            versionErrorMessage: '',
            statusErrorMessage: '',
            contactNameErrorMessage: '',
            contactEmailErrorMessage: '',
            dateCreatedErrorMessage: '',
            dateLastModifiedErrorMessage: '',
            programmingLanguagesErrorMessage: '',
            licensesErrorMessage: '',
            selectedList: []
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
        const contactName = this.props.projectData.contact ? this.props.projectData.contact.name : null
        const contactMail = this.props.projectData.contact ? this.props.projectData.contact.email : null

        return <form style={formParagraphStyle}>
            <ECHMultipleSelect title="Demo Input" />
            {this._renderField({
                label: "Project name",
                jsonKey: "projectName",
                value: this.props.projectData.projectName,
                errorMessageName: "projectNameErrorMessage",
                errorMessage: this.state.projectNameErrorMessage,
                validationType: "text",
            })}
            {/*TODO: Transform into Textbox instead Textfield*/}
            {this._renderField({
                label: "Project description",
                jsonKey: "projectDescription",
                value: this.props.projectData.projectDescription,
                errorMessageName: "projectDescriptionErrorMessage",
                errorMessage: this.state.projectDescriptionErrorMessage,
                validationType: "text",
            })}
            {this._renderField({
                label: "Organization",
                jsonKey: "organization",
                value: this.props.projectData.organization,
                errorMessageName: "organizationErrorMessage",
                errorMessage: this.state.organizationErrorMessage,
                validationType: "text",
            })}
            {this._renderField({
                label: "Repository URL",
                jsonKey: "repoUrl",
                value: this.props.projectData.repoUrl,
                errorMessageName: "repoUrlErrorMessage",
                errorMessage: this.state.repoUrlErrorMessage,
                validationType: "url",
            })}
            {this._renderField({
                label: "Version",
                jsonKey: "version",
                value: this.props.projectData.version,
                errorMessageName: "versionErrorMessage",
                errorMessage: this.state.versionErrorMessage,
                validationType: "text",
            })}
            {/*TODO: Dropdown*/}
            {this._renderField({
                label: "Status",
                jsonKey: "status",
                value: this.props.projectData.status,
                errorMessageName: "statusErrorMessage",
                errorMessage: this.state.statusErrorMessage,
                validationType: "text",
            })}
            {this._renderField({
                label: "Contact name",
                jsonKey: "contact.name",
                value: contactName,
                errorMessageName: "contactNameErrorMessage",
                errorMessage: this.state.contactNameErrorMessage,
                validationType: "text",
            })}
            {this._renderField({
                label: "Contact email",
                jsonKey: "contact.email",
                value: contactMail,
                errorMessageName: "contactEmailErrorMessage",
                errorMessage: this.state.contactEmailErrorMessage,
                validationType: "text",
            })}
            {/*TODO: Date Picker*/}
            {this._renderField({
                label: "Date created",
                jsonKey: "dateCreated",
                value: this.props.projectData.dateCreated,
                errorMessageName: "dateCreatedErrorMessage",
                errorMessage: this.state.dateCreatedErrorMessage,
                validationType: "text",
            })}
            {/*TODO: Date Picker*/}
            {this._renderField({
                label: "Date of last modification",
                jsonKey: "dateLastModified",
                value: this.props.projectData.dateLastModified,
                errorMessageName: "dateLastModifiedErrorMessage",
                errorMessage: this.state.dateLastModifiedErrorMessage,
                validationType: "text",
            })}
            {/*TODO: Multiselect Dropdown*/}
            {this._renderField({
                label: "Programming languages",
                jsonKey: "programmingLanguages",
                value: this.props.projectData.programmingLanguages,
                errorMessageName: "programmingLanguagesErrorMessage",
                errorMessage: this.state.programmingLanguagesErrorMessage,
                validationType: "text",
            })}
            {/*TODO: Multiselect Dropdown*/}
            {this._renderField({
                label: "Licenses",
                jsonKey: "licenses",
                value: this.props.projectData.licenses,
                errorMessageName: "licensesErrorMessage",
                errorMessage: this.state.licensesErrorMessage,
                validationType: "text",
            })}
            {this._renderSubmitButton()}
        </form>
    }


    _renderField({ label, jsonKey, value, errorMessageName, errorMessage, validationType }) {
        const showError = errorMessage ? true : false
        return <ECHTextfield
            label={label}
            value={value ?? ""}
            onChange={(event) => this.onTextfieldChanged(jsonKey, event)}
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
        } else if (validationType === 'url') {
            const isValid = isValidUrl(event.target.value)
            this.setState({
                [errorMessageName]: isValid ? "" : "Invalid URL."
            })
        }
    }

    onTextfieldChanged(jsonKey, event) {
        this.props.updateProjectDataAttribute({ key: jsonKey, value: event.target.value })
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
