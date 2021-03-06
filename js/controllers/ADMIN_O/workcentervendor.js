angular.module('app')
  .controller('workcentervendorController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN','myService', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN,myService) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;


//Invoking factory method to get Locations
var locationObj = myService.getLocation();
locationObj.Locations.then(function(promiseData){
  $scope.locations = promiseData.data; 
})


      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"Work Center","modelname":"workcentervendor"},
                          
                          
                          {"title":"vendorID"},
                          {"title":"Location"},
                          {"title":"Type"}
                          
                        ];
    ///////////////////////////////////////////////////////
    // workcentervendorFactory.getalworkcentervendor().then(function(workcentervendorResult){
       JWTTOKEN.requestFunction('GET','workcentervendors?filter[include]=locationRelation&filter[include]=workCenterRelation&filter[include]=vendorRelation&filter[where][deletedStatus]=false').then(function(workcentervendorResult){
      console.log(workcentervendorResult);
    	$scope.workcentervendorData=workcentervendorResult.data;
    });

     /*location fetch*/
    // workcenterFactory.getalworkcenter().then(function(workcenterResult){
      JWTTOKEN.requestFunction('GET','workcenters').then(function(workcenterResult){
      $scope.workcenters=workcenterResult.data;
    });
     
     /*location fetch*/
    // vendorFactory.getalvendor().then(function(vendorResult){
     /* JWTTOKEN.requestFunction('GET','vendors').then(function(vendorResult){
      $scope.vendors=vendorResult.data;
    });*/
    JWTTOKEN.requestFunction('GET','vendors').then(function(vendorResult){
      $scope.vendors=vendorResult.data;
    });

    JWTTOKEN.requestFunction('GET','plants').then(function(plantResult){
      $scope.plants=plantResult.data;
    });

///user fetch
JWTTOKEN.requestFunction('GET','appusers').then(function(userResult){
      $scope.users=userResult.data;
    });


    // /*////////////////////Function ///////////////////////*/
    // /*//////////////////////////////////////////*/
    // /*pop dialog on click*/
      $scope.addPopup=function()
      {
        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialogworkcentervendor',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addworkcentervendor=function(workcentervendor,invalid)
      {
        console.log(workcentervendor);
         var ListArray=$scope.workcentervendorData;
         //workcentervendor.vendorID=workcentervendor.vendorID.id;
        var vendorName =workcentervendor.vendorID.name;
          var locationName =workcentervendor.locationID.name;
          var workcenterName =workcentervendor.workcenterID.name;

         workcentervendor.vendorID=workcentervendor.vendorID.id;
         workcentervendor.locationID=workcentervendor.locationID.id;
         workcentervendor.workcenterID=workcentervendor.workcenterID.id;

         var displayName=vendorName+"_"+locationName+"_"+workcenterName;
         workcentervendor.displayName=displayName;



        if(invalid==false)
        {
           JWTTOKEN.requestFunction('POST','workcentervendors',workcentervendor).then(function(res){
            /*console.log(res);
             console.log(res);
            */
 var newItemID=res.data.id;
           JWTTOKEN.requestFunction('GET','workcentervendors?filter[where][id]='+newItemID+'&filter[include]=locationRelation&filter[include]=workCenterRelation&filter[include]=vendorRelation').then(function(workcentervendorResult){
               
               console.log(workcentervendorResult) 
                 ListArray.push(workcentervendorResult.data[0]);
                $scope.workcentervendor={};
                $mdDialog.hide();
             }
             );
                //ListArray.push(res.data);

               //$mdDialog.hide();
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
          angular.copy($scope.original, $scope.workcentervendorEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.workcentervendor="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }

     
        //////////location change///////////
        $scope.locationChange=function(locationID)
          {
            console.log(locationID);
            // vendorFactory.getVendoronLocation(locationID).then(function(vendorResult){

               JWTTOKEN.requestFunction('GET','vendors?filter[where][locationID]='+locationID).then(function(vendorResult){

              console.log(vendorResult);
              $scope.vendors=vendorResult.data;
            });
          }

        ////////////////////////////////
        /*$scope.vendorChange=function(vendorData)
        {
          console.log(vendorData);
          console.log(vendorData.plantRelation);
          //$scope.locations=vendorData.locationID;
          $scope.plants=vendorData.plantRelation;
          
        }*/


    //   /*update pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        $scope.workcentervendorEdit=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.selectdisabled=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialogworkcentervendor'
              });//$mdDialog show
      }

    //   //////edit button//////////////////
      $scope.updateworkcentervendorclick=function(data,invalid,button)
      {
        console.log('updateworkcentervendorclick');
        if(button=="Edit")
        {
          $scope.buttonText='Save';
          $scope.selectdisabled=false;
          $scope.editRead=false;
           $scope.selectdisabled=false;
        }
        else
        {
          console.log('update');
          if(invalid==false)
          {
            // workcentervendorFactory
            // .updateworkcentervendor(data)
            // .then(function(response){
              if(data.schedulerID !=undefined)
              {
                data.schedulerID=[{"schedulerID":data.schedulerID}]
              }
              else
              {
                data.QCSchedulerID=[{"QCSchedulerID":data.QCSchedulerID}]
              }
              
              JWTTOKEN.requestFunction('PUT','workcentervendors/'+data.id,data).then(function(res){
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
             // workcentervendorFactory
             // .massDeleteworkcentervendor(idArray);
              JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'workcentervendor'});
                    // var idArray=$scope.selecteddata[i].id;
                  // view update
                  var ListArray=$scope.workcentervendorData;
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
              // workcentervendorFactory
              //       .removeworkcentervendor($scope.selecteddata[0])
              //       .then(function(response){
                 JWTTOKEN.requestFunction('DELETE','workcentervendors/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.workcentervendorData;
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