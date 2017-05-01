/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import React, { Component }         from 'react';
import { connect }                  from 'react-redux';

const Comment = ({comment}) => {
    const time = new Date(comment.time);
    return <li>
        <span className="username">{comment.username}: </span>
        <span className="comment">{comment.text}</span>
        <span className="timestamp">{time.toLocaleTimeString()}</span>
    </li>;
};

export class Comments extends Component {
    constructor(props) {
        super(props);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        this.element.scrollIntoView({ behavior: "smooth" });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        // This may be wrong
        const comments = !this.props.status !== 'error' ? this.props.comments : [{ username: 'Server', text: this.props.comments.error }];
        const components = comments.map((comment, index) => {
            return <Comment key={index} comment={comment}/>
        });
        return <div className="comments">
            <ul>
                {components}
            </ul>
            <div ref={el => { this.element = el; }}/>
        </div>;
    }
}

export default connect(state => ({
    comments:   state.comments.get('comments').toJS(),
    status:     state.comments.get('status')
}))(Comments);
