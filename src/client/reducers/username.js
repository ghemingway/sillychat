/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import { fromJS, Map }           from 'immutable';

const initialState = fromJS({
    username: '',
    color: 'red'
});

export const usernameRequest = (username) => {
    return {
        type: 'USERNAME:REQUEST',
        username: username
    }
};

export const usernameReducer = (state = initialState, action) => {
    // Ensure Immutable
    state = Map.isMap(state) ? state : Map(state);

    // Handle actions
    switch (action.type) {
        case 'USERNAME:REQUEST':
            return state.withMutations(obj => {
                return obj
                    .set('username', action.username)
                    .set('color', 'blue');
            });
        case 'USERNAME:ACCEPT':
            localStorage.setItem('username', state.get('username'));
            return state.set('color', 'green');
        case 'USERNAME:ERROR':
            console.log(action);
            return state.withMutations(obj => {
                return obj
                    .set('username', action.error)
                    .set('color', 'red');
            });
        default:
            return state;
    }
};
