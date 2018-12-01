import React, { Component } from 'react';

import { Layout } from 'antd';

import './sider-bar.css';

const { Sider } = Layout;

class SiderBar extends Component {
    render() {
        return (
            <Sider className="sider-bar">
                Sider
            </Sider>
        );
    }
}

export default SiderBar;