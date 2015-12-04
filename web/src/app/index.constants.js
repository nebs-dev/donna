/* global malarkey:false, moment:false */
(function () {
    'use strict';

    angular
        .module('donna')
        .constant('API', {
            //URL: 'http://localhost:1337'
            URL: 'http://52.16.220.86:667'
        })

        .constant('AccessLevels', {
            anon: 0,
            user: 1
        })
})();