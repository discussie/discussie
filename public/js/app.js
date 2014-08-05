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

  // ko.bindingHandlers.log = {
  //   update: function (el, value) {
  //     console.log(ko.unwrap(value)());
  //   }
  // };

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

      // throw 'pause';
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

      var options = {
        id: discussion.id(),
        data: {
          author: newPost.author(),
          body: newPost.body()
        }
      };

      Api.newPost(options, function (res, state) {
        var postId = res.post_id; // jshint ignore: line
        if (state === 'success' && postId) {
          discussion.migrateNewPost(postId);
        } else {
          newPost.errorMessage('There was an issue posting... please try again.');
        }
      });
    },

    migrateNewDiscussion: function (discussionId, postId) {
      this.newDiscussion().id(discussionId); //jshint ignore: line
      this.newDiscussion().created(moment().format('X'));
      this.newDiscussion().migrateNewPost(postId);
      this.discussions.push(this.newDiscussion());
      this.initNewDiscussion();
    },

    initNewDiscussion: function () {
      var options = {
        author: this.user()
      };
      this.newDiscussion(new Discussion(options));
      this.newDiscussion().newPost(new Post(options));
    },

    submitDiscussion: function () {
      var self = this;
      var newDiscussion = this.newDiscussion();
      newDiscussion.errorMessage('');
      var post = newDiscussion.newPost();

      if (!newDiscussion.author() || !post.body() || !newDiscussion.title()) {
        newDiscussion.errorMessage('Author name, message and title are required.');
        return;
      }
      newDiscussion.errorMessage('This is when a new discussion will be created.');

      var options = {
        data: {
          author: newDiscussion.author(),
          title: newDiscussion.title(),
          body: post.body()
        }
      };

      Api.newDiscussion(options, function (res, state) {
        var discussionId = res.discussion_id; // jshint ignore: line
        var postId = res.post_id; // jshint ignore: line
        if (state === 'success' && discussionId) {
          self.migrateNewDiscussion(discussionId, postId);
          self.initNewDiscussion();
          window.location = '#/discussion/' + discussionId;
        } else {
          newDiscussion.errorMessage('There was an issue posting... please try again.');
        }
      });
    }

  });

  ko.applyBindings(new App());

});