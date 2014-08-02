
/**
 * @module  api
 * @description  The api module.
 * @author  Piet
 */
define(
[
  'lodash',
  'net',
  'ko',
  'models/baseModels/baseModel',
  'models/discussion',
  'models/post',
],
function (_, Net, ko, BaseModel, Discussion, Post) {

  /**
  * Module variables
  */
  var Api = function (options) {

    this.endpoint = {
      getDiscussions: { verb: 'get', url: '/api/discussions/' },
      getPosts: { verb: 'get', url: '/api/discussions/{id}' },
      newDiscussion: { verb: 'post', url: '/api/discussions/' },
      newPost: { verb: 'post', url: '/api/discussions/{id}' }
    };

    this.discussions = [];

    BaseModel.apply(this, arguments);
    // this.initialize();
  };

  /**
  * Module methods
  */
  _.extend(Api.prototype, BaseModel.prototype, {

    // initialize: function () {},

    load: function (name, parentRequire, onload, config) {
      var self = this;
      if (config.isBuild || config.bypassGatekeeper) { return onload(self); }

      this.getDiscussions(function (res, state) {
        if (state === 'error') { onload(self); }
        if (res.length === 0) {
          onload(self);
        }
        self.discussions().forEach(function (discussion) {
          self.getPosts(discussion, function (res, state) {
            if (state === 'error') {
              onload(self);
            } else {
              onload(self);
            }
          });
        });
      });

    },

    getDiscussions: function (callback) {
      var self = this;
      callback = callback || _.noop;
      this.call('getDiscussions', function (discussions, state) {
        if (state !== 'error') {
          discussions.forEach(function (discussion) {
            self.discussions.push(new Discussion(discussion));
          });
        }
        callback(discussions, state);
      });
    },

    getPosts: function (discussion, callback) {
      var self = this;
      callback = callback || _.noop;
      this.call('getPosts', { id: discussion.id() }, function (posts, state) {
        if (state !== 'error') {
          posts.forEach(function (post) {
            discussion.posts.push(new Post(post));
          });
        }
        callback(posts, state);
      });
    },

    call: function (endpoint, data, callback) {
      var self = this;

      endpoint = this.endpoint()[endpoint] || false;

      if (!endpoint) {
        console.error('endpoint doesn\'t exist');
        throw 'error';
      }

      if (typeof data === 'function') {
        callback = data;
        data = {};
      }
      callback = callback || _.noop;

      var url = endpoint.url;
      if (url.match('{id}')) {
        if (!data.id) {
          console.error('id needed for url');
          throw 'error';
        }
        url = url.replace('{id}', data.id);
        delete data.id;
      }

      var packet = {
        url: url
      };
      _.extend(packet, data);

      var success = function (res) {
        callback(res, 'success');
      };

      var error = function (res) {
        callback(res, 'error');
      };

      Net.json[endpoint.verb](packet).then(success, error);

    }

  });

  return new Api();

});