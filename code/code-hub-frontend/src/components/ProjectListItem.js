import React, { Component } from 'react';
import { ListItem, Divider, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom';
import Truncate from 'react-truncate';

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
                    </span>
                    {/* </Box> */}
                </Paper>
            </ListItem >
        );
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