angular.module('app')
  .controller('vendorController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;



      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"Name"}
                        ];
    ///////////////////////////////////////////////////////

       JWTTOKEN.requestFunction('GET','vendors?filter[where][deletedStatus]=false').then(function(vendorResult){
      console.log(vendorResult);
    	$scope.vendorData=vendorResult.data;

    });

    // /*////////////////////Function ///////////////////////*/
    // /*//////////////////////////////////////////*/
    // /*pop dialog on click*/
      $scope.addPopup=function()
      {
        console.log('addPopup click');
        $scope.vendor="";
        $scope.buttonText="Add";
        $scope.editRead=false;

        $mdDialog.show({
          contentElement: '#addDialogvendor',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addvendor=function(vendordata,invalid,button)
      {
        console.log(vendordata);
        if(button=="Add")
        {
           var ListArray=$scope.vendorData;
          if(invalid==false)
          {
            JWTTOKEN.requestFunction('POST','vendors',vendordata).then(function(res){
                  ListArray.push(res.data);
                 // $(".projectAddForm")[0].reset();
                 // $scope.vendor={};
                  //$scope.projectAddForm.$setPristine();
                  $mdDialog.hide();
              },function(err){
               
            })
          }
        }
        else
        {
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
              // vendorFactory
              // .updatevendor(data)
              // .then(function(response){
                JWTTOKEN.requestFunction('PUT','vendors/'+vendordata.id,vendordata).then(function(res){
                  //$(".projectEditForm")[0].reset();
                  $mdDialog.hide();
                },function(err){
                  console.log(err);  
                });
            }
          }      
        }
      }

      /*cancel function*/
      var cancelFun=function(fun,data)
      {
        console.log(fun);
        console.log(data);
        if(fun=='Save')
        {
          angular.copy($scope.original, $scope.vendor);       
        }
        else if(fun=="Add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.vendor="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }

    //   /*update pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        $scope.vendor=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#addDialogvendor'
              });//$mdDialog show
      }

    //   //////edit button//////////////////
      $scope.updatevendorclick=function(data,invalid,button)
      {
        console.log('updatevendorclick');
        /*if(button=="Edit")
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
            // vendorFactory
            // .updatevendor(data)
            // .then(function(response){
              JWTTOKEN.requestFunction('PUT','vendors/'+data.id,data).then(function(res){
                //$(".projectEditForm")[0].reset();
                $mdDialog.hide();
              },function(err){
                console.log(err);  
              });
          }
        }      */ 
      },

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
             // vendorFactory
             // .massDeletevendor(idArray);
             JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'vendor'});
               
                  // view update
                  var ListArray=$scope.vendorData;
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
              // vendorFactory
              //       .removevendor($scope.selecteddata[0])
              //       .then(function(response){
                JWTTOKEN.requestFunction('DELETE','vendors/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.vendorData;
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