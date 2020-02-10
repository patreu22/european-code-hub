import React, { Component, } from 'react';
import { connect } from 'react-redux'
import { Divider } from '@material-ui/core'
import PageWrapper from '../../components/PageWrapper'
import ECHPaper from '../../components/ECHPaper'
import ECHButton from '../../components/ECHButton'
import ECHTextfield from '../../components/ECHTextfield'
import ECHMultipleSelect from '../../components/ECHMultipleSelect'
import { objectExists } from '../../helper/objectHelper'
import { isValidText, isValidUrl } from '../../helper/validationHelper'
import { formParagraphStyle } from '../../components/addProjectDialogues/dialogueStyles'

import { updateProjectDataAttribute } from '../../slices/createProjectSlice'
import { sendNewProjectToBackend } from '../../actions/httpActions'

class AddManually extends Component {

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
            licenseErrorMessage: '',
        }

        this.statusChanged = this.statusChanged.bind(this)
        this.performManuallyHandling = this.performManuallyHandling.bind(this)
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.error) {
    //         if (this.props.error.code === 409 && !this.state.projectNameErrorMessage) {
    //             this.setState({
    //                 projectNameErrorMessage: "A project with this name already exists"
    //             })
    //             window.scrollTo(0, 0)
    //         }
    //     }
    // }

    render() {
        //TODO: This should not be here, but the componentDidUpdate method is not triggered, so well well..
        if (this.props.error) {
            if (this.props.code === 409 && !this.state.projectNameErrorMessage) {
                this.setState({
                    projectNameErrorMessage: "A project with this name already exists"
                })
                window.scrollTo(0, 0)
            }
        }
        const title = objectExists(this.props.projectData) ? "Check data" : "Enter data"
        return <PageWrapper headlineTitle={"Add project manually"} showBackButton={true}>
            <div>
                <ECHPaper width={"40vw"} title={title}>{this._renderContentField()}</ECHPaper>
            </div>
        </PageWrapper >
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
        const status = this.props.projectData ? this.props.projectData.status ?? [] : []

        return <form style={formParagraphStyle}>
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
            <ECHMultipleSelect
                title="Status"
                width="80%"
                multiple={false}
                options={["Released", "Development", "Deprecated"]}
                value={status}
                onChange={this.statusChanged}
            />
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
                label: "Date of project creation",
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
                label: "License",
                jsonKey: "license",
                value: this.props.projectData.license,
                errorMessageName: "licenseErrorMessage",
                errorMessage: this.state.licenseErrorMessage,
                validationType: "text",
            })}
            {this._renderSubmitButton()}
        </form>
    }

    statusChanged(event) {
        const newValue = event.target.value;
        this.props.updateProjectDataAttribute({ key: "status", value: newValue })
    }

    _renderField({ label, jsonKey, value, errorMessageName, errorMessage, validationType }) {
        const showError = errorMessage ? true : false
        var makeMultiline = jsonKey === "projectDescription";
        return <ECHTextfield
            label={label}
            value={value ?? ""}
            onChange={(event) => this.onTextfieldChanged(jsonKey, event)}
            onBlur={(event) => this.onTextfieldBlurred(errorMessageName, validationType, event)}
            error={showError}
            multiline={makeMultiline}
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
        if (objectExists(this.props.projectData)) {
            this.props.sendNewProjectToBackend(this.props.projectData)
        } else {
            //TODO: Handle review process
            console.log("Handle review process of manual submission")
        }
    }

    _renderSubmitButton = () => {
        const buttonTitle = objectExists(this.props.projectData) ? "Submit" : "Next step"
        return <div style={{ width: '100%' }}>
            <ECHButton width="80%" onClick={this.performManuallyHandling}>{buttonTitle}</ECHButton>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        projectData: state.createProject.projectData,
        error: state.createProject.error
    }
}

const mapDispatchToProps = { updateProjectDataAttribute, sendNewProjectToBackend }

export default connect(mapStateToProps, mapDispatchToProps)(AddManually);
