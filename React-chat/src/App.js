import React, { Component } from 'react';
import RoomHeader from './component/room-header';
import RoomFooter from './component/room-footer';
import RoomBody from './component/room-body';
import { Layout } from 'antd';

class App extends Component {
    render() {
        return (
            <Layout style={{ height: '100vh' }}>
                <RoomHeader />
                <RoomBody />
                <RoomFooter />
            </Layout>
        );
    }
}

export default App;
