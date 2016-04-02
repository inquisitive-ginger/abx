(function(){
	'use strict';

	angular
		.module('fuse')
		.directive('buildingDetails', buildingDetails);

	function buildingDetails(){
		return {
			restrict: 'E',
			templateUrl: '/app/main/common/directives/building-details/building-details.html',
			scope: {
				building: '='
			}
		};
	}
})();