(function() {
    'use strict';

    angular
        .module('donna')
        .controller('NewsController', NewsController);

    /** @ngInject */
    function NewsController(News, SweetAlert) {
        var vm = this;

        vm.news = [];
        
        News.getNews().success(function (data) {
            vm.news = data;
        }).error(function (err) {
            SweetAlert.swal(err.error, err.summary);
        });
    }

})();
