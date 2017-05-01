/**
 * Created by ghemingway on 4/22/17.
 */
let React                           = require('react'),
    { renderToString }              = require('react-dom/server'),
    { createStore, combineReducers }= require('redux'),
    { Provider }                    = require('react-redux'),

    { commentsReducer }             = require('../client/reducers/comments'),
    { usernameReducer }             = require('../client/reducers/username'),
    { usersReducer }                = require('../client/reducers/users'),
    App                             = require('../client/components/app').default;

module.exports = app => {

    app.get('*', (req, res) => {
        const username = req.session.username;
        console.log(`Fetching for user: ${username}`);
        const initialState = {
            username: {
                color: 'red'
            }
        };
        // Get current comments
        app.models.Comment.list((err, comments) => {
            // Add into initial state
            initialState.comments = {
                comments: comments.comments,
                status: 'idle'
            };
            // Get current users and add into initial state
            app.models.User.list((err, users) => {
                initialState.users = {
                    users: users.users,
                    status: 'idle'
                };

                // Create a new Redux store instance
                const store = createStore(combineReducers({
                    username: usernameReducer,
                    users: usersReducer,
                    comments: commentsReducer
                }), initialState);

                // Render the component to a string
                const html = renderToString(
                    <Provider store={store}>
                        <App />
                    </Provider>
                );

                // Grab the initial state from our Redux store
                const preloadedState = store.getState();
                const state = JSON.stringify(preloadedState).replace(/</g, '\\u003c');

                // Send the rendered page back to the client
                res.render('base.pug', { content: html, state: state });
            });
        });
    });
};
