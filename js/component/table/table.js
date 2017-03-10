angular.module('app')
  .controller('tableController', ['$scope', '$state','$mdDialog', function($scope,
      $state,$mdDialog) {

                $scope.selected = [];
                
     	$scope.deletionAllowed = (sessionStorage.role == 'root');

  }]);