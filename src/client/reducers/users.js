/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import { fromJS, List, Map }      from 'immutable';

const initialState = fromJS({
    users: [],
    status: "idle"
});

export const usersRequest = () => {
    return {
        type: 'USERS:REQUEST'
    }
};

export const usersReducer = (state = initialState, action) => {
    // Convert to Map
    state = Map.isMap(state) ? state : Map({
        status: state.status,
        users: List(state.users)
    });

    // Handle actions
    switch (action.type) {
        case 'USER:JOIN':
            return state.update('users', users => users.push(action.username));
        case 'USER:LEAVE':
            return state.update('users', users => users.filter(user => (user !== action.username)));
        case 'USERS:REQUEST':
            return state.set('status', 'request');
        case 'USERS:RECEIVE':
            return state.set('users', List(action.users));
        case 'USERS:ERROR':
            return state.withMutations(obj => {
                obj
                    .set('users', action.error)
                    .set('status', 'error');
            });
        default:
            return state;
    }
};
