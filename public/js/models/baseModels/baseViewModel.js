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

		this.variable = 'value';

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

			/* add baseViewModel initialize stuff here */

			// fire initialize
			this.initialize.call(this, options);
		},

		initialize: function () {
			/* this gets overridden by page specific viewModel */
		}

	});

	return BaseViewModel;

});