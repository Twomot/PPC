angular.module('app')
  .controller('plantController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', 'commonFactory', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN, commonFactory) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;

	$scope.editEnabled = commonFactory.isEditAllowed();
	
     JWTTOKEN.requestFunction('GET','appusers?filter[where][roleID][regexp]=/^planner/i').then(function(userResult){
	      console.log(userResult);
	    	$scope.planners=userResult.data;
	    });

      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"Name"},
                          {"title":"Planner"}
                        ];
    ///////////////////////////////////////////////////////
    // plantFactory.getalplant().then(function(plantResult){
       JWTTOKEN.requestFunction('GET','plants?filter[include]=UserPlant').then(function(plantResult){
      console.log(plantResult);
    	$scope.plantData=plantResult.data;
    });

    /*////////////////////Function ///////////////////////*/
    /*//////////////////////////////////////////*/
    /*pop dialog on click*/
      $scope.addPopup=function()
      {
      		

        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialogplant',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addplant=function(plantdata,invalid)
      {
        console.log(plantdata);
         var ListArray=$scope.plantData;
         plantdata.id=plantdata.name;
         
         
         
        if(invalid==false)
        {
        	//>>>>>> Added by Ramesh
        	if (plantdata.plannerID) {
	        	var plannerArray = []
	            plantdata.plannerID.forEach(function(plannerID) {
	           	 plannerArray.push({plannerID: plannerID});
	            });
	            plantdata.plannerID = plannerArray;
        	}
        	//<<<<<<
        	
          // plantFactory
          //   .addplant(plantdata)
          //   .then(function(res){
            JWTTOKEN.requestFunction('POST','plants',plantdata).then(function(res){
                ListArray.push(res.data);
                //$(".projectAddForm")[0].reset();
                $scope.plant={};
                //$scope.projectAddForm.$setPristine();
                $mdDialog.hide();
            },function(err){
             
          })
        }
      }

      /*cancel function*/
      var cancelFun=function(fun,data)
      {
        console.log(fun);
        console.log(data);
        if(fun=='edit')
        {
          angular.copy($scope.original, $scope.plantEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.plant="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }

      /*update pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        $scope.plantEdit=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        //>>>>>> Added by Ramesh
        if ($scope.plantEdit.plannerID) {
        	var plannerArray = []
        	$scope.plantEdit.plannerID.forEach(function(plannerID) {
           	 plannerArray.push(plannerID.plannerID);
            });
        	$scope.plantEdit.plannerID = plannerArray;
    	}
        //<<<<<<
        
        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialogplant'
              });//$mdDialog show
      }

      //////edit button//////////////////
      $scope.updateplantclick=function(data,invalid,button)
      {
        console.log('updateplantclick');
        if(button=="Edit")
        {
          $scope.buttonText='Save';
          $scope.editRead=false;
          $scope.selectdisabled=false;
        }
        else
        {
          console.log('update');
          if(invalid==false)
          {
        	  //>>>>>> Added by Ramesh
        	  if (data.plannerID) {
	        	  var plannerArray = []
	              data.plannerID.forEach(function(plannerID) {
	             	 plannerArray.push({plannerID: plannerID});
	              });
	              data.plannerID = plannerArray;
        	  }
        	  //<<<<<<
              
            // plantFactory
            // .updateplant(data)
            // .then(function(response){
               JWTTOKEN.requestFunction('PUT','plants/'+data.id,data).then(function(res){
                //$(".projectEditForm")[0].reset();
                $mdDialog.hide();
              },function(err){
                console.log(err);  
              });
          }
        }       
      }

      $scope.massDelete=function(ev)
      {
        if(massDelete==true)
        {
          console.log('deletePop');
          console.log($scope.selecteddata);
          var title='Are you sure to delete these selected item?';
          var text='';
           dialogFactory.confirmAlert(ev,title,text,function(status){
            if(status=="OK"){
              var idArray=[];
              for(var i=0;i<$scope.selecteddata.length;i++)
              {
                  idArray.push($scope.selecteddata[i].id)
              }
             // plantFactory
             JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'plant'});
             // .massDeleteplant(idArray);
                    // var idArray=$scope.selecteddata[i].id;
                  // view update
                  var ListArray=$scope.plantData;
                  for(var i=0;i<$scope.selecteddata.length;i++)
                  {
                    var idx = ListArray.indexOf($scope.selecteddata[i]);
                    ListArray.splice(idx,1);
                  }
                   massDelete=false;
                  // view update

            }
            else{
              console.log('Canceled');
            }
         });
        }
        else
        {
          console.log('pls');
          dialogFactory.alert(ev,'Please Select any of them to delete','');
        }
        
      }

      $scope.toggleFun=function()
      {
        console.log('toggleFun');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata.length);
        if($scope.selecteddata.length!=0)
        {
          massDelete=true;
        }
        else
        {
          massDelete=false;
        }

        
      }

      $scope.deleteFunction=function(ev)
      {
        console.log('deletelist');
        console.log($scope.selecteddata);
         console.log($scope.selecteddata[0]);
         var title='Are you sure to delete this item?';
         var text='';
         dialogFactory.confirmAlert(ev,title,text,function(status){
            if(status=="OK"){
              // plantFactory
              //       .removeplant($scope.selecteddata[0])
              //       .then(function(response){
                JWTTOKEN.requestFunction('DELETE','plants/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.plantData;
                                var index = ListArray.indexOf($scope.selecteddata[0]);
                                ListArray.splice(index, 1);

                    })
            }
            else{
              console.log('Canceled');
            }
         });
          
      }

      
     
     
      

      

}]);