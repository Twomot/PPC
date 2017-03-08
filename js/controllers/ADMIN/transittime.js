angular.module('app')
  .controller('transittimeController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;



      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"From"},
                          {"title":"To"},
                          {"title":"Mode"},
                          {"title":"Time(Days)"}
                        ];
    ///////////////////////////////////////////////////////
    // transittimeFactory.getaltransittime().then(function(transittimeResult){
      JWTTOKEN.requestFunction('GET','transittimes?filter[include]=fromlocationRelation&filter[include]=tolocationRelation&filter[where][deletedStatus]=false').then(function(transittimeResult){
      console.log(transittimeResult);
    	$scope.transittimeData=transittimeResult.data;
    });

    //////////////location fetch//////////
    // locationFactory.getallocation().then(function(locationResult){
      JWTTOKEN.requestFunction('GET','Locations').then(function(locationResult){
      $scope.locations=locationResult.data;
    });


    // /*////////////////////Function ///////////////////////*/
    // /*//////////////////////////////////////////*/
    // /*pop dialog on click*/
      $scope.addPopup=function()
      {
        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialogtransittime',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addtransittime=function(transittimedata,invalid)
      {
        console.log(transittimedata);
         var ListArray=$scope.transittimeData;
        if(invalid==false)
        {
         // transittimeFactory
         //    .addtransittime(transittimedata)
         //    .then(function(res){
           JWTTOKEN.requestFunction('POST','transittimes',transittimedata).then(function(res){

            var newItemID=res.data.id;
            JWTTOKEN.requestFunction('GET','transittimes?filter[where][id]='+newItemID+'&filter[include]=fromlocationRelation&filter[include]=tolocationRelation').then(function(transittimeResult){
               
                ListArray.push(transittimeResult.data[0]);
                // ListArray.push(res.data);
                //$(".projectAddForm")[0].reset();
                $scope.transittime={};
                $scope.projectAddForm.$setPristine();
                $mdDialog.hide();

              });
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
          angular.copy($scope.original, $scope.transittimeEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.transittime="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }
       ////dropdown///
      $scope.modes = [
          "Air",
          "Cargo"
          
      ];

    //   /*update pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        $scope.transittimeEdit=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.dateDisable=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialogtransittime'
              });//$mdDialog show
      }

    //   //////edit button//////////////////
      $scope.updatetransittimeclick=function(data,invalid,button)
      {
        console.log('updatetransittimeclick');
        if(button=="Edit")
        {
          $scope.buttonText='Save';
          $scope.editRead=false;
          $scope.dateDisable=false;
          $scope.selectdisabled=false;

        }
        else
        {
          console.log('update');
          if(invalid==false)
          {
            // transittimeFactory
            // .updatetransittime(data)
            // .then(function(response){
              JWTTOKEN.requestFunction('PUT','transittimes/'+data.id,data).then(function(res){
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
             // transittimeFactory
             // .massDeletetransittime(idArray);
             JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'transittime'});
             console.log(idArray);
                    // var idArray=$scope.selecteddata[i].id;
                  // view update
                  var ListArray=$scope.transittimeData;
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
              // transittimeFactory
              //       .removetransittime($scope.selecteddata[0])
              //       .then(function(response){
                JWTTOKEN.requestFunction('DELETE','transittimes/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.transittimeData;
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