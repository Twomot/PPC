angular.module('app')
  .controller('UoMListController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', 'commonFactory', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN, commonFactory) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;

	$scope.editEnabled = commonFactory.isEditAllowed();

      ////////////////////headingList for table content/////////////////////////
    $scope.headingArray=[
                          {"title":"Unit"}
                        ];
    ///////////////////////////////////////////////////////
    // UoMFactory.getallUoM().then(function(UoMResult){
        JWTTOKEN.requestFunction('GET','UoMs?filter[where][deletedStatus]=false').then(function(UoMResult){
      console.log(UoMResult);
    	$scope.UoMdata=UoMResult.data;
    });

    /*////////////////////Function ///////////////////////*/
    /*//////////////////////////////////////////*/
    /*pop dialog on click*/
      $scope.addPopup=function()
      {
        console.log('addPopup click');
        $scope.UoM="";
        $scope.buttonText="Add";
        $scope.editRead=false;
        $mdDialog.show({
          contentElement: '#addDialogUoM',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addUoM=function(UoMdata,invalid,button)
      {
        console.log(UoMdata);
        if(button=="Add")
        {

            var ListArray=$scope.UoMdata;
            if(invalid==false)
            {
                    JWTTOKEN.requestFunction('POST','UoMs',UoMdata).then(function(res){
                    ListArray.push(res.data);
                    //$scope.UoM={};
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
                  JWTTOKEN.requestFunction('PUT','UoMs/'+UoMdata.id,UoMdata).then(function(res){
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
         // angular.copy($scope.original, $scope.UoMEdit);     
          angular.copy($scope.original, $scope.UoM);      
        }
        else if(fun=="Add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.UoM="";
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

        // $scope.UoMEdit=$scope.selecteddata[0];
        $scope.UoM=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#addDialogUoM'
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
                  idArray.push($scope.selecteddata[i].id);
              }
              console.log(idArray);
            
             JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'UoM'});
                  
                  // view update
                  var ListArray=$scope.UoMdata;
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

      $scope.deleteFunction=function(ev)
      {
        console.log('deletelist');
        console.log($scope.selecteddata);
         console.log($scope.selecteddata[0]);
         var title='Are you sure to delete this item?';
         var text='';
         dialogFactory.confirmAlert(ev,title,text,function(status){
            if(status=="OK"){
                JWTTOKEN.requestFunction('DELETE','UoMs/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.UoMdata;
                                var index = ListArray.indexOf($scope.selecteddata[0]);
                                ListArray.splice(index, 1);

                    })
            }
            else{
              console.log('Canceled');
            }
         });
          
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



      /*///////////////////////pagination/////////////////////////////////////////*/
        $scope.currentPage = 0;

        $scope.paging = {
            total: 100,
            current: 1,
            onPageChanged: loadPages,
        };

        function loadPages() {
            console.log('Current page is : ' + $scope.paging.current);

            // TODO : Load current page Data here

            $scope.currentPage = $scope.paging.current;
        }
      /*/////////////////////////////////////////////////////////*/

}]);