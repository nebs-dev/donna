(function () {
    'use strict';

    angular
        .module('donna')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $rootScope) {
        $log.debug('runBlock end');
    }

})();
