/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import { createStore, combineReducers, applyMiddleware }    from 'redux';

import { usernameReducer }  from './reducers/username';
import { usersReducer }     from './reducers/users';
import { commentsReducer }  from './reducers/comments';
import { wsMiddleware }     from './middleware/websockets';


export const configureStore = initialState => {
    const store = createStore(
        combineReducers({
            username: usernameReducer,
            users: usersReducer,
            comments: commentsReducer
        }),
        initialState,
        applyMiddleware(wsMiddleware)
    );

    // Hot Module Replacement API for reducers
    if (module.hot && process.env.NODE_ENV !== "production") {
        module.hot.accept(['./store', './reducers/username', './reducers/users', './reducers/comments'], () => {
            const reducer = combineReducers({
                username:   require('./reducers/username').usernameReducer,
                users:      require('./reducers/users').usersReducer,
                comments:   require('./reducers/comments').commentsReducer
            });
            store.replaceReducer(reducer);
            // TODO: Enable HMR for middleware
        });
    }
    return store;
};
