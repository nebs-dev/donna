(function () {
    'use strict';

    angular
        .module('donna')
        .directive('photoGallery', photoGallery);


    function photoGallery() {
        function link(scope, element, attrs) {

            scope.$watch('photos', function (newVal, oldVal) {
                if (newVal) {
                    scope.gallery = newVal;
                }
            });
        }

        return {
            restrict: 'E',
            templateUrl: 'app/components/gallery/directive/gallery.html',
            scope: {
                photos: '=',
                delete: '&',
                fileComments: '&'
            },
            link: link
        }
    }

})();


(function () {
    'use strict';

    angular
        .module('donna')
        .directive('lg', lg);


    function lg() {
        function link(scope, element, attrs) {
            jQuery(function ($) {
                setTimeout(function () {
                    element.lightGallery({
                        selector: '.item'
                    });
                }, 1000);
            });
        }

        return {
            restrict: 'A',
            link: link
        }
    }

})();



