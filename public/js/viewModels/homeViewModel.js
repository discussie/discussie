
/**
 * @module  homeViewModel
 * @description  The homeViewModel viewModel.
 */
define(['lodash', 'ko', 'baseViewModel'], function (_, ko, BaseViewModel) {

	/**
	 * Variables
	 */
	var HomeViewModel = function (options) {

		this.variable = 'value';

		BaseViewModel.apply(this, arguments);
	};

	/**
	 * Methods
	 */
	_.extend(HomeViewModel.prototype, BaseViewModel.prototype, {

		initialize: function () {
			/* initilize stuff here */

			console.log(this.variable()); // this.variable is automatically made observable

		}

	});

	ko.applyBindings(new HomeViewModel());

});