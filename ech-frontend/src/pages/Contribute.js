import React, { Component, } from 'react';
import { Box } from '@material-ui/core';
import PageWrapper from '../components/PageWrapper'
import ECHPaper from '../components/ECHPaper'


class Contribute extends Component {
    render() {
        return (
            <PageWrapper headlineTitle="Contribute to this project" showBackButton={true}>
                <Box style={{ flexDirection: "row", display: 'flex' }}>
                    <ECHPaper title="Great you are here!" buttonTitle="Github project" href="https://github.com/patreu22/european-code-hub">
                        <div>
                            We are really excited that you want to join us. The best way would be to connect with us on Github. You can either create your own
                            Pull Request and suggest some new features or simply checkout our open issues and problems. We could really need a helping hand.
                        </div>
                    </ECHPaper>
                    <ECHPaper title="More about this project?" buttonTitle="TU IKM Website" buttonLink="https://www.ikm.tu-berlin.de/menue/fachgebiet_iuk_management/parameter/en/">
                        <div>
                            This is the Master thesis project of a student of TU Berlin in the subject of Information Systems Management.Big thanks go to Jakob Korbel who supported this project as a supervisor.
                            The professor in charge is Prof. Dr. Rüdiger Zarnekow.
                        </div>
                    </ECHPaper>
                </Box>
            </PageWrapper>
        );
    }
}

export default Contribute;