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
import ECHLoadingIndicator from '../../components/ECHLoadingIndicator'
import { objectExists } from '../../helper/objectHelper'
import { isValidText, isValidUrl, isValidEmail } from '../../helper/validationHelper'
import { Redirect } from 'react-router-dom'
import { PROJECTS, LOGIN } from '../../routes'

import { updateProjectDataAttribute, resetError, resetToDefaultState } from '../../slices/createProjectSlice'
import { sendNewProjectToBackend, getUserByToken } from '../../actions/httpActions'

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
            filledFormWithUserData: false
        }

        this.statusChanged = this.statusChanged.bind(this)
        this.performManuallyHandling = this.performManuallyHandling.bind(this)
    }

    componentWillUnmount() {
        this.props.resetToDefaultState()
    }

    componentDidMount() {
        this.props.getUserByToken(this.props.cookie)
    }

    componentDidUpdate(prevProps) {
        if (!objectExists(prevProps.error) && objectExists(this.props.error) && this.state.showRemoteError) {
            if (this.props.error.code === 409) {
                if (this.props.error.message === "projectNameExists") {
                    this.setState({ projectNameErrorMessage: "A project with this name already exists" })
                } else if (this.props.error.message === "repoUrlExists") {
                    this.setState({ repoUrlErrorMessage: "A project with this repo url already exists" })
                }
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            } else if (this.props.error.code === 503) {
                this.setState({ repoUrlErrorMessage: "Couldn't reach the repo Url. Try again later." })
            }
        }

        if (objectExists(this.props.ownUserData) && !this.state.filledFormWithUserData) {
            this.fillFormWithOwnUserData()
            this.setState({ filledFormWithUserData: true })
        }

    }

    render() {
        if (this.props.cookie) {
            var content = <div />
            if (this.props.isLoading) {
                content = <div>
                    <ECHPaper width={"40vw"} title="Loading...">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <ECHLoadingIndicator />
                        </div>
                    </ECHPaper>
                </div>
            }
            if (this.props.successfullySubmitted) {
                return <Redirect to={`${PROJECTS}/${this.props.projectData.projectName}`} />
            } else {
                content = <div>
                    <ECHPaper width={"40vw"} title="Information dialogue">{this._renderContentField()}</ECHPaper>
                </div>
            }

            return <PageWrapper headlineTitle={"Add project"} showBackButton={true}>
                {content}
            </PageWrapper>
        } else {
            return <Redirect to={LOGIN} />
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
                // validationType: "text",
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
                // validationType: "text",
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
                // validationType: "text",
            })}
            {this._renderField({
                label: "Contact email",
                jsonKey: "contact.email",
                required: true,
                value: contactMail,
                errorMessageName: "contactEmailErrorMessage",
                errorMessage: this.state.contactEmailErrorMessage,
                validationType: "email",
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
                // validationType: "text",
            })}
            {/*TODO: Multiselect Dropdown*/}
            {this._renderField({
                label: "License",
                jsonKey: "license",
                value: this.props.projectData.license,
                errorMessageName: "licenseErrorMessage",
                errorMessage: this.state.licenseErrorMessage,
                // validationType: "text",
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

        var onChangeHandler = () => { }
        if (jsonKey === "programmingLanguages") {
            onChangeHandler = (event) => this.onTextfieldWithArrayChanged(jsonKey, event)
        } else {
            onChangeHandler = (event) => this.onTextfieldChanged(jsonKey, event)
        }

        return <ECHTextfield
            label={label}
            required={required || false}
            value={value || ""}
            onChange={(event) => onChangeHandler(event)}
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
        } else if (validationType === "url") {
            const isValid = isValidUrl(event.target.value)
            this.setState({
                [errorMessageName]: isValid ? "" : "Invalid URL."
            })
        } else if (validationType === "email") {
            const isValid = isValidEmail(event.target.value)
            this.setState({
                [errorMessageName]: isValid ? "" : "Invalid Email."
            })
        }
    }

    onTextfieldWithArrayChanged(jsonKey, event) {
        const input = event.target.value
        const splittedInput = input.split(",")
        this.props.updateProjectDataAttribute({ key: jsonKey, value: splittedInput })
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

    fillFormWithOwnUserData() {
        const data = this.props.ownUserData
        var dataToAdd = {}
        if (data.mail) {
            this.props.updateProjectDataAttribute({ key: "contact.email", value: data.mail })
        }
        if (data.name) {
            this.props.updateProjectDataAttribute({ key: "contact.name", value: data.name })
        }
        if (data.organization) {
            this.props.updateProjectDataAttribute({ key: "organization", value: data.organization })
        }
        console.log(dataToAdd)
    }

    performManuallyHandling() {
        if (objectExists(this.props.projectData)) {
            this.props.resetError()
            this.setState({ showRemoteError: true })
            if (this.allRequiredFieldsAvailable()) {
                this.props.sendNewProjectToBackend(this.props.projectData, this.props.cookie)
            }
            //TODO: Handle manual review double check (Sth like a review window)
        } else {
            this.allRequiredFieldsAvailable()
        }
    }

    allRequiredFieldsAvailable() {
        var newState = {}
        const data = this.props.projectData
        if (!data.projectName) {
            newState["projectNameErrorMessage"] = "Invalid project name"
        }
        if (!data.projectDescription) {
            newState["projectDescriptionErrorMessage"] = "Invalid project description"
        }
        if (!data.organization) {
            this.setState({ organizationErrorMessage: "Invalid organization" })
        }
        if (!isValidUrl(data.repoUrl)) {
            this.setState({ repoUrlErrorMessage: "Invalid URL" })
        }

        if (data.contact) {
            if (!isValidEmail(this.props.projectData.contact.email)) {
                this.setState({ contactEmailErrorMessage: "Invalid contact mail" })
            }
        } else {
            this.setState({ contactEmailErrorMessage: "Invalid contact mail" })
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
        const buttonTitle = objectExists(this.props.projectData) ? "Add project" : "Next step"
        return <div style={{ width: '100%' }}>
            <ECHButton width="80%" onClick={this.performManuallyHandling}>{buttonTitle}</ECHButton>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        projectData: state.createProject.projectData,
        error: state.createProject.error,
        successfullySubmitted: state.createProject.successfullySubmitted,
        isLoading: state.createProject.isLoading,
        cookie: state.user.cookie,
        ownUserData: state.user.ownUserData
    }
}

const mapDispatchToProps = { updateProjectDataAttribute, sendNewProjectToBackend, resetError, resetToDefaultState, getUserByToken }

export default connect(mapStateToProps, mapDispatchToProps)(AddManually);
