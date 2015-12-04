(function () {
    'use strict';

    angular
        .module('donna')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        $httpProvider.interceptors.push('AuthInterceptor');
    }

})();
