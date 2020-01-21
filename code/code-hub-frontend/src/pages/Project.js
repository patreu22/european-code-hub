import React, { Component, } from 'react';

import PageWrapper from '../components/PageWrapper';
import { withRouter } from "react-router";
import ECHLoadingIndicator from '../components/ECHLoadingIndicator'
import ECHPaper from '../components/ECHPaper'
import ECHCopyBox from '../components/ECHCopyBox'

import { connect } from 'react-redux'
import { getProjectByName } from '../actions/httpActions'
import { resetCurrentProject } from '../slices/currentProjectSlice'
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
import MarkdownRenderer from 'react-markdown-renderer';
import { Divider, Tooltip } from '@material-ui/core';

class Project extends Component {

    componentDidMount() {
        const projectName = this.props.match.params.projectname;
        this.props.getProjectByName(projectName)
    }

    render() {
        const content = this.props.isLoading
            ? <ECHLoadingIndicator />
            : this._renderContent()

        return <PageWrapper headlineTitle={this.props.match.params.projectname}>
            {content}
        </PageWrapper>
    }

    componentWillUnmount() {
        this.props.resetCurrentProject()
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
            console.log(this.props.currentProject)
            return <div style={flexContainer}>
                {this._renderProjectDetails()}
                <div>
                    {this._renderContactBox()}
                    {this._renderCodeBox()}
                </div>
                {this._renderReadme(this.props.currentProject.readme)}
            </div>
        } else {
            //TODO: No data Placeholder
            return <div></div>
        }
    }

    _renderDescriptionBox() {
        return <ECHPaper title="Project description">
            <div>
                {this.props.currentProject.projectDescription}
            </div>
        </ECHPaper>
    }

    _renderReadme(markdown) {
        return <ECHPaper title="Readme" width="85vw">
            <div>
                <MarkdownRenderer markdown={markdown} />
            </div>
        </ECHPaper>
    }

    _renderProjectDetails() {
        // console.log(this.props.currentProject.programmingLanguages.join(', '))
        const project = this.props.currentProject
        return <ECHPaper title="Project details" maxWidth="30vw">
            <div>
                {this._renderDescriptionText()}
                {this._renderIconAndText({
                    icon: <GroupIcon />,
                    text: project.organization,
                    tooltipText: "Organization"
                })}
                {this._renderIconAndText({
                    icon: <GavelIcon />,
                    text: project.license,
                    tooltipText: "License"
                })}
                {this._renderIconAndText({
                    icon: <DeveloperModeIcon />,
                    text: project.programmingLanguages.join(', '),
                    tooltipText: "Used programming languages"
                })}
                {this._renderIconAndText({
                    icon: <DynamicFeedIcon />,
                    text: project.version,
                    tooltipText: "Version"
                })}
                {this._renderIconAndText({
                    icon: <CreateIcon />,
                    text: project.date.created,
                    tooltipText: "Created on"
                })}
                {this._renderIconAndText({
                    icon: <UpdateIcon />,
                    text: project.date.lastModified,
                    tooltipText: "Last modified on"
                })}
                {this._renderStatusRow(project.status)}
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
        return <div style={{ paddingBottom: '25px' }}>
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
        const textLineStyle = {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            textAlign: 'left',
            paddingBottom: '3px'
        }
        const iconStyle = {
            paddingRight: '5px'
        }

        const textElement = link
            ? <a href={link}>{text}</a>
            : <span>{text}</span>


        if (tooltipText) {
            return <div style={textLineStyle}>
                <span style={iconStyle}>
                    <Tooltip title={tooltipText}>
                        {icon}
                    </Tooltip>
                </span> {textElement}
            </div>
        } else {
            return <div style={textLineStyle}>
                <span style={iconStyle}>
                    {icon}
                </span> {textElement}
            </div>
        }
    }

    _renderCodeBox() {
        const url = this.props.currentProject.repoUrl
        return <ECHPaper title="Code Repository" buttonTitle="Go to repository page" href={url}>
            <ECHCopyBox repoUrl={url} />
        </ECHPaper >
    }

    _renderContactBox() {
        return <ECHPaper title="Contact details">
            <div>
                {this._renderIconAndText({
                    icon: <PersonIcon />,
                    text: this.props.currentProject.contact.name,
                    tooltipText: "Contact name"
                })}
                {this._renderIconAndText({
                    icon: <EmailIcon />,
                    text: this.props.currentProject.contact.email,
                    link: `mailto:${this.props.currentProject.contact.email}`,
                    tooltipText: "Contact mail"
                })}
            </div>
        </ECHPaper >
    }
}


const mapStateToProps = state => {
    return {
        currentProject: state.currentProject.currentProject,
        isLoading: state.currentProject.isLoading
    }
}

const mapDispatchToProps = { getProjectByName, resetCurrentProject }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Project));