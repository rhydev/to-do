module.exports = {
  'transpileDependencies': [
    'vuetify',
    'vuex-module-decorators'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://todo.powerspike.gg',
        changeOrigin: true,
        pathRewrite: { '^/api': ''}
      }
    }
  }
}
