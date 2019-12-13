import React, { Component } from 'react';
import { Box, ListItem, Divider } from '@material-ui/core'
import { Link } from 'react-router-dom';

class ProjectListItem extends Component {

    //Props:
    //Project

    render() {
        const project = this.props.project
        const index = this.props.index
        console.log(index)
        return (
            <ListItem index={index} style={{ backgroundColor: this._getColor(index), color: 'white' }}>
                <Box>
                    <div><Link to={`/projects/${project.projectName}`}>{project.projectName}</Link></div>
                    <Divider style={{ backgroundColor: 'white', marginTop: '5px', marginBottom: '5px' }} />
                    <div>{project.projectDescription}</div>
                </Box>
            </ListItem>
        );
    }

    _getColor(index) {
        return this.isEven(index) ? '#1985FF' : '#004594'
    }

    isEven(n) {
        return n % 2 === 0;
    }
}

export default ProjectListItem;