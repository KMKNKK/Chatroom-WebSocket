import React, { Component } from 'react';
import Header from './component/header/header';
import Footer from './component/footer/footer';
import Main from './component/main/main';

class App extends Component {
    render() {
        return (
            <div>
                <Header/>
                <Main/>
                <Footer/>
            </div>
        );
    }
}

export default App;
