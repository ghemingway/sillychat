/**
 * Created by ghemingway on 4/17/17.
 */
'use strict';

const commentsList = 'comments';

module.exports = (redisClient) => ({

    post: (username, text, cb) => {
        let comment = {
            time: Date.now(),
            username: username,
            text: text.replace(/<(?:.|\n)*?>/gm, '')
        };
        // Must convert comment object to string
        redisClient.rpush(commentsList, JSON.stringify(comment));
        cb(undefined, comment);
    },

    list: cb => {
        redisClient.lrange(commentsList, 0, -1, (err, comments) => {
            // Must convert all comments back to JSON objects
            cb(undefined, { comments: comments.map(comment => JSON.parse(comment)) });
        });
    }
});
