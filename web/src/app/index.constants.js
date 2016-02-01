(function () {
    'use strict';

    angular
        .module('donna')
        .constant('API', {
            //URL: 'http://localhost:1337',
            //URL: 'http://52.31.77.24:667',
            URL: 'http://donnavekicapp.com:666',

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