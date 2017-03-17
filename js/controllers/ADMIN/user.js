angular.module('app')
  .controller('appuserController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN) {
    console.log('appuserList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;



      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"Name", "model": "employee"},
                          {"title":"Email "},
                          {"title":"Role"}
                        ];
    ///////////////////////////////////////////////////////
    // appuserFactory.getalappuser().then(function(appuserResult){
      JWTTOKEN.requestFunction('GET','appusers?filter[where][deletedStatus]=false').then(function(appuserResult){
      console.log(appuserResult);
    	$scope.appuserdata=appuserResult.data;
    });

      /*JWTTOKEN.requestFunction('GET','appusers').then(function(appuserResult){
      console.log(appuserResult);
      $scope.superiors=appuserResult.data;
    });*/

userFetchFunction=function()
{
  ////////////////user Fetch/////////////////////////
            JWTTOKEN.requestFunction('GET','appusers').then(function(usersResult){
              console.log(usersResult);
              $scope.users=usersResult.data;
            });
          ////////////////////////////////////////
}


    /*////////////////////Function ///////////////////////*/
    /*//////////////////////////////////////////*/
    /*pop dialog on click*/
      $scope.addPopup=function()
      {

          userFetchFunction();
         // $scope.isChecked = true;
        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialogappuser',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/

       ////////////////Role Fetch/////////////////////////
            JWTTOKEN.requestFunction('GET','Roles').then(function(rolesResult){
              console.log(rolesResult);
              $scope.roles=rolesResult.data;
            });
          ////////////////////////////////////////
         

      $scope.addappuser=function(appuserdata,invalid)
      {

        console.log(appuserdata);

        // console.log(invalid);
        var ListArray=$scope.appuserdata;
        var roleIDArray=[];
        var roleNameArray=[];
        if(invalid==false)
        {
        	console.log($scope.tempRole);
          for(var i=0;i<$scope.tempRole.length;i++)
          {
            console.log($scope.tempRole[i]);
            roleIDArray.push($scope.tempRole[i].id);
            roleNameArray.push($scope.tempRole[i].name);
          }
          console.log(roleIDArray);
          console.log(roleIDArray.toString());

                appuserdata.roleID=roleIDArray.toString();
                appuserdata.role=roleNameArray.toString();
                console.log(appuserdata);

             JWTTOKEN.requestFunction('POST','userSignup',appuserdata,'withoutAPI').then(function(res){
                

                 ListArray.push(res.data);
             
                $scope.appuser={};
                $scope.tempRole = undefined;
               
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
          angular.copy($scope.original, $scope.appuserEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.appuser="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        console.log(data);
        cancelFun(fun,data);
      }
      
            
      /*update pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        userFetchFunction();
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        $scope.appuserEdit=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.tempUserRoles = [];
        var roleArray = $scope.appuserEdit.role.split(',');
        $scope.roles.forEach(function(origRole) {
        	var role = angular.copy(origRole);
        	roleArray.forEach(function(userRole) {
        		if (role.name === userRole) {
        			$scope.tempUserRoles.push(role);
        		}
        	});
        })
        
        $scope.editRead=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialogappuser'
              });//$mdDialog show
      }


      $scope.updateappuserclick=function(data,invalid,button)
      {
        console.log('updateappuserclick');
        if(button=="Edit")
        {
          $scope.buttonText='Save';
          $scope.editRead=false;
          $scope.selectdisabled=false;
          $scope.isChecked = true;
        }
        else
        {
          console.log('update');
          if(invalid==false)
          {
        	  var roleIDArray=[];
              var roleNameArray=[];
        	  for(var i=0;i<$scope.tempUserRoles.length;i++)
              {
                console.log($scope.tempUserRoles[i]);
                roleIDArray.push($scope.tempUserRoles[i].id);
                roleNameArray.push($scope.tempUserRoles[i].name);
              }
              console.log(roleIDArray);
              console.log(roleIDArray.toString());

              data.roleID=roleIDArray.toString();
              data.role=roleNameArray.toString();
            // appuserFactory
           console.log(data);
            // .updateappuser(data)
            // .then(function(response){
                //$(".projectEditForm")[0].reset();
                  JWTTOKEN.requestFunction('PUT','appusers/'+data.id,data).then(function(res){
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
             // appuserFactory
               JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'appuser'});
            // .massDeleteappuser(idArray);
                    
                  var ListArray=$scope.appuserdata;
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
              // appuserFactory
             
                    // .removeappuser($scope.selecteddata[0])
                    // .then(function(response){
                       JWTTOKEN.requestFunction('DELETE','appusers/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.appuserdata;
                                var index = ListArray.indexOf($scope.selecteddata[0]);
                                ListArray.splice(index, 1);

                    })
            }
            else{
              console.log('Canceled');
            }
         });
          
      }
      
      $scope.isUserRole = function(role) {
      	console.log(role);
      	if (sessionStorage.role == role) {
      		return true;
      	}	else {
      		return false;
      	}
    	
      };

   

}]);