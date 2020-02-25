import React, { Component, } from 'react';
import { connect } from 'react-redux'
import PageWrapper from '../../components/PageWrapper'
import ECHPaper from '../../components/ECHPaper'
import { Redirect } from 'react-router-dom'
import { LOGIN } from '../../routes'

class AddViaGithub extends Component {

    render() {
        if (this.props.cookie) {
            return <PageWrapper headlineTitle={"Add project via Github repository"} showBackButton={true}>
                <div>
                    <ECHPaper type="addProjectViaGit" title="Enter URL"></ECHPaper>
                </div>
            </PageWrapper>
        } else {
            return <Redirect to={LOGIN} />
        }
    }
}

const mapStateToProps = state => {
    return {
        cookie: state.user.cookie
    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddViaGithub);
