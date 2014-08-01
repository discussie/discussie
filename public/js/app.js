/**
 * App.js
 * @description This is loaded after require, but before any other js files. Init app stuff here.
 */
define(
[
  'lodash',
  'ko',
  'models/baseModels/baseViewModel',
  'net'
],
function (_, ko, BaseViewModel, Net) {

  var App = function () {

    this.discussions = [];

    BaseViewModel.apply(this, arguments);
  };

  _.extend(App.prototype, BaseViewModel.prototype, {

    initialize: function () {
      console.log(Net);
      Net.json.get({url: '/api/discussions/'}).then(function (res) {
        console.log(res);
      }, function (error) {
        console.log(error);
      });
    }

  });

  ko.applyBindings(new App());

});