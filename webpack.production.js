const fs                = require('fs'),
    nodeExternals       = require('webpack-node-externals'),
    ExtractTextPlugin   = require('extract-text-webpack-plugin'),
    webpack             = require('webpack');


module.exports = [
    // Client-side configuration
    {
        cache: true,
        devtool: 'eval-source-map',
        context: `${__dirname}/src/client`,
        entry: {
            main: './main',
            vendor: ['react', 'react-dom', 'react-hot-loader', 'redux', 'react-redux', 'immutable', 'socket.io-client']
        },
        output: {
            path: `${__dirname}/public/js/`,
            filename: '[name].js',
            chunkFilename: '[id].js',
            sourceMapFilename: '[name].map',
            publicPath: '/'
        },
        module: {
            rules: [
                // required for babel to kick in
                { test: /\.js$/, exclude: /node_modules/, use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: ['es2015', 'react', 'babili'],
                            plugins: ['transform-react-jsx']
                        }
                    }
                ]},

                { test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: 'css-loader'
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('styles.css'),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true
                },
                comments: false
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor'
            })
        ]
    },
    // Server-side configuration
    {
        entry: './ssr',
        target: 'node',
        context: `${__dirname}/src/server`,
        output: {
            libraryTarget: 'commonjs2',
            path: `${__dirname}/build`,
            filename: 'ssr.js'
        },
        module: {
            rules: [
                // required for babel to kick in
                { test: /\.js$/, exclude: /node_modules/, use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: ['es2015', 'react'],
                            plugins: ['transform-react-jsx']
                        }
                    }
                ]},

                { test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: 'css-loader'
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('styles.css'),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })
        ],
        externals: [nodeExternals()]
    }
];