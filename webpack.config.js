/* global require, __dirname */
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const {sass} = require('svelte-preprocess-sass');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const path = require('path');
const outputFolder = process.env.NODE_ENV === 'localpreview' ? 'preview/' : 'dist/';
const isDev = mode === 'development';
const repoName = 'newChartBuilder';
const publicPath = process.env.NODE_ENV === 'production' ? '/' + repoName + '/' : '/';
const title = 'Griffin Chart Builder 1.0.0';
const secrets = process.env.NODE_ENV === 'production' ? null : require('./secrets.json');


const plugins = [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
        from: 'assets/',
        context: 'src',
        to: 'assets/',
    },{
        from: 'griffin/assets/',
        context: 'src',
        to: 'tester/assets/',
        ignore: ['Pew/css/**/*.*']
    },{
        from: 'griffin/assets/Pew/css/',
        context: 'src',
        to: 'tester/assets/Pew/css/',
        transform(content) {
            if (process.env.NODE_ENV === 'production') {
                // this modifies the content of the files being copied; here making sure url('/...') is changed so that it will
                // work on gitHub pages where oublic path is /{repoName}/
                // also changes references to 'pew' to refer to 'Pew'
                return content.toString().replace(/url\("\/([^/])/g, 'url("/' + repoName + '/tester/$1').replace(/\/pew\//g, '/Pew/');
            } else {
                return content.toString().replace(/url\("\/([^/])/g, 'url("/tester/$1').replace(/\/pew\//g, '/Pew/');
            }
        }
    },{
        from: 'griffin/-/',
        context: 'src',
        to: 'tester/-/',
    }]),
    new HtmlWebpackPlugin({
        title,
        template: './src/index.html',
        chunks: ['chart-builder'],
        inject: false,
       // scriptLoading: 'defer'
    }),
    new HtmlWebpackPlugin({
        title: 'Griffin Tester',
        template: './src/griffin/index-100.html',
        chunks: ['griffin'],
        filename: './tester/index.html',
        inject: true,
        scriptLoading: 'defer',
        publicPath: publicPath + 'tester/'
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css'
    }),
    new webpack.DefinePlugin({
        'PUBLICPATH': '"' + publicPath + '"', // from https://webpack.js.org/plugins/define-plugin/: Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with alternate quotes, such as '"production"', or by using JSON.stringify('production').
        'GOOGLE_SHEET_ID': secrets ? '"' + secrets.GoogleSheets.sheetId + '"' : '"' + process.env.GOOGLE_SHEET_ID + '"',
        'GOOGLE_SHEET_KEY': secrets ? '"' + secrets.GoogleSheets.key + '"' : '"' + process.env.GOOGLE_SHEET_KEY + '"',
        'GOOGLE_ID': secrets ? '"' + secrets.GoogleSheets.ID + '"' : '"' + process.env.GOOGLE_ID + '"'
    }),
];


module.exports = (env) => {
    console.log(env)
    return {
        entry: {
            'chart-builder': './src/index.js',
            'griffin': './src/griffin/griffin.js'
        },
        resolve: {
            alias: {
                svelte: path.resolve('node_modules', 'svelte'),
                "@Submodule": path.resolve('submodules'),
                "@Project": path.resolve('src'),
                "@Script": path.resolve('src/scripts'),
                "@Component": path.resolve('src/components'),
            },
            extensions: ['.mjs', '.js', '.svelte'],
            mainFields: ['svelte', 'browser', 'module', 'main']
        },
        output: {
            path: __dirname + '/' + outputFolder,
            filename: '[name].js?v[hash]',
            chunkFilename: '[name].[id].js'
        },
        module: {
            rules: [
                {
                    test: /\.(woff|woff2)$/,
                    use: ['file-loader']
                },{
                    test: /\.svelte$/,
                    use: {
                        loader: 'svelte-loader',
                        options: {
                            emitCss: !isDev,
                            hotReload: false,
                            dev: isDev,
                            onwarn: function (warning, handleWarning) {

                                if (warning.code === 'a11y-no-onchange') { return }

                                // process as usual 

                                handleWarning(warning);
                            }
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
                    ],

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
                    test: /\.(svg|png|jpe?g|gif|csv)$/i,
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
                    exclude: /index.*\.html/
                }, {
                    test: /index\.html$/,
                    use: [{
                        loader: 'ejs-loader',
                        options: {
                            esModule: false
                        }
                    }]
                }, {
                    test: /\.md$/,
                    use: [{
                        loader: 'html-loader'
                    },
                    {
                        loader: 'markdown-loader',
                        options: {
                            smartyPants: true
                        }
                    }]
                }
               /* {
                    test: /\.csv$/,
                    use: {
                        loader: 'csv-loader',
                        options: {
                            dynamicTyping: true,
                            header: false,
                            skipEmptyLines: true
                        }
                    }
                }*/

            ]
        },
        mode,
        plugins,
        devtool: isDev ? 'eval-source-map' : false, // TO DO: WILL WANT SOURCE MAPS
        devServer: {
            contentBase: './dist',
            overlay: true, // shows compiler errors in full-screen overlay
            hot: false
        },
    }
};