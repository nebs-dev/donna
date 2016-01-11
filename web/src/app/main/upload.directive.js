(function () {
    'use strict';

    angular
        .module('donna')
        .directive('uploadForm', uploadForm)
        .directive('uploadFile', uploadFile);


    function uploadForm($http) {
        function link(scope, element, attrs) {
            element.bind('submit', function (e) {
                var fd = new FormData();

                delete scope.model.file;
                angular.forEach(scope.model, function (modelValue, modelKey) {
                    if (typeof(modelValue) !== 'object') return fd.append(modelKey, modelValue);

                    angular.forEach(modelValue, function (instanceValue, instanceKey) {
                        fd.append(modelKey, instanceValue);
                    });
                });

                scope.model.$http = function (url, options) {
                    if(!url) throw(new Error("You must pass url to directive $http"));

                    var defaults = {
                        url: url,
                        method: 'POST',
                        data: fd,
                        headers: {'Content-Type': undefined}
                    };

                    options = angular.extend({}, defaults, options);

                    return $http(options);
                }
            });
        }

        return {
            link: link,
            restrict: 'A',
            scope: {
                model: '=uploadForm'
            }
        }
    }

    /** @ngInject */
    function uploadFile() {
        function link(scope, element, attrs) {
            element.bind('change', function (e) {
                scope.$apply(function () {
                    scope.model = e.target.files;
                })
            });
        }

        return {
            link: link,
            restrict: 'A',
            scope: {
                model: '=ngModel'
            }
        }
    }

})();
