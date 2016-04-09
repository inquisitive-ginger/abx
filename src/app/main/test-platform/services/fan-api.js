(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.factory('fanApi', fanApi);

	function fanApi(msApi){
		var service = {
			getFanList			: getFanList,
			fanIsConnected		: fanIsConnected,
			getFanData			: getFanData,
			getFanParameters	: getFanParameters,
			startTest			: startTest,
			stopTest			: stopTest,
			registerFanEndpoints: registerFanEndpoints,
			getDataTable 		: getDataTable,
			getTestStatus 		: getTestStatus
		};

		return service;

		function getFanList() {
			return msApi.request('fanList@get');
		};

		function fanIsConnected(name) {
			return msApi.request('fanConnected@get', {'fanName': name});
		};

		function getDataTable(name) {
			return msApi.request('dataTable-' + name + '@get')
		};

		function getFanData(name) {
			return msApi.request('fanSensors-' + name + '@get');
		};

		function getTestStatus(name) {
			return msApi.request('testStatus-' + name + '@get')
		};

		function getFanParameters(name) {
			return msApi.request('fanParams-' + name + '@get');
		};

		function startTest(name, settings) {
			return msApi.request('startTest-' + name + '@save', settings);
		}

		function stopTest(name) {
			return msApi.request('stopTest-' + name + '@save');
		}

		function registerFanEndpoints(name) {
			var baseUrl = 'http://localhost:3000/dm32/api';
			msApi.register('fanParams-' + name, [baseUrl + '/parameters']);
			msApi.register('fanCommand-' + name, [baseUrl + '/command']);
			msApi.register('fanSensors-' + name, [baseUrl + '/sensors']);
			msApi.register('startTest-' + name, [baseUrl + '/test/start']);
			msApi.register('stopTest-' + name, [baseUrl + '/test/stop']);
			msApi.register('dataTable-' + name, [baseUrl + '/test/table']);
			msApi.register('testStatus-' + name, [baseUrl + '/test/status']);
		}
	}
})();