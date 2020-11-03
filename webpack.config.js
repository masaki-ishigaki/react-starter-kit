"use strict"

const path = require("path")
const webpack = require("webpack")
const chalk = require("chalk")
const ProgressBar = require("progress")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const DotEnv = require("dotenv-webpack")
const StyleingPlugin = require("styleling-webpack-plugin")

const postcssNormalize = require("postcss-normalize")

const ImageOptimaizationsSize = 8192


module.exports = env => {
  const isStartProcessing = env.processing === "local"
  const isBuildProcessing = env.processing === "build"
  const isEnvFileUsed = env.type !== "none"

  // By default, only css will be loaded.
  // If you want to use sass/scss, please set "useSass" true. (Otherwise, please set false)
  // Also, post-css loader is set. If you want to use it, plase customize it.
  const getStyleLoaders = (cssOptions, useSass) => {
    const loaders = [
      isStartProcessing && require.resolve("style-loader"),
      isBUildProcessing && {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009",
              },
              stage: 3,
            }),
            postcssNormalize()
          ],
          sourceMap: true
        }
      }
    ].filter(Boolean)
    // When sass is used, add sass-loader
    if (useSass) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap: true
          }
        },
        {
          loader: require.resolve("sass-loader"),
          options: {
            implementation: require("sass"),
            sassOptions: {
              fiber: require("fibers")
            },
            sourceMap: true
          }
        }
      )
    }

    return loaders
  }

  // This function returns file path of files including environemnt variables
  const getEnvFilePath = envType => {
    switch (envType) {
      case "development":
        return "./env/development.env"
      case "staging":
        return "./env/staging.env"
      case "production":
        return "./env/production.env"
      default:
        return "./env/development.env"
    }
  }

  // This function is referred to https://github.com/clessg/progress-bar-webpack-plugin
  const displayBuildProgress = (percent, message) => {
    const stream = process.stdout
    if (!stream.isTTY) return

    const barLeft = chalk.bold("[")
    const barRight =chalk.bold("]")
    const preamble = chalk.cyan.bold("  build  ") + barLeft
    // const barFormat = preamble + ":bar" + barRight + chalk.green.bold(" :percent") + "%  current process: " + ":msg"
    const barFormat = preamble + ":bar" + barRight + chalk.green.bold(" :percent")
    const barOptions = {
      complete: "=",
      incomplete: " ",
      width: 100,
      total: 100,
      clear: true,
    }
    const bar = new ProgressBar(barFormat, barOptions)

    let running = false
    let startTime = 0
    let lastPercent = 0
    if (!running && lastPercent !== 0) {
      stream.write("\n")
    }
    let newPercent = Math.floor(percent * barOptions.width)
    if (lastPercent < percent || newPercent === 0) {
      lastPercent = percent
    }
    bar.update(percent, {
      msg: message
    })

    if (!running) {
      running = true
      startTime = new Date
      lastPercent = 0
    } else {
      let now = new Date
      let buildTime = (now - startTime) / 1000 + "s"

      bar.terminate()
    
      stream.write(chalk.green.bold("Build complete in " + buildTime + "\n\n"))
      running = false
    }
  }

  return {
    mode: isBuildProcessing ? "production" : isStartProcessing && "development",
    bail: isBuildProcessing,
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isBuildProcessing
        ? "static/js/[name].[contenthash:8].js"
        : isStartProcessing && "static/js[name].chunk.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {
            cache: true,
            failOnError: true,
            failOnWarning: true,
          },
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            compact: false,
          },
        },
        {
          test: /\.css$/,
          use: getStyleLoaders(
            {
              importLoaders: 1,
              sourceMap: true,
            },
            false
          ),
          sideEffects: true,
        },
        {
          test: /\.(scss|sass)$/,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: true,
            },
            true
          ),
          sideEffects: true
        },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: ImageOptimaizationsSize,
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            {
              loader: require.resolve("file-loader"),
              exclude: [/\.(js|mjs|jsx|ts|tsx|css|scss)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: isBuildProcessing,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parser: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              drop_console: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
            mangle: {
              safari10: true,
            },
          },
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        name: false,
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css", "scss"],
      modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")],
    },
    devServer: {
      inline: true,
      contentBase: path.resolve(__dirname, "dist"),
      open: true,
      hot: true,
      progress: true,
      port: 3000,
    },
    devtool: isBuildProcessing ? "source-map" : isStartProcessng && "inline-source-map",
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            publicPath: "dist",
            filename: "index.html",
            template: path.resolve(__dirname, "public/index.html"),
          },
          isBuildProcessing
            ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
            : undefined
        )
      ),
      isBuildProcessing && new CaseSensitivePathsPlugin(),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: "./tsconfig.json",
          diagnosticOptions: {
            semantic: true,
            syntactic: true
          },
        },
      }),
      isBuildProcessing &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      isEnvFileUsed &&
        new DotEnv({
          path: getEnvFilePath(env.type)
        }),
      isBuildProcessing && new webpack.ProgressPlugin(displayBuildProgress),
      new StyleingPlugin({
        failOnError: true,
        failOnWarning: true,
      }),
    ].filter(Boolean),
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      https: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
    // By default, warning is always dispalyed because limit size is too small
    // Therefore, limit size is set to somewhat bigger value
    performance: {
      maxEntrypointSize: 1000000,
      maxAssetSize: 1000000,
    },
  }
}