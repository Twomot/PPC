angular.module('app')
  .controller('locationController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', 'commonFactory', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN, commonFactory) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;

	$scope.editEnabled = commonFactory.isEditAllowed();

      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"Name"}
                        ];
    ///////////////////////////////////////////////////////
    // locationFactory.getallocation().then(function(locationResult){
       JWTTOKEN.requestFunction('GET','Locations?filter[where][deletedStatus]=false').then(function(locationResult){
      console.log(locationResult);
    	$scope.locationData=locationResult.data;
    });

    /*////////////////////Function ///////////////////////*/
    /*//////////////////////////////////////////*/
    /*pop dialog on click*/
      $scope.addPopup=function()
      {
        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialoglocation',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addlocation=function(locationdata,invalid)
      {
        console.log(locationdata);
         var ListArray=$scope.locationData;
        if(invalid==false)
        {
          // locationFactory
          //   .addlocation(locationdata)
          //   .then(function(res){
            JWTTOKEN.requestFunction('POST','Locations',locationdata).then(function(res){
                ListArray.push(res.data);
                //$(".projectAddForm")[0].reset();
                $scope.location={};
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
          angular.copy($scope.original, $scope.locationEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.location="";
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

        $scope.locationEdit=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialoglocation'
              });//$mdDialog show
      }

      //////edit button//////////////////
      $scope.updatelocationclick=function(data,invalid,button)
      {
        console.log('updatelocationclick');
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
            // locationFactory
            // .updatelocation(data)
            // .then(function(response){
               JWTTOKEN.requestFunction('PUT','Locations/'+data.id,data).then(function(res){
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
             // locationFactory
             JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'location'});
             // .massDeletelocation(idArray);
                    // var idArray=$scope.selecteddata[i].id;
                  // view update
                  var ListArray=$scope.locationData;
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
              // locationFactory
              //       .removelocation($scope.selecteddata[0])
              //       .then(function(response){
                JWTTOKEN.requestFunction('DELETE','Locations/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.locationData;
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