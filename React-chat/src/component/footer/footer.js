import React, {Component} from 'react';
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <footer>
                <input className="form-control" type="text" id="sendtxt" />
                <button id="emoji" className="btn" title="emoji" />
                <button id="sendImage" className="btn" title="sendImage" />
                <button id="sendTxt" className="btn" title="sendTxt"></button>
                <input id="canNotSee" type="file" />
            </footer>
        );
    }
}

export default Footer;