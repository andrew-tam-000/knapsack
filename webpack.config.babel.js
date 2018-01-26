import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import _ from 'lodash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const BASE = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'public');
const PORT = 3000;

const isProdBuild = process.argv.indexOf("-p") !== -1;

const config = {
    node: {
        fs: 'empty'
    },
    entry: [
        path.join(BASE, 'js', 'main.js'),
        path.join(BASE, 'scss', 'main.scss'),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(OUTPUT_DIR, 'dist/')
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    ctx: {
                                        autoprefixer: { browsers: ['last 10 versions'] }
                                    }
                                }
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /.*worker\.js$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'worker-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    },
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        contentBase: OUTPUT_DIR,
        compress: true,
        port: PORT,
        hot: true
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('main.css'),
        new HtmlWebpackPlugin()
    ]
};

export default isProdBuild ?(
    _.assign(
        _.omit(config, ['devServer', 'devtool', 'plugins']),
        {
            plugins: [
                new ExtractTextPlugin('main.css')
            ]
        }
    )
) : (
    config
)
