(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.factory('autoTest', autoTest);

	function autoTest($rootScope, fanApi, calcs) {
		var service = {
			dataInterval: sensorDataInterval,
			tableInterval: dataTableInterval,
			statusInterval: statusInterval
		};

		return service;

		function sensorDataInterval (fan, interval) {
			return setInterval(function(){
				fanApi.getFanData(fan.ip).then(
					function(response){
						var data = {
							envelopeDP: response.envelope_dp,
							fanDP: response.fan_dp,
							fanSpeed: response.fan_speed,
							batt: response.battery,
							airFlow: calcs.cfm(response.envelope_dp, response.fan_dp, fan.coeffs[fan.range])
						};

						$rootScope.$emit('dataAvailable', data);
					},
					function(response){
						toastr.error('Could not collect data for "' + fan.name + '."', 'Oops..')
					})
			}, interval);
		}

		function dataTableInterval (fan, interval) {
			return setInterval(function(){
				fanApi.getDataTable(fan.ip).then(
					function(response){
						$rootScope.$emit('tableAvailable', response.table);
					},
					function(reponse){
						// toastr.warning('Could not get data table');
					})
			}, interval);
		}

		function statusInterval (fan, interval) {
			return setInterval(function(){
				fanApi.getTestStatus(fan.ip).then(
					function(response){
						$rootScope.$emit('statusAvailable', [response.status, response.active]);
					},
					function(reponse){
						// toastr.warning('Could not get data table');
					})
			}, interval);
		}
	}
})();