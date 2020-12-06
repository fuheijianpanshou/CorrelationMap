const path=require('path');
const webpack=require('webpack');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const {CleanWebpackPlugin} =require('clean-webpack-plugin');


module.exports={
    entry:{
        main:"./src/icontest.js"
    },
    mode:"development",
    devtool:'source-map',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js'
    },
    performance:false,
    optimization:{
        usedExports:true,
        splitChunks:{
            chunks:'all'
        }
    },
    module:{
        rules:[
            {
                test:/\.(csv|eot|ttf|svg|woff)$/,
                use:{
                    loader:'file-loader'
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        }),
        new CleanWebpackPlugin({
            root:path.resolve(__dirname,'./')
        }),
        new webpack.HotModuleReplacementPlugin()
    ]

    
}