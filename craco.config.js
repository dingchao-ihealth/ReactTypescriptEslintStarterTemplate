const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackBar = require("webpackbar");

const env = process.env.REACT_APP_ENV;
module.exports = {
  webpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: env === "production" ? "static" : "disabled",
        analyzerHost: "127.0.0.1",
        analyzerPort: 8888,
        openAnalyzer: true,
        reportFilename: path.resolve(__dirname, "analyzer/report.html"),
      }),
      new WebpackBar({
        profile: true,
        color: "#fa8c16",
      }),
    ],
    configure: (webpackConfig, { env: webpackEnv, paths }) => {
      if (env === "production") {
        webpackConfig.optimization.splitChunks = {
          ...webpackConfig.optimization.splitChunks,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              name: "vendor",
              chunks: "all",
            },
            antd: {
              test: /antd/,
              name: "antd",
              priority: 100,
            },
            commons: {
              chunks: "all",
              // Pack the modules shared by more than two chunk s into the commons group.
              minChunks: 2,
              name: "commons",
              priority: 80,
            },
          },
        };
      }
      return webpackConfig;
    },
  },
};
