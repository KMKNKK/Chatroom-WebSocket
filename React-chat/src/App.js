import React, { Component } from 'react';
import Header from './component/header/header';
import Footer from './component/footer/footer';

class App extends Component {
    render() {
        return (
            <div>
                <Header/>
                <Footer/>
            </div>
        );
    }
}

export default App;
