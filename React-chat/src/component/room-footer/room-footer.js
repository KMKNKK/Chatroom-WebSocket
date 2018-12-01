import React, { Component } from 'react';
import { Button, Layout, Icon, Input } from 'antd';

import './room-footer.css';

const { Footer } = Layout;
const { TextArea } = Input;

class RoomFooter extends Component {
    render() {
        return (
            <Footer className="footer">
                <TextArea placeholder="Input here" autosize={{ minRows: 2, maxRows: 3 }} className="footer-input"/>
                <Button type="primary" className="footer-button"><Icon type="smile" />Emoji</Button>
                <Button type="primary" className="footer-button"><Icon type="picture" />Image</Button>
                <Button type="primary" className="footer-button"><Icon type="arrow-up" />Send</Button>
            </Footer>
        );
    }
}

export default RoomFooter;