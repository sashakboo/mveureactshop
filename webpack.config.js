// Generated using webpack-cli https://github.com/webpack/webpack-cli

import { resolve as _resolve } from "path";
import webpack from "webpack";
import CopyPlugin from 'copy-webpack-plugin';

const isProduction = process.env.NODE_ENV == "production";

const config = {
  target: "node",
  entry: "./src/index.ts",
  output: {
    path: _resolve(".", "build"),
    filename: "main.cjs"
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
    new CopyPlugin({
      patterns: [
        { from: "./config", to: "./config" }
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

export default () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
