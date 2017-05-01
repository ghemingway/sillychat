/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

import React                from 'react';
import { render }           from 'react-dom';
import { Provider }         from 'react-redux';
import { AppContainer }     from 'react-hot-loader';

import { usernameRequest }  from './reducers/username';
import { usersRequest }     from './reducers/users';
import { commentsRequest }  from './reducers/comments';
import { configureStore }   from './store';
import App                  from './components/app';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// Setup the store with reducers, initial state and middleware
const store = configureStore(preloadedState);

// Render the App
const renderMain = () => {
    render(
        <AppContainer>
            <Provider store={store}>
                <App />
            </Provider>
        </AppContainer>,
        document.getElementById('primary')
    );
};
renderMain();

// Prime the store for both comments and users - if not passed from server-side render\
store.dispatch(commentsRequest());
store.dispatch(usersRequest());

// Can we restore the username
const username = localStorage.getItem('username');
if (username) {
    console.log(`Requesting to be: ${username}`);
    store.dispatch(usernameRequest(username));
}

// Hot Module Replacement API
if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept('./components/app', () => {
        renderMain();
    });
    // Put store into the global
    window.store = store;
}