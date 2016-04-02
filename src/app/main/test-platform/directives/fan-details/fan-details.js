(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.directive('fanDetails', fanDetails);

	function fanDetails() {
		return {
			restrict: 'E',
			templateUrl: '/app/main/test-platform/directives/fan-details/fan-details.html',
			scope: {
				fans:'=',
				refresh: '&',
				update: '&',
				edit: '&',
				devices: '=',
				primary: '&'
			},
			controller: function($scope, $mdDialog, utils){
				var devices = $scope.devices;
				var deletePrimary = $scope.primary;
				var updateFans = $scope.update();

				$scope.updateFans = function(fan){
					$scope.update()(fan);
				};

				$scope.editFanSettings = function(fan){
					$mdDialog.show({
			          templateUrl: '/app/main/test-platform/directives/fan-details/fan-edit-form.html',
			          controller: function($scope) {
							var deviceIndex = utils.indexOf(devices, 'model', fan.model);
							var device = devices[deviceIndex];

			          		$scope.fan = fan;
			          		$scope.devices = devices;

							$scope.updateRanges = function (device){
								$scope.ranges = device.ranges;
							}

							$scope.togglePrimary = function (fan){
								if (!fan.isPrimary) {
									deletePrimary();
								} else {
									updateFans(fan);
								}
							}

							$scope.updateRanges(device);
			          },
			          clickOutsideToClose: true
			        });
				}
			}
		};
	}
})();