const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV,
    output: {
        filename: 'vue-bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                  'cache-loader',
                  {
                      loader: 'babel-loader',
                      options: {
                          presets: ['@babel/preset-env'],
                          plugins: [
                              '@babel/plugin-proposal-export-default-from',
                              '@babel/plugin-proposal-optional-chaining',
                          ]
                      },
                  }
                ],
            },
            {
                test: /\.vue$/,
                use: [
                  'cache-loader',
                  'vue-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  'cache-loader',
                  'file-loader'
                ]
            },
            {
                test: /\.svg$/,
                loader: 'vue-svg-loader',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.vue'],
        alias: {
            '@': path.resolve(__dirname, './src/vue/'),
        },
    },
};
