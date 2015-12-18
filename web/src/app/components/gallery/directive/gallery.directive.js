(function () {
    'use strict';

    angular
        .module('donna')
        .directive('photoGallery', photoGallery);


    function photoGallery() {
        function link(scope, element, attrs) {
            jQuery(function ($) {
                $( '.swipebox' ).swipebox();
            });

            scope.$watch('photos', function (newVal, oldVal) {
                if (newVal) {
                    scope.gallery = newVal;
                    scope.delete = scope.$parent.galleryCtrl.destroyFile;
                    //console.log(scope.delete);
                }
            });
        }

        return {
            link: link,
            restrict: 'E',
            templateUrl: 'app/components/gallery/directive/gallery.html',
            transclude: true,
            scope: {
                model: '=photoGallery',
                photos: '='
            }
        }
    }
})();
