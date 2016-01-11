(function () {
    'use strict';

    angular
        .module('donna')
        .directive('uploadForm', uploadForm);

    /** @ngInject */
    function uploadFile() {
        function link(scope, element, attrs, ngModelCtrl) {
            $(function () {
                element.datepicker({
                    dateFormat: attrs.format || 'dd.mm.yy',
                    onSelect: function (date) {
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(date);
                        });
                    }
                });
            });
        }

        return {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        }
    }

})();