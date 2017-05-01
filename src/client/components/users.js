/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import React, { Component }         from 'react';
import { connect }                  from 'react-redux';

const User = ({username}) => <li>{username}</li>;

export class Users extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const users = this.props.users.map((username, index) => {
            return <User key={index} username={username}/>
        });
        return <div className="users">
            <h4>Users:</h4>
            <ul>
                {users}
            </ul>
        </div>;
    }
}

export default connect(state => ({
    users:  state.users.get('users'),
    status: state.users.get('status')
}))(Users);