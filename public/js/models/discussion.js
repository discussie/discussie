
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
  'moment'
],
function (_, ko, BaseModel, moment) {

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

    BaseModel.apply(this, arguments);
    this.initialize();
  };

  /**
  * Model methods
  */
  _.extend(Discussion.prototype, BaseModel.prototype, {

    initialize: function () {

      this.fromNowCreated = ko.computed(function () {
        return moment(this.created()).fromNow();
      }, this);

    }

  });

  return Discussion;

});