(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.factory('calcs', calcs);

	function calcs(msApi) {

		msApi.register('getResults', ['http://localhost:3000/api/results']);

		var service = {
			cfm: cfm,
			getResults: getResults
		};

		return service;

		function cfm(eDP, fDP, coeffs) {
			return Math.round(Math.pow((fDP - Math.abs(eDP)*coeffs['K1']), coeffs['N']) * (coeffs['K'] + coeffs['K3'] * fDP));
		}

		function getResults(data) {
			return msApi.request('getResults@save', data);
		}
	};
})();

