/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import { fromJS, List, Map }      from 'immutable';

const initialState = fromJS({
    comments: [],
    status: "idle"
});

export const commentsRequest = () => {
    return {
        type: 'COMMENTS:REQUEST'
    }
};

export const commentPost = (text) => {
    return {
        type: 'COMMENT:POST',
        text: text
    }
};

export const commentsReducer = (state = initialState, action) => {
    // Convert to Map
    state = Map.isMap(state) ? state : Map({
        status: state.status,
        comments: List(state.comments)
    });

    // Handle actions
    switch (action.type) {
        case 'COMMENTS:REQUEST':
            return state.set('status', 'request');
        case 'COMMENTS:RECEIVE':
            return state.withMutations(obj => {
                obj
                    .set('comments', List(action.comments))
                    .set('status', 'idle');
            });
        case 'COMMENTS:ERROR':
            return state.withMutations(obj => {
                obj.set('comments', action.error).set('status', 'error');
            });
        case 'COMMENT:RECEIVE':
            return state.update('comments', comments => comments.push({
                time: action.time,
                username: action.username,
                text: action.text
            }));
        default:
            return state;
    }
};
