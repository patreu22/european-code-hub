import React, { Component, } from 'react';

import ECHPaper from '../ECHPaper'
import ECHBackButton from './ECHBackButton'


class ECHJsonDialogue extends Component {

    render() {
        return <div>
            <ECHPaper type="addProjectViaJson" title="Upload file"></ECHPaper>
            <ECHBackButton />
        </div>
    }
}

export default ECHJsonDialogue;
