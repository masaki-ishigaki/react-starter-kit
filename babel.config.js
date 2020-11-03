module.exports = function(api) {
  api.cache(true)

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
          ie: "11",
        },
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ]

  // Add plugin if necessary
  // Note: https://babeljs.io/docs/en/plugin#docsNav
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining",
  ]

  return {
    presets,
    plugins,
  }
}