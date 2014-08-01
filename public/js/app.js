/**
 * App.js
 * @description This is loaded after require, but before any other js files. Init app stuff here.
 */
define(
[
  'lodash',
  'ko',
  'models/baseModels/baseViewModel'
],
function (_, ko, BaseViewModel) {

  var App = function () {

    BaseViewModel.apply(this, arguments);
  };

  _.extend(App.prototype, BaseViewModel.prototype, {

    initialize: function () {

    }

  });

  ko.applyBindings(new App());

});