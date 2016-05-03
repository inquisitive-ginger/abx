(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.factory('resultCalculator', calculator);

	function calculator() {
		var service = {
			cfm: cfm
		};

		return service;

		function cfm(eDP, fDP, coeffs) {
			return Math.round(Math.pow((fDP - Math.abs(eDP)*coeffs['K1']), coeffs['N']) * (coeffs['K'] + coeffs['K3'] * fDP));
		}
	};
})();

