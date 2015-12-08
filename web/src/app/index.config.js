(function () {
    'use strict';

    angular
        .module('donna')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push('AuthInterceptor');
    }

})();
