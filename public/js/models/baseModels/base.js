/**
* @module Base
* @description Methods and variables shared by baseModel and baseViewModel. Includes _setup which converts properties into observables.
* @mixin
*/
define(['lodash', 'ko'], function (_, ko) {

	/**
	* Module variables
	*/
	var Base = function (options) {

		// default keys to ignore when using toJSON
		this.jsonIgnore = ['init', 'initialize', '_setup', 'toJSON'];

		// fire _setup which converts static properties ko.obserable and ko.observableArray
		console.log(this);
		this._setup(options);

	};

	/**
	* Module methods
	*/
	_.extend(Base.prototype, {

		/**
		 * Return object data as a json object.
		 *
		 * @param  {array} [array] Keys to return in json object.
		 * @param {array}  [ignore=this.jsonIgnore] Keys to ignore.
		 * @return {json}  JSON object of specified keys or all keys, excludes ignored.
		 */
		toJSON: function (array, ignore) {
			array = array || [];
			ignore = ignore || this.jsonIgnore();

			// if no array iterate over props to assemble array
			if (array.length === 0) {
				var prop;
				for (prop in this) {
					array.push(prop);
				}
			}

			// iterate over array and apply keys and values
			var json = {};
			for (var i = array.length - 1; i >= 0; i--) {

				// ignore stuff (particularly initialize)
				if (ignore.indexOf(array[i]) !== -1) { continue; }

				// if this[array[i]]() does not exist catch and return undefined
				try {
					json[array[i]] = this[array[i]]();
				} catch (e) {
					console.warn(e.message);
					json[array[i]] = undefined;
				}

			}

			return json;
		},


		/**
		 * Converts object options into ko.observable and lo.observableArray
		 *
		 * @param  {*} options
		 */
		_setup: function (options) {
			var prop;

			options = options || {};

			for (prop in this) {
				if (this.hasOwnProperty(prop)) {
					if (options[prop]) {
						this[prop] = _.isArray(options[prop]) ?
							ko.observableArray(options[prop]) :
							ko.observable(options[prop]);
					}
					else {
						this[prop] = _.isArray(this[prop]) ?
							ko.observableArray(this[prop]) :
							ko.observable(this[prop]);
					}
				}
			}
		}
	});

	return Base;

});