import React, { Component } from 'react';
import { Layout } from 'antd';

import './room-header.css'

const { Header } = Layout;

class ChatHeader extends Component {
  render() {
    return (
      <Header>
          IMChat-React
      </Header>
    );
  }
}

export default ChatHeader;
