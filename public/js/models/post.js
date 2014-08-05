
/**
 * @module  post
 * @description  The post model.
 * @author  Piet
 */
define(
[
  'lodash',
  'ko',
  'models/baseModels/baseModel',
  'moment'
],
function (_, ko, BaseModel, moment) {

  /**
  * Model variables
  */
  var Post = function (options) {
    options = options || {};

    this.author = options.author || null;
    this.body = options.body || null;
    this.created = options.created || null;
    this.discussion = options.discussion || null;
    this.id = options.id || null;

    this.isFirst = false;

    this.errorMessage = '';

    BaseModel.apply(this, arguments);
    this.initialize();
  };

  /**
  * Model methods
  */
  _.extend(Post.prototype, BaseModel.prototype, {

    initialize: function () {

      this.fromNowCreated = ko.computed(function () {
        return moment(this.created()).fromNow();
      }, this);


      this.postDetails = ko.computed(function () {
        var timeAgo = document.createElement('span');
        timeAgo.title = moment(this.created()).format('YYYY-MM-DD HH:MM:SS');
        timeAgo.textContent = this.fromNowCreated();
        return this.author() + ' ' + (this.isFirst() ? 'posted' : 'replied') + ' ' + timeAgo.outerHTML;
      }, this);
    }

  });

  return Post;

});