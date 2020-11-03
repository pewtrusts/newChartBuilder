const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const {sass} = require('svelte-preprocess-sass');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const path = require('path');
const outputFolder = process.env.NODE_ENV === 'production' ? 'docs/' : process.env.NODE_ENV === 'localpreview' ? 'preview/' : 'dist/';
const isDev = mode === 'development';
const repoName = 'newChartBuilder';
const publicPath = ''; // no public path necessary bc build is to docs/ folder, similar to preview in other projects


const plugins = [
    new CopyWebpackPlugin([{
        from: 'assets/',
        context: 'src',
        to: 'assets/',
    }]),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'Griffin Chart Builder 1.0.0',
        template: './src/index.html',
        chunks: ['app'],
        inject: false,
       // scriptLoading: 'defer'
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    }),
    new webpack.DefinePlugin({
        'PUBLICPATH': '"' + publicPath + '"', // from https://webpack.js.org/plugins/define-plugin/: Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with alternate quotes, such as '"production"', or by using JSON.stringify('production').
    }),
];

module.exports = env => {
    return {
        entry: {
            app: './src/index.js',
        },
        resolve: {
            alias: {
                svelte: path.resolve('node_modules', 'svelte'),
                "@Submodule": path.resolve('submodules'),
                "@Project": path.resolve('src'),
                "@Component": path.resolve('src/components'),
            },
            extensions: ['.mjs', '.js', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
        output: {
            path: __dirname + '/' + outputFolder,
            filename: '[name].js',
            chunkFilename: '[name].[id].js'
        },
        module: {
            rules: [{
                    test: /\.svelte$/,
                    use: {
                        loader: 'svelte-loader-hot',
                        options: {
                            emitCss: !isDev,
                            hotReload: isDev,
                            dev: isDev
                           /* preprocess: {
                                style: sass({}, {name: 'scss'})
                            }*/

                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'eslint-loader'
                    }   
                },
                {
                    test: /\.css$/,
                    use: [
                        /**
                         * MiniCssExtractPlugin doesn't support HMR.
                         * For developing, use 'style-loader' instead.
                         * */
                        !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        /**
                         * MiniCssExtractPlugin doesn't support HMR.
                         * For developing, use 'style-loader' instead.
                         * */
                        !isDev ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(svg|png|jpe?g|gif)$/i,
                    use: [
                      {
                        loader: 'file-loader',
                        options: {
                            //name: '[path][name].[ext]',
                            publicPath: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/'
                        }
                      },
                    ],
                },
                {
                    test: /\.html$/,
                    use: 'html-loader',
                    exclude: /index\.html/
                },
                {
                    test: /\.csv$/,
                    use: {
                        loader: 'csv-loader',
                        options: {
                            dynamicTyping: true,
                            header: false,
                            skipEmptyLines: true
                        }
                    }
                }

            ]
        },
        mode,
        plugins,
        devtool: isDev ? 'eval-source-map' : false, // TO DO: WILL WANT SOURCE MAPS
        devServer: {
            contentBase: './dist',
            overlay: true, // shows compiler errors in full-screen overlay
            hot: true
        },
    }
};