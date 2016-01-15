(function () {
    'use strict';

    angular
        .module('donna')
        .directive('datepicker', datepicker);

    /** @ngInject */
    function datepicker() {
        function link(scope, element, attrs, ngModelCtrl) {
            $(function () {

                element.datetimepicker({
                    format: "YYYY-MM-DD HH:mm Z",
                    sideBySide: true
                });

                element.on("dp.change", function (e) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(e.date.toISOString());
                    })
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