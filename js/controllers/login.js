angular.module('app')
  .controller('loginController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','$window','JWTTOKEN', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,$window,JWTTOKEN) {
    $scope.activated=false;
   $scope.loginClick=function(loginData)
   {
   

    /* $scope.activated=true;
    console.log('loginClick');
    console.log(loginData);
    //loginFactory.login(loginData).then(function(result){
      JWTTOKEN.requestFunction('POST','userLogin',loginData,'withoutAPI').then(function(result){
        $scope.activated=false;
    	console.log(result);
      JWTTOKEN.requestFunction('POST','getUserData',{token:result.data.token},'withoutAPI').then(function(resultrole){
        console.log(resultrole);
            sessionStorage.setItem("token",result.data.token);
            sessionStorage.setItem("userId",resultrole.data.userId);
            sessionStorage.setItem("role",resultrole.data.role);
            $window.location.href = '#/calendarView';
      });
    })*/
    //$window.location.href = '#/panelView';
    filterAttributeFromJSONObject();
   }
    

     function setObjectFromFilterByKeyValuePair(theObject,key,value,newvalue) {

               var result = null;
              if(theObject instanceof Array) {
                  for(var i = 0; i < theObject.length; i++) {
                       setObjectFromFilterByKeyValuePair(theObject[i],key,value,newvalue);
                  }
              }
              else
              {
                  for(var prop in theObject) {
                      if(prop == key) 
                      {
                          console.log(theObject[key]);
                          if(theObject[key]==value)
                          {
                             theObject[key]=newvalue;
                          }
                      }
                      if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                           setObjectFromFilterByKeyValuePair(theObject[prop] ,key,value,newvalue);
                  }
              }
              return theObject;
      }

function filterAttributeFromJSONObject()
{
   var myObject = [{
          'title': 'some title',
          'channel_id':'123we',
          'options': [{
                  'channel_id':'abc',
                  'image':'http://asdasd.com/all-inclusive-block-img.jpg',
                  'title':'All-Inclusive',          
                  'options': [{
                          'channel_id':'dsa2',
                          'title':'Some Recommends',
                          'options': {
                                  'image':'http://www.asdasd.com',
                                  'title':'Sandals',
                                  'id':'2'
                           }
                  },
                  {
                          'channel_id':'dsa3',
                          'title':'Some Recommends',
                          'options': {
                                  'image':'http://www.badasd.com',
                                  'title':'Boots',
                                  'id':'1',
                                  'testkey1':'sikha'
                           }
                  }]
        }]
    }];
  //  var value=getObject(myObject,'testkey1');
  // console.log(value);
  console.log('calling');
  var updatedObj=setObjectFromFilterByKeyValuePair(myObject,'testkey1','sikha','sikha8u8u8u8u');
    console.log(updatedObj);

}
   
}]);