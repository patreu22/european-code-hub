import React, { Component, } from 'react';

import PageWrapper from '../components/PageWrapper';
import { withRouter } from "react-router";
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHPaper from '../components/ECHPaper'
import ECHCopyBox from '../components/ECHCopyBox'
import ECHIconAndText from '../components/ECHIconAndText'
import ECHButton from '../components/ECHButton'
import NotFound from './NotFound'
import { connect } from 'react-redux'
import { getProjectByName } from '../actions/httpActions'
import { resetToDefaultState } from '../slices/currentProjectSlice'
import { objectExists } from '../helper/objectHelper'
import {
    DeveloperMode as DeveloperModeIcon,
    Gavel as GavelIcon,
    EmailOutlined as EmailIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    DynamicFeedOutlined as DynamicFeedIcon,
    Update as UpdateIcon,
    Create as CreateIcon,
    WorkOutline as WorkIcon,
    WorkOff as WorkOffIcon,
} from '@material-ui/icons/';
import MarkdownGithub from 'react-markdown-github';
import { Divider } from '@material-ui/core';
import { USER } from '../routes';

class Project extends Component {

    constructor(props) {
        super(props)
        this.state = {
            editMode: false
        }

        this._onProjectUpdateClick = this._onProjectUpdateClick.bind(this)
        this._onProjectUpdateCancelPressed = this._onProjectUpdateCancelPressed.bind(this)
    }

    componentDidMount() {
        const projectName = this.props.match.params.projectname;
        this.props.getProjectByName(projectName)
    }

    render() {
        const error = this.props.error
        if (error) {
            if (error.code === 404) {
                return <NotFound />
            }
        }
        const content = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this._renderContent()

        return <PageWrapper headlineTitle={this.props.currentProject.projectName} showBackButton={true}>
            {content}
        </PageWrapper>
    }

    componentWillUnmount() {
        this.props.resetToDefaultState()
    }

    _renderContent() {
        const flexContainer = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 0,
            width: '85vw',
            marginTop: '1vh',
            justifyContent: 'center'
        };

        if (objectExists(this.props.currentProject)) {
            return <div style={flexContainer}>
                {this._renderProjectDetails()}
                <div>
                    {this._renderContactBox()}
                    {this._renderCodeBox()}
                </div>
                {this._renderReadme()}
                {/* {this._renderButtonBar()} */}
            </div>
        } else return <div />
    }

    _renderDescriptionBox() {
        return <ECHPaper title="Project description">
            <div>
                {this.props.currentProject.projectDescription}
            </div>
        </ECHPaper>
    }

    _renderReadme() {
        const markdown = this.props.currentProject.readme
        const url = this.props.currentProject.repoUrl
        return markdown && <ECHPaper title="Readme" width="85vw">
            <div>
                <MarkdownGithub
                    escapeHtml={false}
                    source={markdown}
                    sourceUri={this._getReadmeSourceUri(url)}
                />
            </div>
        </ECHPaper>
    }

    _renderButtonBar() {
        //TODO for later...
        const currentUserIsCreator = this.props.currentProject.creatorName === this.props.username
        if (currentUserIsCreator) {
            if (this.state.editMode) {
                return <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ display: 'inline-block', paddingRight: '20px' }}>
                        <ECHButton onClick={this._onSaveProjectChangesPressed}>Save changes</ECHButton>
                    </div>
                    <ECHButton onClick={this._onProjectUpdateCancelPressed}>Cancel</ECHButton>
                </div >
            } else {
                return <ECHButton onClick={this._onProjectUpdateClick}>Update project</ECHButton>
            }
        } else {
            return null
        }
    }

    _onProjectUpdateClick() {
        this.setState({ editMode: true })
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    _onProjectUpdateCancelPressed() {
        this.setState({ editMode: false })
    }

    _onSaveProjectChangesPressed() {
        console.log("TODO: Submit to Backend")
    }

    _getReadmeSourceUri(repoUrl) {
        const splittedUrl = repoUrl.split("github.com/")[1].split("/");
        const repoOwner = splittedUrl[0]
        const repoName = splittedUrl[1]
        const sourceUri = "https://raw.githubusercontent.com/" + repoOwner + "/" + repoName + "/master/README.md"
        return sourceUri
    }

    _renderProjectDetails() {
        const project = this.props.currentProject
        return <ECHPaper title="Project details" maxWidth="30vw">
            <div>
                {this._renderDescriptionText()}
                {this._renderIconAndText({
                    icon: <GroupIcon />,
                    text: project.organization,
                    tooltipText: "Organization"
                })}
                {project.license && this._renderIconAndText({
                    icon: <GavelIcon />,
                    text: project.license,
                    tooltipText: "License"
                })}
                {project.programmingLanguages.length > 0 && this._renderIconAndText({
                    icon: <DeveloperModeIcon />,
                    text: project.programmingLanguages.join(', '),
                    tooltipText: "Used programming languages"
                })}
                {project.version && this._renderIconAndText({
                    icon: <DynamicFeedIcon />,
                    text: project.version,
                    tooltipText: "Version"
                })}
                {objectExists(this.props.date) && this._renderIconAndText({
                    icon: <CreateIcon />,
                    text: project.date.created,
                    tooltipText: "Created on"
                })}
                {objectExists(this.props.date) && this._renderIconAndText({
                    icon: <UpdateIcon />,
                    text: project.date.lastModified,
                    tooltipText: "Last modified on"
                })}
                {project.status && this._renderStatusRow(project.status)}
            </div>
        </ECHPaper >
    }

    _renderStatusRow(status) {
        const icon = status === "Deprecated"
            ? <WorkOffIcon />
            : <WorkIcon />

        return this._renderIconAndText({
            icon: icon,
            text: status,
            tooltipText: "Status"
        })
    }

    _renderDescriptionText() {
        return this.props.currentProject.projectDescription && <div style={{ paddingBottom: '25px' }}>
            <div>
                <div style={{ display: 'inline-block', fontWeight: 'bold' }}>
                    Project description
                <Divider style={{ color: "black" }} />
                </div>
            </div>
            {this.props.currentProject.projectDescription}
        </div>
    }

    _renderIconAndText({ icon, text, tooltipText, link }) {
        return <ECHIconAndText
            icon={icon}
            text={text}
            tooltipText={tooltipText}
            link={link}
        />
    }

    _renderCodeBox() {
        const url = this.props.currentProject.repoUrl
        return url && <ECHPaper title="Code Repository" buttonTitle="Go to repository page" href={url}>
            <ECHCopyBox repoUrl={url} />
        </ECHPaper >
    }

    _renderContactBox() {
        const contactExists = objectExists(this.props.currentProject.contact)
        const createItemObject = this.props.currentProject.creatorName === "scraped-by-robo" || this.props.currentProject.creatorName === "generated"
            ? this.props.currentProject.creatorName && this._renderIconAndText({
                icon: <CreateIcon />,
                text: this.props.currentProject.creatorName,
                tooltipText: "Created by"
            })
            : this.props.currentProject.creatorName && this._renderIconAndText({
                icon: <CreateIcon />,
                text: this.props.currentProject.creatorName,
                link: `${USER}/${this.props.currentProject.creatorName}`,
                tooltipText: "Created by"
            })

        return (contactExists || this.props.currentProject.creatorName) && <ECHPaper title="Contact details">
            <div>
                {contactExists && this._renderIconAndText({
                    icon: <PersonIcon />,
                    text: this.props.currentProject.contact.name,
                    tooltipText: "Contact name"
                })}
                {contactExists && this._renderIconAndText({
                    icon: <EmailIcon />,
                    text: this.props.currentProject.contact.email,
                    link: `mailto:${this.props.currentProject.contact.email}`,
                    tooltipText: "Contact mail"
                })}
                {createItemObject}
            </div>
        </ECHPaper >
    }
}


const mapStateToProps = state => {
    return {
        currentProject: state.currentProject.currentProject,
        isLoading: state.currentProject.isLoading,
        error: state.currentProject.error,
        username: state.user.username
    }
}

const mapDispatchToProps = { getProjectByName, resetToDefaultState }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Project));