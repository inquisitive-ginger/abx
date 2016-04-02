(function(){
	'use strict';

	angular
		.module('app.test-platform', [])
		.config(config);

	function config($stateProvider, msApiProvider, msNavigationServiceProvider) {
		// state information
		$stateProvider
			.state('app.test-platform', {
				url		: '/test-platform',
				views	: {
					'content@app' : {
						'templateUrl'	: '/app/main/test-platform/test-platform.html',
						'controller'	: 'TestPlatformController as vm'
					}
				},
				resolve	: {
					TestPlatformData: function (msApi) {
						return msApi.resolve('test-platform@get');
					}
				}
			});

		// api registration
		msApiProvider.register('test-platform', ['/app/data/test-platform/data.json']);

		// navigation menu association
		msNavigationServiceProvider.saveItem('test-platform', {
            title    : 'Test',
            icon     : 'icon-chart-line',
            state    : 'app.test-platform',
            weight   : 1
        });
	}
})();