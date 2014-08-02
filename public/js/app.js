/**
 * App.js
 * @description This is loaded after require, but before any other js files. Init app stuff here.
 */
define(
[
  'lodash',
  'ko',
  'moment',
  'models/baseModels/baseViewModel',
  'models/post',
  'models/discussion',
  'util/api!'
],
function (_, ko, moment, BaseViewModel, Post, Discussion, Api) {

  var App = function () {

    this.user = window.localStorage.user || '';
    this.loaded = false;
    this.discussions = [];

    this.newDiscussion = {};

    BaseViewModel.apply(this, arguments);
  };

  _.extend(App.prototype, BaseViewModel.prototype, {

    initialize: function () {
      var self = this;

      _.bindAll(this, 'submitPost');

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
        if (discussion) {
          discussion.newPost().author(this.user());
        }
        return discussion;
      }, this);

      this.user.subscribe(function (newUser) {
        window.localStorage.user = newUser;
      });

      this.initNewDiscussion();

      this.loaded(true);
    },

    submitPost: function (discussion) {
      var newPost = discussion.newPost();
      newPost.errorMessage('');

      if (!newPost.author() && !newPost.body()) {
        newPost.errorMessage('Author name and a message are required.');
        return;
      }
      if (!newPost.author()) {
        newPost.errorMessage('Author name is required.');
        return;
      }
      if (!newPost.body()) {
        newPost.errorMessage('A message is required.');
        return;
      }
      newPost.errorMessage('');

      var data = {
        data: {
          author: newPost.author(),
          body: newPost.body()
        }
      };

      Api.newPost(discussion, data, function (res, state) {
        var postId = res.post_id; // jshint ignore: line
        if (state === 'success' && postId) {
          discussion.migrateNewPost(postId);
        } else {
          newPost.errorMessage('There was an issue posting... please try again.');
        }
      });
    },

    initNewDiscussion: function () {
      var options = {
        author: this.user()
      };
      this.newDiscussion(new Discussion(options));
      this.newDiscussion().posts.push(new Post(options));
    },

    submitDiscussion: function () {
      var newDiscussion = this.newDiscussion();
      newDiscussion.errorMessage('');
      var post = newDiscussion.firstPost();

      if (!newDiscussion.author() || !post.body() || !newDiscussion.title()) {
        newDiscussion.errorMessage('Author name, message and title are required.');
        return;
      }
      newDiscussion.errorMessage('This is when a new discussion will be created.');

      var discussionOptions = {
        data: {
          author: newDiscussion.author(),
          title: newDiscussion.title()
        }
      };

      var firstPostOptions = {
        data: {
          author: newDiscussion.author(),
          body: newDiscussion.firstPost().body()
        }
      };

      // Api.newDiscussion(discussion, data, function (res, state) {
      //   var postId = res.post_id; // jshint ignore: line
      //   if (state === 'success' && postId) {
      //     discussion.migrateNewPost(postId);
      //   } else {
      //     newPost.errorMessage('There was an issue posting... please try again.');
      //   }
      // });
    }

  });

  ko.applyBindings(new App());

});