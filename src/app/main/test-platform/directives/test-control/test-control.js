(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.directive('testControl', testControl);

	function testControl() {
		return {
			restrict: 'E',
			templateUrl: '/app/main/test-platform/directives/test-control/test-control.html',
			scope: {
				invalid: '=',
				active: '=',
				start: '&',
				stop: '&'
			}
		};
	}
})();	