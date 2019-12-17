import React from 'react';
import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
    render() {
        const contentStyle = {
            minHeight: '90vH',
            paddingTop: '5vH',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };

        return (
            <span>
                <Header />
                <div style={contentStyle}>
                    {this.props.children}
                </div>
                <Footer />
            </span >
        );
    }
}

export default App;

// European color Blue: #004494
// Yellow: #ffd617