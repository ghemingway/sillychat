/**
 * Created by ghemingway on 4/17/17.
 */
'use strict';

const userSet = 'users';

module.exports = redisClient => ({

    request: (username, currentUsername, cb) => {
        if (!username) return cb({ error: 'username required' });
        //if (username === currentUsername) return cb(undefined);

        // Add username to set
        const now = Date.now();
        redisClient.zadd(userSet, now, username, (err, count) => {
            if (err) console.log(err);
            console.log(`Added user ${username}: ${count}`);
            if (!count) cb({ error: 'username in use' });
            else {
                // Are we renaming ourselves?
                if (currentUsername && (currentUsername !== username)) {
                    console.log(`Rename ${currentUsername} to ${username}`);
                    redisClient.zrem(userSet, currentUsername);
                }
                // All good
                if (cb) cb(undefined);
            }
        });
    },

    leave: (username, cb) => {
        // Was there a user to remove?
        if (!username) return cb(undefined, false);
        // Remove the username
        redisClient.zrem(userSet, username, (err, count) => {
            console.log(`Leaving: ${username}: ${count}`);
            cb(undefined, count > 0);
        });
    },

    list: cb => {
        redisClient.zrange(userSet, 0, -1, (err, users) => {
            cb(undefined, { users: users });
        });
    }

});
