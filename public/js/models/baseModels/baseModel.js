/**
* @module BaseModel
* @description Foundation model
* @mixin
*/
define(['lodash', 'ko', 'models/baseModels/base'], function (_, ko, Base) {

	/**
	* Module variables
	*/
	var BaseModel = function (options) {

		/**
		 * Base stuff
		 */
		Base.apply(this, arguments);
		this.baseModelInitialize.call(this, options);

	};

	/**
	* Module methods
	*/
	_.extend(BaseModel.prototype, Base.prototype, {

		baseModelInitialize: function (options) {

			/* add baseViewModel initialize stuff here */

			// fire initialize
			this.initialize.call(this, options);
		},

		initialize: function () {
			// gets overridden
		},

	});

	return BaseModel;

});