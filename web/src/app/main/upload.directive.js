(function () {
    'use strict';

    angular
        .module('donna')
        .directive('fileToUpload', fileToUpload);

    /** @ngInject */
    function fileToUpload(News) {

        function link(scope, element, attrs) {
            element.bind("change", function (changeEvent) {
                //var file = changeEvent.target.files[0];
                //var reader = new FileReader();

                //console.log(element[0].querySelector('input').files[0]);


                //reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.model = changeEvent.target.files[0];
                    });
                //};
                //
                //reader.readAsDataURL(file);
            });
        }

        return {
            link: link,
            scope: {
                model: '=ngModel'
            },
            restrict: 'E',
            templateUrl: 'app/main/test.html'
        }
    }

})();
