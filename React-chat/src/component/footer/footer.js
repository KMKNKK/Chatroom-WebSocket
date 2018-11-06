import React, {Component} from 'react';
import './footer.css';

class Footer extends Component {
    render() {
        return (
            <footer>
                <input className="form-control" type="text" id="sendtxt" />
                <button id="emoji" className="btn" title="emoji">Emoji</button>
                <button id="sendImage" className="btn" title="sendImage">Image</button>
                <button id="sendTxt" className="btn" title="sendTxt">Send</button>
                <input id="canNotSee" type="file" />
            </footer>
        );
    }
}

export default Footer;