 angular.module('app')
  .controller('signupController', ['$location','$filter','$scope', '$state','$stateParams','JWTTOKEN', function($location,$filter,$scope,
      $state,$stateParams,JWTTOKEN) {
    
          ////////////////Role Fetch/////////////////////////
            JWTTOKEN.requestFunction('GET','Roles').then(function(rolesResult){
              console.log(rolesResult);
              $scope.roles=rolesResult.data;
            });
          ////////////////////////////////////////
          ////////////////user Fetch/////////////////////////
            JWTTOKEN.requestFunction('GET','appusers').then(function(usersResult){
              console.log(usersResult);
              $scope.users=usersResult.data;
            });
          ////////////////////////////////////////

              /*dialog add click*/
              $scope.addsample=function(sampledata)
              {

                console.log(sampledata);
                sampledata.roleID=sampledata.role.id;
                sampledata.role=sampledata.role.name;
               // sampledata.role
                     JWTTOKEN.requestFunction('POST','userSignup',sampledata,'withoutAPI').then(function(res){
                       console.log(res);
                       alert("User SignUp Successfull !!! Pls Login")
                       
                    },function(err){
                     
                  })
                }
              


}]);