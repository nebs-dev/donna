(function () {
    'use strict';

    angular
        .module('donna')
        .controller('NewsController', NewsController);

    /** @ngInject */
    function NewsController(News, SweetAlert, $state) {
        var vm = this;
        var stateMethod = $state.current.method;

        // List
        if (stateMethod == 'list') {
            vm.news = [];

            News.getNewsList().success(function (data) {
                vm.news = data;
                News.data = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        // Update
        if (stateMethod == 'update') {
            News.getOne($state.params.id).success(function (data) {
                vm.news = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        // Create
        if (stateMethod == 'create') {
            vm.news = {};
        }


        vm.save = function () {
            var action = (stateMethod == 'update') ? News.update($state.params.id, vm.news) : News.create(vm.news);

            action.success(function (news) {
                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully saved',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

                $state.go('user.news');

            }).error(function (err) {
                console.log(err);
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };

        vm.destroy = function (id) {
            News.destroyNews(id).success(function () {
                vm.news = _.reject(vm.news, function (news) {
                    return id == news.id;
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };
    }


})();
