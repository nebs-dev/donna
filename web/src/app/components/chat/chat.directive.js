(function () {
    'use strict';

    angular
        .module('donna')
        .directive('onEnter', onEnter);

    /** @ngInject */
    function onEnter() {
        function link(scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {

                    scope.$apply(function () {
                        //scope.$eval(attrs.onEnter);
                        scope.onEnter();
                        if (scope.enterClean) scope.model = '';
                    });

                    event.preventDefault();
                }
            });
        }

        return {
            link: link,
            scope: {
                enterClean: '@',
                onEnter: '&',
                model: '=ngModel'
            }
        }
    }

})();
