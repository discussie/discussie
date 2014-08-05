
/**
 * @module  discussion
 * @description  The discussion model.
 * @author  Piet
 */
define(
[
  'lodash',
  'ko',
  'models/baseModels/baseModel',
  'moment',
  'models/post'
],
function (_, ko, BaseModel, moment, Post) {

  /**
  * Model variables
  */
  var Discussion = function (options) {
    options = options || {};

    this.author = options.author || null;
    this.created = options.created || null;
    this.id = options.id || null;
    this.title = options.title || null;
    this.link = options.id ? '#/discussion/' + options.id : null;

    this.posts = [];

    this.newPost = {};

    this.errorMessage = '';

    BaseModel.apply(this, arguments);
    this.initialize();
  };

  /**
  * Model methods
  */
  _.extend(Discussion.prototype, BaseModel.prototype, {

    initialize: function () {

      _.bindAll(this, 'initNewPost', 'migrateNewPost');

      this.initNewPost();

      this.fromNowCreated = ko.computed(function () {
        return moment(this.created()).fromNow();
      }, this);

      this.firstPost = ko.computed(function () {
        return this.posts()[0];
      }, this);

    },

    initNewPost: function () {
      this.newPost(new Post({ discussion: this.id }));
    },

    migrateNewPost: function (id, body) {
      this.newPost().id(id);
      this.newPost().body(body);
      this.newPost().created(moment().format('X'));
      this.posts.push(this.newPost());
      this.initNewPost();
    }

  });

  return Discussion;

});