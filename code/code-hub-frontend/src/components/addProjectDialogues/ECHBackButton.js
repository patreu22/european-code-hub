import React, { Component, } from 'react';
import { connect } from 'react-redux'
import { resetAddProjectPage } from '../../slices/ProjectSlice'
import ECHButton from '../ECHButton'

class ECHBackButton extends Component {
    render() {
        return <ECHButton onClick={() => this.props.resetAddProjectPage()}>
            Back
        </ECHButton >

    }
}

const mapDispatchToProps = { resetAddProjectPage }

export default connect(null, mapDispatchToProps)(ECHBackButton);