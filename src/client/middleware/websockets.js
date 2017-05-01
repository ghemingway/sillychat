/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import io                   from 'socket.io-client';

// Inbound Message from Socket server
const messageTypes = [
    'USERNAME:ACCEPT',
    'USERNAME:ERROR',
    'USER:JOIN',
    'USER:LEAVE',
    'USERS:RECEIVE',
    'USERS:ERROR',
    'COMMENT:RECEIVE',
    'COMMENTS:RECEIVE',
    'COMMENTS:ERROR'
].reduce((accum, msg) => {
    accum[ msg ] = msg;
    return accum;
}, {});

export const wsMiddleware = store => {
    console.log('Initializing Socket Handler');
    const socket = io();
    // Dispatch actions from inbound socket reception
    Object.keys(messageTypes)
        .forEach(type => socket.on(type, payload => {
            let obj = Object.assign({ type: type }, payload);
            store.dispatch(obj);
        }));

    // Actual middleware
    return (next) => action => {
        if (action.type === 'COMMENT:POST' && action.text !== '') {
            socket.emit('COMMENT:POST', {text: action.text});
        }

        if (action.type === 'USERNAME:REQUEST') {
            socket.emit('USERNAME:REQUEST', {username: action.username});
        }

        if (action.type === 'USERS:REQUEST') {
            socket.emit('USERS:REQUEST');
        }

        if (action.type === 'COMMENTS:REQUEST') {
            socket.emit('COMMENTS:REQUEST');
        }

        next(action);
    }
};
