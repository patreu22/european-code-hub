import '../css/Home.css';
import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import PageWrapper from '../components/PageWrapper';
import SearchHero from '../components/SearchHero';
import ECHPaper from '../components/ECHPaper';
import EuropeanStars from '../assets/europe_stars.svg';

// TODO: Redux Boilerplate: To be removed
// import { Button } from '@material-ui/core';
// import { connect } from 'react-redux'
// import { increment } from '../reducers/ProjectSlice'

//TODO: Sources https://de.wikipedia.org/wiki/Datei:European_stars.svg

class Home extends Component {

    render() {
        const headlineStyling = {
            margin: 0,
            padding: 10,
            paddingTop: '2vh',
            color: 'white'
        }

        const heroStyling = {
            backgroundColor: '#004494',
            width: '100vw',
            textAlign: 'center',
            paddingTop: '1vh'
        }

        return (
            < PageWrapper >
                <Box style={heroStyling}>
                    <h1 style={headlineStyling}>The place for European Code</h1>
                    {this.starsLogo()}
                </Box>
                {/* <Button onClick={() => this.props.increment()}>Increase</Button>
                <h1>Counter: {this.props.counter}</h1> */}
                <SearchHero type="home" />
                <Box flexDirection="row" flex="1" display="flex">
                    <ECHPaper title="Explore!" buttonTitle="Browse the catalogue" buttonLink="/catalogue">
                        See all the different projects listed on this page. They are all programmed, funded and/or maintained by the administrations of the European Countries.
                    </ECHPaper>
                    <ECHPaper title="Contribute?" buttonTitle="Contribution page" buttonLink="/contribute">
                        Find out how to contribute to this great website. You can make this page more popular by sharing, developing or listing your own projects here.
                    </ECHPaper>
                </Box>
            </PageWrapper>
        );
    }

    starsLogo() {
        return <img width={'100px'} height={'100px'} src={EuropeanStars} alt="logo" style={{ paddingTop: '10px', paddingBottom: '20px' }} />
    }
}

// Redux boilerplate for testing etc...
// const mapStateToProps = state => {
//     return {
//         counter: state,
//     }
// }

// const mapDispatchToProps = { increment }

// export default connect(mapStateToProps, mapDispatchToProps)(Home);

export default Home;