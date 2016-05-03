(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            'app.core',
            'app.navigation',
            'app.toolbar',
            'app.logger',
            'app.test-platform',

            // third party
            'angularUtils.directives.dirPagination',
            'nvd3'
        ]);
})();