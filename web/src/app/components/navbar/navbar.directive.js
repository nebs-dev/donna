(function() {
  'use strict';

  angular
    .module('donna')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: 'NavbarController',
      controllerAs: 'navbarCtrl',
      bindToController: true
    };

    return directive;
  }

})();
