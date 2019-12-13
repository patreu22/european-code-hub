import '../css/Home.css';
import React, { Component } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Box, CircularProgress, List, ListItem } from '@material-ui/core';
import { getAllProjects } from '../helper/httpHelper';

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Catalogue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            isLoading: false
        };
        this.getAllProjects = getAllProjects.bind(this)
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })
        const contextThis = this;
        this.getAllProjects()
            .then(function (data) {
                contextThis.setState({
                    projects: data.projects,
                    isLoading: false
                })
            })
            .catch(function (error) {
                console.log(error)
                contextThis.setState({
                    isLoading: false
                })
            });
    }

    renderProjectList() {
        console.log(this.state.projects)
        return <List>
            {this.state.projects.map((project, index) => (
                <ListItem key={index}>{project.projectName} | {project.projectDescription}</ListItem>
            ))}
        </List>
    }


    render() {
        const headlineStyling = {
            margin: 0,
            padding: 10,
            paddingTop: '20px',
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center'
        }
        if (this.state.isLoading) {
            return <PageWrapper><CircularProgress className="center" color="secondary" /></PageWrapper>
        } else {
            return (
                < PageWrapper >
                    <Box style={heroStyling}>
                        <h1 style={headlineStyling}>Full catalogue</h1>
                    </Box>
                    {this.renderProjectList()}
                </PageWrapper >
            );
        }
    }
}

export default Catalogue;