import React from 'react';
import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
    render() {
        return (
            <span>
                <Header />
                <div style={{ minHeight: '85vH', marginTop: '8vH' }}>
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