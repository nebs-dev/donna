(function () {
    'use strict';

    angular
        .module('donna')
        .controller('NewsController', NewsController);

    /** @ngInject */
    function NewsController(News, SweetAlert, $state) {
        var vm = this;

        //console.log($state);

        // LIST
        if ($state.current.method == 'list') {
            vm.news = [];

            News.getNewsList().success(function (data) {
                vm.news = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary);
            });
        }

        if ($state.current.method == 'edit') {
            vm.news = [];

            News.getOne($state.params.id).success(function (data) {
                vm.news = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary);
            });

            vm.update = function () {
                console.log('Requst:', vm.news);
                News.update($state.params.id, vm.news).success(function (news) {
                    console.log('Response:', news);

                }).error(function (err) {
                    console.log(err);
                    SweetAlert.swal(err.error, err.summary);
                });
            };
        }

        vm.destroy = function (id) {
            News.destroyNews(id).success(function () {
                vm.news = _.reject(vm.news, function (news) {
                    return id == news.id;
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary);
            });
        };
    }


})();
