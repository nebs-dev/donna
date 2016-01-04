angular.module('donnaFilters', [])

    .filter('trustUrl', ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl + 'mp4');
        };
    }]);