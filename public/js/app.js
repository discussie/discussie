/**
 * App.js
 * @description This is loaded after require, but before any other js files. Init app stuff here.
 */
define(
[
  'lodash',
  'ko',
  'models/baseModels/baseViewModel',
  'util/api!'
],
function (_, ko, BaseViewModel, Api) {

  var App = function () {

    this.loaded = false;
    this.discussions = [];

    BaseViewModel.apply(this, arguments);
  };

  _.extend(App.prototype, BaseViewModel.prototype, {

    initialize: function () {
      var self = this;

      Api.discussions().forEach(function (discussion) {
        self.discussions.push(discussion);
      });

      this.activeDiscussion = ko.computed(function () {
        var discussion = false;
        if (this.uriSegments()[0] === 'discussion') {
          var id = this.uriSegments()[1];
          discussion = _.find(self.discussions(), function (discussion) {
            return id === discussion.id();
          });
        }
        return discussion;
      }, this);


      this.loaded(true);
    }

  });

  ko.applyBindings(new App());

});