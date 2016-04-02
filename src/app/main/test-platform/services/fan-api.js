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

		function fanIsConnected(fan) {
			return msApi.request('fanConnected@get', {'fanid': fan});
		};

		function getDataTable(ip) {
			return msApi.request('dataTable-' + ip + '@get')
		};

		function getFanData(ip) {
			return msApi.request('fanSensors-' + ip + '@get');
		};

		function getTestStatus(ip) {
			return msApi.request('testStatus-' + ip + '@get')
		};

		function getFanParameters(ip) {
			return msApi.request('fanParams-' + ip + '@get');
		};

		function startTest(ip, settings) {
			return msApi.request('startTest-' + ip + '@save', settings);
		}

		function stopTest(ip) {
			return msApi.request('stopTest-' + ip + '@save');
		}

		function registerFanEndpoints(fan) {
			var baseUrl = 'http://' + fan.ip + ':3000/api';
			msApi.register('fanParams-' + fan.ip, [baseUrl + '/parameters']);
			msApi.register('fanCommand-' + fan.ip, [baseUrl + '/command']);
			msApi.register('fanSensors-' + fan.ip, [baseUrl + '/sensors']);
			msApi.register('startTest-' + fan.ip, [baseUrl + '/test/start']);
			msApi.register('stopTest-' + fan.ip, [baseUrl + '/test/stop']);
			msApi.register('dataTable-' + fan.ip, [baseUrl + '/test/table']);
			msApi.register('testStatus-' + fan.ip, [baseUrl + '/test/status']);
		}
	}
})();