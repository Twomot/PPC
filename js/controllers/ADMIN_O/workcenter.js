angular.module('app')
  .controller('workcenterController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', function($location,$filter,$scope,
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
    // workcenterFactory.getalworkcenter().then(function(workcenterResult){
      JWTTOKEN.requestFunction('GET','workcenters?filter[where][deletedStatus]=false').then(function(workcenterResult){
      console.log(workcenterResult);
    	$scope.workcenterdata=workcenterResult.data;
    });

    /*////////////////////Function ///////////////////////*/
    /*//////////////////////////////////////////*/
    /*pop dialog on click*/
      $scope.addPopup=function()
      {
        console.log('addPopup click');
        $scope.editRead=false;
        $scope.workcenter="";
        $scope.buttonText="Add";

        $mdDialog.show({
          contentElement: '#addDialogworkcenter',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addworkcenter=function(workcenter,invalid,button)
      {
        console.log(workcenter);
        if(button=="Add")
        {
            var ListArray=$scope.workcenterdata;
            if(invalid==false)
            {
                JWTTOKEN.requestFunction('POST','workcenters',workcenter).then(function(res){
                    ListArray.push(res.data);
                    //$(".projectAddForm")[0].reset();
                   //$scope.workcenter={};
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
          }
          else
          {
            console.log('update');
            if(invalid==false)
            {
                 JWTTOKEN.requestFunction('PUT','workcenters/'+workcenter.id,workcenter).then(function(res){
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
          angular.copy($scope.original, $scope.workcenter);       
        }
        else if(fun=="Add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.workcenter="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }
      /*updaet pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        // $scope.workcenterEdit=$scope.selecteddata[0];
        $scope.workcenter=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#addDialogworkcenter'
              });//$mdDialog show
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
              console.log(idArray);
             // workcenterFactory
             // .massDeleteworkcenter(idArray);
             JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'workcenter'});
                    // var idArray=$scope.selecteddata[i].id;
                  // view update
                  var ListArray=$scope.workcenterdata;
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
              // workcenterFactory
              //       .removeworkcenter($scope.selecteddata[0])
              //       .then(function(response){
                      JWTTOKEN.requestFunction('DELETE','workcenters/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.workcenterdata;
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