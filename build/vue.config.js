module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/styles/_variables.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("fonts")
      .test(/\.(ttf|otf|eot|woff|woff2)$/)
      .use("file-loader")
        .loader("file-loader")
        .tap(options => {
          options = {
            name: '~@/assets/fonts/[name].[ext]',
          }
          return options
        })
        .end()
  }
};