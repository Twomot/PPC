angular.module('app')
  .controller('dailogController', ['$scope', '$state','$mdDialog', function($scope,
      $state,$mdDialog) {
        console.log('dailogController');
            $scope.button3click=function()
            {
              console.log('clickkkk');
              $mdDialog.hide();
            }

            $scope.addclick=function(data)
            {
            	console.log(data);
            }
            console.log();
  }]);