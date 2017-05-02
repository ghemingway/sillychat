/** Copyright 2017
 * @author      Graham Hemingway <graham.hemingway@gmail.com>
 */
'use strict';

let path            = require('path'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    RedisStore      = require('connect-redis')(session),
    redis           = require('redis'),
    logger          = require('morgan'),
    webpack         = require('webpack'),
    webpackConfig   = require('../../webpack.config'),
    app             = express(),
    http            = require('http').Server(app);

const redisPort = 32768;

// Establish connection to Redis
let redisClient = redis.createClient(redisPort, 'localhost');
redisClient.on('ready', () => {
    console.log('\tRedis Connected.');
}).on('error', () => {
    console.log('Not able to connect to Redis.');
    process.exit(-1);
});

/*****************************************************************************************************/

if (process.env.NODE_ENV !== 'production') {
// HMR Configuration
    webpackConfig = webpackConfig[0];
    let compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler, {
        log: (msg) => {
            console.log(msg);
        },
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }));
}
/*****************************************************************************************************/

// Setup the Express Pipeline
let staticPath = path.join(__dirname, '../../public');
app.use(express.static(staticPath));
app.use(logger('dev'));
// Setup pipeline support for server-side templates
app.engine('pug', require('pug').__express);
app.set('views', __dirname);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
// Setup pipeline session support
let expSession = session({
    store: new RedisStore({
        host: 'localhost',
        port: redisPort
    }),
    name: 'session',
    secret: 'ohhellyes',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
});
app.use(expSession);

// Data Management
app.models = {
    User:       require('./api/v1/user')(redisClient),
    Comment:    require('./api/v1/comment')(redisClient)
};

// Pass off server-side rendering
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});
require('../../build/ssr')(app);


/*****************************************************************************************************/

// Add WebSocket Support
let sharedsession = require("express-socket.io-session");
let io = require('socket.io')(http);
io.use(sharedsession(expSession));

io.on('connection', socket => {
    //console.log(`User connect: ${socket.handshake.session.username}`);
    if (socket.handshake.session.username) {
        const username = socket.handshake.session.username;
        console.log(`Reconnecting: ${username}`);
    }

    // User requests a username to chat as
    socket.on('USERNAME:REQUEST', msg => {
        // Make sure we have latest session data
        socket.handshake.session.reload(() => {
            const currentUsername = socket.handshake.session.username;
            // Is it available
            app.models.User.request(msg.username, currentUsername, err => {
                if (err) socket.emit('USERNAME:ERROR', err);
                else {
                    // Broadcast LEAVE if swapping username
                    io.emit('USER:LEAVE', { username: currentUsername });
                    socket.handshake.session.username = msg.username;
                    socket.handshake.session.save();
                    // Send an ACCEPT (to just socket) and a JOIN (to everyone)
                    socket.emit('USERNAME:ACCEPT');
                    io.emit('USER:JOIN', { username: msg.username });
                }
            });
        });
    });

    // User requests full list of current users
    socket.on('USERS:REQUEST', () => {
        app.models.User.list((err, users) => {
            socket.emit('USERS:RECEIVE', users);
        });
    });

    // User requests full list of comments
    socket.on('COMMENTS:REQUEST', () => {
        app.models.Comment.list((err, comments) => {
            socket.emit('COMMENTS:RECEIVE', comments);
        });
    });

    // User sends message
    socket.on('COMMENT:POST', msg => {
        // Make sure we have latest session data
        socket.handshake.session.reload(() => {
            const username = socket.handshake.session.username;
            // Only allow users that have set username
            if (!username) return;
            // Post the comment
            const text = msg.text ? msg.text : '';
            app.models.Comment.post(username, text, (err, comment) => {
                io.emit('COMMENT:RECEIVE', comment);
            });
        });
    });

    // User disconnects
    socket.on('disconnect', () => {
        const username = socket.handshake.session.username;
        console.log(`Disconnect: ${username}`);
        // Let them go
        app.models.User.leave(username, (err, gone) => {
            if (gone) io.emit('USER:LEAVE', { username: username });
        });
    });
});

/*****************************************************************************************************/

http.listen(8080, () => {
    console.log('Example app listening on 8080');
});
