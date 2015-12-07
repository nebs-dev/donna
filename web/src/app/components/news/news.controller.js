(function() {
    'use strict';

    angular
        .module('donna')
        .controller('NewsController', NewsController);

    /** @ngInject */
    function NewsController(News, SweetAlert) {
        var vm = this;

        vm.news = [];
        
        News.getNewsList().success(function (data) {
            vm.news = data;
        }).error(function (err) {
            SweetAlert.swal(err.error, err.summary);
        });

        vm.destroy = function (id) {
            News.destroyNews(id).success(function () {
                vm.news = _.reject(vm.news, function (news) {
                    return id == news.id;
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary);
            });
        }
    }

})();
