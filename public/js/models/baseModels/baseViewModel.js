/**
 * @module  baseViewModel
 * @description  The baseViewModel model.
 * @author  Piet
 */
define(['lodash', 'models/baseModels/base'], function (_, Base) {

  /**
  * Model variables
  */
  var BaseViewModel = function (options) {

    this.uriSegments = [];

    /**
     * Base stuff
     */
    Base.apply(this, arguments);
    this.baseViewModelInitialize.call(this, options);

  };

  /**
  * Model methods
  */
  _.extend(BaseViewModel.prototype, Base.prototype, {

    baseViewModelInitialize: function (options) {

      this.updateHashUri();

      // fire initialize
      this.initialize.call(this, options);
    },

    initialize: function () {
      /* this gets overridden by page specific viewModel */
    },

    updateHashUri: function () {
      var self = this;

      // set params property
      var update = function () {
        window.scrollTo(0, 0);

        var hash = window.location.hash.replace(/#\/?/, '');
        self.uriSegments(hash.split('/'));

      };

      // run on first call
      update();

      // bind to onpopstate on first call
      window.onpopstate = update;

      // subsiquent calls only run update
      this.updateHashUri = update;
    }

  });

  return BaseViewModel;

});