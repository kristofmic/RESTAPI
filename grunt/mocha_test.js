module.exports = {
  spec: {
    options: {
      reporter: 'spec',
      require: 'coverage/blanket'
    },
    src: [
      './spec/mocha.conf.js',
      './spec/**/*.spec.js'
    ]
  },
  cov: {
    options: {
      reporter: 'html-cov',
      quiet: true,
      captureFile: 'coverage/coverage.html'
    },
    src: [
      './spec/mocha.conf.js',
      './spec/**/*.spec.js'
    ]
  }
};