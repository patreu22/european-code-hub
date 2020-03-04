import React, { Component } from 'react';
import { ListItem, Divider, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom';
import Truncate from 'react-truncate';
import ECHIconAndText from './ECHIconAndText'
import {
    WorkOff as WorkOffIcon,
    Work as WorkIcon,
    Gavel as GavelIcon,
    Group as GroupIcon,
    DeveloperMode as DeveloperModeIcon
} from '@material-ui/icons'

class ProjectListItem extends Component {

    //Props:
    //Project
    render() {
        const project = this.props.project
        const index = this.props.index
        const paperStyle = {
            width: '80vw',
            color: 'black',
            backgroundColor: 'F5F5F5',
            flexDirection: 'row',
            display: 'flex',
            minHeight: '100px',
            padding: '8px'
        }
        const listItemStyle = {
            flex: '1 0 10%',
        }

        return (
            <ListItem index={index} style={listItemStyle}>
                {/* <Box flexDirection="row" display="flex" border={1}> */}
                <Paper style={paperStyle}>
                    <span style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: '100%'
                    }}>
                        <div><Link to={`/projects/${project.projectName}`} style={{ wordWrap: 'break-word' }}>{project.projectName}</Link></div>
                        <Divider style={{ backgroundColor: 'black', marginTop: '5px', marginBottom: '5px' }} />
                        <Truncate lines={5}>{this._getDescription(project.projectDescription)}</Truncate>
                        {this._renderAdditionalInfos()}
                    </span>
                    {/* </Box> */}
                </Paper>
            </ListItem >
        );
    }

    _renderAdditionalInfos() {
        return <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
            {this.props.project.status && this._renderStatusRow(this.props.project.status)}
            {this.props.project.license && this._renderIconAndText({
                icon: <GavelIcon />,
                text: this.props.project.license,
                tooltipText: "License"
            })}
            {this._renderIconAndText({
                icon: <GroupIcon />,
                text: this.props.project.organization,
                tooltipText: "Organization"
            })}
            {this.props.project.programmingLanguages.length > 0 && this._renderIconAndText({
                icon: <DeveloperModeIcon />,
                text: this.props.project.programmingLanguages.join(', '),
                tooltipText: "Used programming languages"
            })}
        </div>
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

    _renderIconAndText({ icon, text, tooltipText, link }) {
        return <span style={{ paddingRight: '15px' }}>
            <ECHIconAndText
                icon={icon}
                text={text}
                tooltipText={tooltipText}
                link={link}
            />
        </span>
    }

    _getDescription(description) {
        if (description) {
            return description
        } else {
            return "- No description available -"
        }
    }
}

export default ProjectListItem;