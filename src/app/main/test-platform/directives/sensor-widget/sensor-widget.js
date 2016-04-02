(function(){
	'use strict';

	angular
		.module('app.test-platform')
		.directive('sensorWidget', sensorWidget)
		.controller('chartController', chartController);

	function sensorWidget (){
		return {
			restrict: 'E',
			templateUrl: '/app/main/test-platform/directives/sensor-widget/sensor-widget.html',
			scope: {
				title: '@',
				value: '=',
				units: '@',
				data: '='
			},
			controller: 'chartController as vm'
		};
	}

	function chartController ($scope) {
		var vm = this;

		vm.chart = {
            config : {
                refreshDataOnly: true,
                deepWatchData: true
            },
            options: {
                chart: {
                    type: 'lineChart',
                    color: ['rgba(0, 0, 0, 0.25)'],
                    height: 60,
                    margin: {
                        top   : 8,
                        right : 0,
                        bottom: 0,
                        left  : 0
                    },
                    transitionDuration: 0,
                    interactive: false,
                    isArea: true,
                    showLegend: false,
                    showControls: false,
                    showXAxis: false,
                    showYAxis: false,
                    x: function (d){return d.x;},
                    y: function (d){return d.y;}
                }
            },
            data: [{key:"Series", values:$scope.data}]
        }
	}
})();