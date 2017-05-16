const argv = require('yargs').argv
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const project = require('./project.config')
const debug = require('debug')('app:config:webpack')

const __DEV__ = project.globals.__DEV__
const __PROD__ = project.globals.__PROD__
const __TEST__ = project.globals.__TEST__

debug('Creating configuration.')
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: [ '.js', '.jsx', '.json' ],
    modules: [
      'src',
      'node_modules',
    ]
  },
  module: {}
}

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = project.paths.client('main.js')

webpackConfig.entry = {
  app: __DEV__
    ? [ APP_ENTRY ].concat(`webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`)
    : [ APP_ENTRY ],
  vendor: project.compiler_vendors
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].[${project.compiler_hash_type}].js`,
  path: project.paths.dist(),
  publicPath: project.compiler_public_path
}

// ------------------------------------
// Externals
// ------------------------------------
// webpackConfig.externals = [nodeExternals(
//   {
//     // whitelist: [/^slick-carousel/]
//   }
// )]
webpackConfig.externals = {}
webpackConfig.externals[ 'react/lib/ExecutionEnvironment' ] = true
webpackConfig.externals[ 'react/lib/ReactContext' ] = true
webpackConfig.externals[ 'react/addons' ] = true

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(project.globals),
  new HtmlWebpackPlugin({
    template: project.paths.client('index.html'),
    hash: false,
    favicon: project.paths.public('favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    }
  })
]

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', function (stats) {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map(err => err.message || err)
        )
      }
    })
  })
}

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Enabling plugins for production (OccurrenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: [ 'vendor' ]
    })
  )
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules = [ {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [ [ 'latest', { 'modules': false } ], 'react', 'stage-0' ],
      plugins: [ 'transform-runtime', 'transform-decorators-legacy', 'system-import-transformer' ],
    }
  }
}, {
  test: /\.json$/,
  use: 'json-loader'
} ]

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.

if (__DEV__) {
  webpackConfig.module.rules.push({
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        query: {
          modules: true,
          sourceMap: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
          importLoaders: 2
        }
      },
      'postcss-loader',
      {
        loader: 'sass-loader',
        query: {
          outputStyle: 'expanded',
          // sourceMap: true,
        }
      }
    ]
  })
  webpackConfig.module.rules.push({
    test: /\.css$/,
    use: [ 'style-loader',
      {
        loader: 'css-loader',
        query: {
          modules: true,
          sourceMap: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
          importLoaders: 1
        }
      },
      'postcss-loader' ],
  })
} else {
  webpackConfig.module.rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      loader: 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
    })
  })
  
  webpackConfig.module.rules.push({
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      loader: 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=2!postcss-loader!sass-loader?outputStyle?expanded'
    })
  })
  
  webpackConfig.plugins.push(
    new ExtractTextPlugin({ filename: '[name].[contenthash].css', disable: false, allChunks: true })
  )
}

webpackConfig.module.rules.push({
  test: /\.svg$/,
  use: [
    {
      loader: 'babel-loader'
    },
    {
      loader: 'react-svg-loader',
      query: {
        svgo: {
          plugins: [{removeTitle: false}],
          floatPrecision: 2
        }
      }
    }
  ]
})

// File loaders
/* eslint-disable */
webpackConfig.module.rules.push(
  {
    test: /\.woff(\?.*)?$/,
    use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.woff2(\?.*)?$/,
    use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
  },
  {
    test: /\.otf(\?.*)?$/,
    use: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
  },
  {
    test: /\.ttf(\?.*)?$/,
    use: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
  },
  { test: /\.eot(\?.*)?$/, use: 'file-loader?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.(png|jpg)$/, use: 'url-loader?limit=8192' }
)
/* eslint-enable */

module.exports = webpackConfig
