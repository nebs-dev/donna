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
                    //console.log(scope);
                    //scope.delete = scope.$parent.galleryCtrl.destroyFile;
                }
            });
        }

        return {
            restrict: 'E',
            templateUrl: 'app/components/gallery/directive/gallery.html',
            scope: {
                photos: '=',
                delete: '&'
            },
            link: link
        }
    }

})();
