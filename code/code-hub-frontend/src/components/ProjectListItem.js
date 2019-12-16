import React, { Component } from 'react';
import { Box, ListItem, Divider } from '@material-ui/core'
import { Link } from 'react-router-dom';
import PlaceholderImage from '../assets/placeholder_image.jpeg'


class ProjectListItem extends Component {

    //Props:
    //Project
    render() {
        const project = this.props.project
        const index = this.props.index
        const listStyle = {
            width: '80vw',
            color: 'white',
            backgroundColor: this._getColor(index)
        }

        return (
            <ListItem index={index} style={listStyle}>
                <Box flexDirection="row" display="flex">
                    <img width={'85px'} height={'42px'} src={PlaceholderImage} alt="logo" style={{ padding: '5px' }} />
                    <span style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <div><Link to={`/projects/${project.projectName}`}>{project.projectName}</Link></div>
                        <Divider style={{ backgroundColor: 'white', marginTop: '5px', marginBottom: '5px' }} />
                        <div>{project.projectDescription}</div>
                    </span>
                </Box>
            </ListItem >
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