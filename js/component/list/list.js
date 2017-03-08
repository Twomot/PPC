angular.module('app')
  .controller('listController', ['$scope', '$state','$mdDialog', function($scope,
      $state,$mdDialog) {

                $scope.selected = [];
                /*$scope.togglelist=function(item, list) {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                      list.splice(idx, 1);
                    }
                    else {
                      list.push(item);
                    }
                    console.log(list);
                }*/

  }])
  .controller('adminlistController', ['$scope', '$state','$mdDialog', function($scope,
      $state,$mdDialog) {
  	$scope.cancel=function()
  	{
  		$mdDialog.hide();
  		$(".projectForm")[0].reset();
  	}
  }]);