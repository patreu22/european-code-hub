import React, { Component, } from 'react';
import moment from 'moment'
import { connect } from 'react-redux'
import { Divider } from '@material-ui/core'
import { DatePicker } from '@material-ui/pickers'
import PageWrapper from '../../components/PageWrapper'
import ECHPaper from '../../components/ECHPaper'
import ECHButton from '../../components/ECHButton'
import ECHTextfield from '../../components/ECHTextfield'
import ECHMultipleSelect from '../../components/ECHMultipleSelect'
import { objectExists } from '../../helper/objectHelper'
import { isValidText, isValidUrl } from '../../helper/validationHelper'
import { Redirect } from 'react-router-dom'
import { PROJECTS } from '../../routes'

import { updateProjectDataAttribute, resetError, resetToDefaultState } from '../../slices/createProjectSlice'
import { sendNewProjectToBackend } from '../../actions/httpActions'

class AddManually extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projectNameErrorMessage: '',
            showRemoteError: true,
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

    componentWillUnmount() {
        // this.props.resetToDefaultState()
    }

    componentDidUpdate() {
        const errorMessage = "A project with this name already exists"
        if (this.props.error && this.state.showRemoteError && this.state.projectNameErrorMessage !== errorMessage) {
            if (this.props.error.code === 409) {
                this.setState({ projectNameErrorMessage: errorMessage })
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }
        }
    }

    render() {
        if (this.props.successfullySubmitted) {
            return <Redirect to={`${PROJECTS}/${this.props.projectData.projectName}`} />
        } else {
            return <PageWrapper headlineTitle={"Add project manually"} showBackButton={true}>
                <div>
                    <ECHPaper width={"40vw"} title="Information dialogue">{this._renderContentField()}</ECHPaper>
                </div>
            </PageWrapper >
        }
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

        const formParagraphStyle = {
            textAlign: 'center',
            padding: '2vH 1vw 2vH 1vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }

        return <form style={formParagraphStyle}>
            {this._renderField({
                label: "Project name",
                jsonKey: "projectName",
                required: true,
                value: this.props.projectData.projectName,
                errorMessageName: "projectNameErrorMessage",
                errorMessage: this.state.projectNameErrorMessage,
                validationType: "text",
            })}
            {this._renderField({
                label: "Project description",
                jsonKey: "projectDescription",
                required: true,
                value: this.props.projectData.projectDescription,
                errorMessageName: "projectDescriptionErrorMessage",
                errorMessage: this.state.projectDescriptionErrorMessage,
                validationType: "text",
            })}
            {this._renderField({
                label: "Organization",
                jsonKey: "organization",
                required: true,
                value: this.props.projectData.organization,
                errorMessageName: "organizationErrorMessage",
                errorMessage: this.state.organizationErrorMessage,
                validationType: "text",
            })}
            {this._renderField({
                label: "Repository URL",
                jsonKey: "repoUrl",
                required: true,
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
            {this._renderDatepicker({
                label: "Date of project creation",
                value: this.props.projectData.dateCreated,
                errorMessageName: "dateCreatedErrorMessage",
                errorMessage: this.state.dateCreatedErrorMessage,
                jsonKey: "dateCreated",
            })}
            {this._renderDatepicker({
                label: "Date of last modification",
                value: this.props.projectData.dateLastModified,
                errorMessageName: "dateLastModifiedErrorMessage",
                errorMessage: this.state.dateLastModifiedErrorMessage,
                jsonKey: "dateLastModified",
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

    _renderDatepicker({ label, value, jsonKey }) {
        const datePickerStyle = {
            width: '80%',
            paddingBottom: '1.5vw'
        }

        const dateObject = value && value !== "Invalid date"
            ? moment(value, "DD-MM-YYYY")
            : null

        return <DatePicker
            style={datePickerStyle}
            label={label}
            clearable
            disableFuture
            value={dateObject}
            format="dd. MMM yyy"
            onChange={(date) => this.onDateChanged(jsonKey, date)}
        />
    }

    _renderField({ label, jsonKey, required, value, errorMessageName, errorMessage, validationType }) {
        const showError = errorMessage ? true : false
        var makeMultiline = jsonKey === "projectDescription";
        return <ECHTextfield
            label={label}
            required={required || false}
            value={value || ""}
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
        if (jsonKey === "projectName") {
            this.setState({
                projectNameErrorMessage: '',
                showRemoteError: false
            })
        }
        this.props.updateProjectDataAttribute({ key: jsonKey, value: event.target.value })
    }

    onDateChanged(jsonKey, date) {
        if (date) {
            const convertedDate = moment(date).format("DD-MM-YYYY")
            this.props.updateProjectDataAttribute({ key: jsonKey, value: convertedDate })
        } else {
            this.props.updateProjectDataAttribute({ key: jsonKey, value: "" })
        }
    }

    performManuallyHandling() {
        if (objectExists(this.props.projectData)) {
            this.props.resetError()
            this.setState({ showRemoteError: true })
            if (this.allRequiredFieldsAvailable()) {
                this.props.sendNewProjectToBackend(this.props.projectData)
            }
            //TODO: Handle manual review double check (Sth like a review window)
        } else {
            this.allRequiredFieldsAvailable()
        }
    }

    scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

    allRequiredFieldsAvailable() {
        var newState = {}
        if (!this.props.projectData.projectName) {
            newState["projectNameErrorMessage"] = "Invalid project name"
        }
        if (!this.props.projectData.projectDescription) {
            newState["projectDescriptionErrorMessage"] = "Invalid project description"
        }
        if (!this.props.projectData.organization) {
            this.setState({ organizationErrorMessage: "Invalid organization" })
        }
        if (!this.props.projectData.repoUrl) {
            this.setState({ repoUrlErrorMessage: "Invalid URL" })
        }

        this.setState(newState)
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        if (Object.entries(newState).length === 0 && newState.constructor === Object) {
            return true
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            return false
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
        error: state.createProject.error,
        successfullySubmitted: state.createProject.successfullySubmitted
    }
}

const mapDispatchToProps = { updateProjectDataAttribute, sendNewProjectToBackend, resetError, resetToDefaultState }

export default connect(mapStateToProps, mapDispatchToProps)(AddManually);
