(function(){
	'use strict';

	angular
		.module('fuse')
		.directive('formLocator', formLocator);

	function formLocator(){
		return {
		      link: function(scope) {
		        scope.$emit('formLocator');
		      }
		};
	}
})();