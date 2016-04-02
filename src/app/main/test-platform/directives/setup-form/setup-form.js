(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.directive('setupForm', setupForm);

	function setupForm () {
		return {
			restrict: 'E',
			templateUrl: '/app/main/test-platform/directives/setup-form/setup-form.html',
			scope: {
				settings: '=',
				change: '&'
			}
		}
	}
})();