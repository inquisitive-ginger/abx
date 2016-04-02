(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config(toastr)
    {
        toastr.options.timeOut = 5000;
        toastr.options.positionClass = 'toast-bottom-left';
    }

})();