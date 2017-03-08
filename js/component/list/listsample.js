angular.module('app')
  .controller('listController', ['$scope', '$state','$mdDialog', function($scope,
      $state,$mdDialog) {
  	
        $scope.listclick=function(updatedata)
        {
        	console.log('listdata');
        	console.log(updatedata);
        }
  }])
  .controller('adminlistController', ['$scope', '$state','$mdDialog', function($scope,
      $state,$mdDialog) {
  	$scope.addevent=function()
  	{
  		console.log('addd');
  		$mdDialog.show({
        contentElement: '#myStaticDialog',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });
  	}
  	$scope.cancel=function()
  	{
  		$mdDialog.hide();
  		$(".projectForm")[0].reset();
  	}
	console.log($scope.data);
  	$scope.updateevent=function(list)
  	{
  		console.log(list);
  		console.log('update');
  		console.log($scope.data);
  		$mdDialog.show({
        contentElement: '#updateDialog',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });
  	}


     $scope.listclick=function(updatedata)
        {
          console.log('listdata');
          $scope.updatedata=updatedata;
          console.log(updatedata);
          $mdDialog.show({
            //contentElement: '#updateDialog',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals:{details: updatedata},
            scope:$scope,
            preserveScope: true,
            controller: ['$scope', 'details','$mdDialog', function($scope, details,$mdDialog) { 
                              console.log('details');
                                $scope.updatedatalist=details;
            }],
            template:
            '<updatedialog-component header="Update" button1="Update" button1click="$ctrl.update()" button2="Cancel" button2click="cancel()" input="$ctrl.inputdata" modelname="$ctrl.mymodel" updatedata="updatedatalist"></updatedialog-component>'
          });
        }
        
  }]);