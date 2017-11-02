var paths = {
  components: {
    normalizecss: './node_modules/normalize.css/',
  },
  css: {
    src: './public/stylesheets/src/',
    dist: './public/stylesheets/dist/',
    maps: './public/stylesheets/src/maps/'
  },
  js: {
    src: './public/javascripts/src/',
    vendor: './public/javascripts/vendor/',
    dist: './public/javascripts/dist/'
  }
}

var globs = {
  js: {
    src: [
      paths.js.src + 'charts.js',
      paths.js.src + 'main.js',
    ],
    dist: {
      original: 'app.js',
      minified: 'app.min.js'
    },
  },
  css: {
    raw: [
      paths.css.src + '*.css'
    ],
    src: [
      paths.css.src + 'style.css'
    ],
    dist: {
      original: 'style.css',
      minified: 'style.min.css',
      temp: 'style.temp.css'
    },
    maps: [
      'config.yml',
      'bp.yml',
      'colors.yml',
      'icons.yml',
      'fonts.yml'
    ],
    normalize: paths.components.normalizecss + 'normalize.css',
  }
};

module.exports = {
  paths: paths,
  globs: globs
};
