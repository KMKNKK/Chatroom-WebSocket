import React, { Component } from 'react';
import './main.css';
import Sidebar from './sidebar/sidebar';
import Chatpad from './chatpad/chatpad';

class Main extends Component {
    render() {
        return (
            <section className="main">
                <Sidebar/>
                <Chatpad/>
            </section>
        );
    }
}

export default Main;