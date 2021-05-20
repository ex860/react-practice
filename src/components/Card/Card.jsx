import React from 'react';
import './Card.scss';
// import { ReactComponent as FacebookSvg } from '../../images/facebook.svg';
// import { ReactComponent as YouTubeSvg } from '../../images/youtube.svg';
// import { ReactComponent as TwitterSvg } from '../../images/twitter.svg';
// import { ReactComponent as InstagramSvg } from '../../images/instagram.svg';
export default class Card extends React.Component {
    // constructor(props) {
    //     super(props)
    // }
    render() {
        return (
            <div className="container">
                <div className="header-1">
                    <span>CARD</span>
                </div>
                <div className="header-2">
                    {/* <FacebookSvg height="16px" />
                    <YouTubeSvg height="16px" />
                    <TwitterSvg height="16px" />
                    <InstagramSvg height="16px" /> */}
                    <span className="social-media">
                        <span>ALL</span>
                        <span>FB</span>
                        <span>YT</span>
                        <span>TW</span>
                        <span>IG</span>
                    </span>
                    <span className="hide">HIDE</span>
                </div>
                <div className="footer">
                    <span>FOOTER</span>
                </div>
            </div>
        );
    }
}
