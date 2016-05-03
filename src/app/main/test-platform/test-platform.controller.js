(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.controller('TestPlatformController', TestPlatformController);

	function TestPlatformController ($rootScope, TestPlatformData, utils, fanApi, msApi, resultCalculator, $mdDialog) {
		var vm = this;

		vm.availableFans		= [];
		vm.building 			= {};
		vm.chartData 		 	= [];
		vm.data 				= TestPlatformData;
		vm.dataTable 			= TestPlatformData.table;
		vm.resultsInputTable	= [];
		vm.enabledFans			= [];
		vm.updateEnabledFans	= updateEnabledFans;
		vm.updateTestStandard 	= updateTestStandard;
		vm.refreshFans			= refreshAvailableFans;
		vm.removePrimaryFan		= removePrimaryFan;
		vm.settings 			= {'standards': TestPlatformData.standards};
		vm.sensorDataArrs 		= {pressure:[], flow:[], speed:[]};
		vm.socket 				= io('http://192.168.1.212:3000/api');
		vm.startTest 			= startTest;
		vm.stopTest				= stopTest;
		vm.testActive			= false;
		vm.testResults 			= {};

		initialize(msApi);

		function initialize (msApi){
			$rootScope.$on('formLocator', function(event){
				event.targetScope.setupForm	&& (vm.setupForm = event.targetScope.setupForm);
				event.targetScope.buildingForm && (vm.buildingForm = event.targetScope.buildingForm);
			});

			// register test events
			vm.socket.on('dataAvailable', processData);
			vm.socket.on('statusUpdate', updateStatus);
			vm.socket.on('connect', function(data) { toastr.success('API Server connected!');});

			vm.socket.on('sendIP', function(data) {
				var serverApiBaseUrl = 'http://' + data.ip + ':3000/api';
				msApi.register('connectedFanList', [serverApiBaseUrl + '/devices/connected']);

				refreshAvailableFans();
			})

			vm.socket.on('new-fan', function(fan){
				toastr.info('"' + fan.name + '"' + ' has been added the the list of available fans.', 'New Fan Avaliable');
				refreshAvailableFans();
			});

			vm.socket.on('fan-removed', function(info){
				toastr.warning('"' + info.name + '"' + ' has been removed from the the list of available fans.', 'Fan Disconnected');
				refreshAvailableFans();
			});
		}

		function updateTestStandard () {
			var standardIndex = utils.indexOf(vm.settings.standards, 'name', vm.settings.testStandard);
			var standard = vm.settings.standards[standardIndex];

			vm.settings.startPressure 	= standard.start_pressure;
			vm.settings.stopPressure 	= standard.stop_pressure;
			vm.settings.numSteps 		= standard.num_steps;
			vm.settings.avgInterval 	= standard.averaging_interval;
			vm.settings.holdTime		= standard.hold_time;
			vm.settings.refPressure 	= standard.reference_pressure;
			vm.settings.baselineType	= standard.baseline_type;
		}

		function startTest () {
			if (vm.enabledFans.length < 1 || _.isEmpty(vm.primaryFan)) {
				toastr.error('You need to have at least one fan that is enabled and designated as \'Primary\'', 'Oops...');
			} else {
				// initialize empty data containers
				vm.sensorData 		= {};
				vm.sensorDataArrs 	= {pressure:[], flow:[], speed:[]};
				vm.chartData 		= [];
				vm.chart 			= {options: getChartOptions(), data:[{key:"Air Flow", values:vm.chartData}]};
				vm.dataTable.rows 	= [];	

				var settings = {
					"start_pressure": vm.settings.startPressure,
					"stop_pressure"	: vm.settings.stopPressure,
					"num_steps"		: vm.settings.numSteps,
					"hold_time"		: vm.settings.holdTime,
					"avg_interval"	: vm.settings.avgInterval,
					"ref_pressure"	: vm.settings.refPressure,
					"baseline_type"	: vm.settings.baselineType
				};

				fanApi.startTest(vm.primaryFan.name, settings);
				vm.testActive = true;
				vm.startTime = Date.now();
			}
		}

		function stopTest(sendApi) {
			if (vm.testActive) {
				fanApi.stopTest(vm.primaryFan.name);
				vm.testActive = false;
				vm.stopTime = Date.now();
			}

			// get results from server
			var resPackage = {
				"table": vm.resultsInputTable,
				"ref": JSON.stringify(vm.settings.refPressure),
				"envArea": vm.building.envelopeArea
			};

			calcs.getResults(resPackage).then(
				function(response) {
					$mdDialog.show(
						$mdDialog.alert()
					        .title('Test Results')
					        .textContent(response.results)
					        .ok('Nice')
				    );
				},
				function(response) {
					toastr.warning('Could not get test results.', 'Dang...');
				}
			);
		}

		function refreshAvailableFans () {
			fanApi.getConnectedFanList().then(loadFanList, function(response){vm.availableFans = []});
		}

		function updateEnabledFans (fan) {
			if(fan.enabled) {
				addFan(fan);

				// add as primary if designated as such
				if (fan.isPrimary) {
					if (_.isEmpty(vm.primaryFan)) {
						vm.primaryFan = fan;
					} else {
						toastr.warning('You can only have one fan designated as primary.');
						fan.isPrimary = false;
					}
				}
			} else {
				removeFan(fan);
				if (fan.isPrimary) {
					fan.isPrimary = false;
					removePrimaryFan();
				}
			}
		}

		function addFan (fan) {
			var fanIndex = utils.indexOf(vm.enabledFans, 'name', fan.name);
			if (fanIndex === -1) {
				vm.enabledFans.push(fan);
			}
		}

		function removeFan (fan) {
			var fanIndex = utils.indexOf(vm.enabledFans, 'name', fan.name);
			if (fanIndex !== -1) {
				vm.enabledFans.splice(fanIndex, 1);
			}
		}

		function loadFanList (response) {
			var fans = response.list;

			fans.forEach(function(fan) {
				var fanIndex = utils.indexOf(vm.availableFans, 'name', fan.name);
				if (fanIndex === -1) {
					fan.enabled = true;
					fanApi.registerFanEndpoints(fan.name);

					vm.availableFans.push(fan);
					vm.enabledFans.push(fan);

					// add as primary fan if one doesn't exist
					if (_.isEmpty(vm.primaryFan)) {
						fan.isPrimary = true;
						vm.primaryFan = fan;
					}
				}
			})
		}

		function removePrimaryFan () {
			delete vm.primaryFan;
			toastr.warning('Removing primary fan, please make sure one is designated prior to starting a test.', 'You better know what you\'re doing');
		}

		function processData(data){
			vm.sensorData = data;

			var seconds = Math.round((Date.now() - vm.startTime)/1000);
			vm.sensorDataArrs.pressure.push({"x": seconds, "y": vm.sensorData.envelopeDP});
			vm.sensorDataArrs.flow.push({"x": seconds, "y": vm.sensorData.airFlow});
			vm.sensorDataArrs.speed.push({"x": seconds, "y": vm.sensorData.fanSpeed});

			$rootScope.$apply();

			// add point to table if capture flag is true
			vm.sensorData.capture && updateTable(vm.sensorData);
		}

		function updateTable(point) {
			// add new point 
			var row = [
				{
					"value": vm.primaryFan.name,
					"classes": "text-boxed m-0 blue-grey-900-bg white-fg",
					"icon": ""
				},
				{
					"value": point.target,
					"classes": "text-bold",
					"icon": ""
				},
				{
					"value": point.envelopeDP,
					"classes": "",
					"icon": ""
				},
				{
					"value": point.airFlow,
					"classes": "",
					"icon": ""
				},
				{
					"value": point.fanSpeed,
					"classes": "",
					"icon": ""
				}

			];

			vm.dataTable.rows.push(row);
			vm.chartData.push({"x":point.envelopeDP, "y":point.airFlow});
		}

		function updateStatus(status) {
			if (vm.currentStatus !== status.message) {
				vm.currentStatus = status.message;
				toastr.info(status.message);

				if (!status.active && status.message !== 'Test completed. That was pretty fun huh?') {
					toastr.error('Something went wrong. Shutting down so things don\'t blow up', 'Yikes!');
				} else if(!status.active) {
					stopTest();
				}
			}
		}

		function getChartOptions() {
			return {
				"chart": {
					"type": "scatterChart",
					"height": 350,
					"margin": {
						top   : 20,
                        right : 20,
                        bottom: 40,
                        left  : 65
					},
					"useInteractiveGuideline": true,
					"dispatch": {},
					"xAxis": {
						"axisLabel": "Pressure (Pa)"
					},
					"yAxis": {
						"axisLabel": "Flow (CFM)",
                        "axisLabelDistance": -10
					}
				}
			}
		}
	}
})();