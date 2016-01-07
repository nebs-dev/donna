(function () {
    'use strict';

    angular
        .module('donna')
        .constant('API', {
            //URL: 'http://localhost:1337',
            URL: 'http://52.16.220.86:667',

            formData: function (data) {
                var formData = new FormData();
                for ( var key in data ) {
                    formData.append(key, data[key]);
                }

                return formData;
            }
        })

        .constant('AccessLevels', {
            anon: 0,
            user: 1
        });

        //.constant('_', window._);
})();