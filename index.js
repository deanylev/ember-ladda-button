'use strict';

module.exports = {
  name: require('./package').name,

  included(app) {
    app.import('vendor/ladda.min.css');
  }
};
