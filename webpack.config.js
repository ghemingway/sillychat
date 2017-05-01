const fs              = require('fs'),
    nodeExternals     = require('webpack-node-externals'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack           = require('webpack');


module.exports = [
    // Client-side configuration
    {
        cache: true,
        devtool: 'eval-source-map',
        context: `${__dirname}/src/client`,
        entry: [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
            './main'
        ],
        devServer: { hot: true },
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
                    { loader: 'babel-loader' }
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
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("dev")
                }
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
            path: `${__dirname}/src/server/build`,
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
                    //use: [ 'style-loader','css-loader']
                    use: ExtractTextPlugin.extract({
                        use: 'css-loader'
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('styles.css'),
        ],
        externals: [nodeExternals()]
    }
];