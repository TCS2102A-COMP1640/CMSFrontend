const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isProduction = process.argv.indexOf("production") >= 0 || process.env.NODE_ENV === "production";

/** @type {import('webpack').Configuration} */
module.exports = {
	mode: isProduction ? "production" : "development",
	context: path.resolve(__dirname, "src"),
	entry: {
		app: "./index.tsx"
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: isProduction ? "[name].[contenthash].js" : "[name].[hash].js",
		chunkFilename: isProduction ? "[name].[contenthash].js" : "[name].[hash].js"
	},
	target: "web",
	resolve: {
		extensions: [".js", ".ts", ".tsx"],
		alias: {
			"@app": path.resolve(__dirname, "src", "app")
		}
	},
	module: {
		rules: [
			// .ts, .tsx
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							plugins: [!isProduction && "react-refresh/babel", "lodash"].filter(Boolean),
							presets: [
								["@babel/preset-env", { useBuiltIns: "usage", corejs: "3.21" }],
								"@babel/preset-typescript",
								"@babel/preset-react"
							]
						}
					}
				]
			},
			// css
			{
				test: /\.css$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : "style-loader",
					{
						loader: "css-loader"
					}
				]
			},
			// static assets
			{ test: /\.html$/, use: "html-loader" },
			{ test: /\.(a?png|svg)$/, use: "url-loader?limit=10000" },
			{
				test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
				use: "file-loader"
			}
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					chunks: "initial",
					minChunks: 2
				},
				muiVendors: {
					test: /[\\/]node_modules[\\/]@mui[\\/]/,
					chunks: "all",
					filename: isProduction ? "muiVendors.[contenthash].js" : "muiVendors.[hash].js"
				},
				chartVendors: {
					test: /[\\/]node_modules[\\/](react-chartjs-2|chart[.]js)[\\/]/,
					chunks: "all",
					filename: isProduction ? "chartVendors.[contenthash].js" : "chartVendors.[hash].js"
				},
				vendors: {
					test: /[\\/]node_modules[\\/]((?!(@mui|react-chartjs-2|chart[.]js)).*)/,
					chunks: "all",
					filename: isProduction ? "vendors.[contenthash].js" : "vendors.[hash].js"
				}
			}
		},
		runtimeChunk: true,
		usedExports: true
	},
	plugins: [
		new webpack.EnvironmentPlugin({
			"process.env.NODE_ENV": JSON.stringify("development"), // use 'development' unless process.env.NODE_ENV is defined
			DEBUG: false
		}),
		new MiniCssExtractPlugin({
			filename: "[hash].css"
		}),
		new HtmlWebpackPlugin({
			template: "assets/index.html",
			minify: {
				minifyJS: true,
				minifyCSS: true,
				removeComments: true,
				useShortDoctype: true,
				collapseWhitespace: true,
				collapseInlineTagWhitespace: true
			}
		}),
		isProduction && new BundleAnalyzerPlugin({ analyzerMode: "static" }),
		!isProduction && new ReactRefreshWebpackPlugin()
	].filter(Boolean),
	devServer: {
		static: path.resolve(__dirname, "src", "assets"),
		historyApiFallback: true,
		hot: true
	},
	devtool: isProduction ? "hidden-source-map" : "cheap-module-source-map"
};
