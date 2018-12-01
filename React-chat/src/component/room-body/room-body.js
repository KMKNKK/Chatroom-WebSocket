import React, { Component } from 'react';
import { Layout } from 'antd';

import SiderBar from './sider-bar';
import Chatpad from './chat-pad';

class RoomBody extends Component {
    render() {
        return (
            <Layout>
                <SiderBar/>
                <Chatpad/>
            </Layout>
        );
    }
}

export default RoomBody;