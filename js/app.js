'use strict';

angular.module('app', [
    'ui.router',
    'lbServices',
    'app.factories',
    'ngStorage',
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'cl.paging',
    'ui.filters'
  ])
.constant('appConfig',{baseUrl:document.location.protocol+"//"+document.location.host+"/api/",witoutapi:document.location.protocol+"//"+document.location.host+"/",token:sessionStorage.getItem("token")})
//.constant('appConfig',{baseUrl:'http://twomot.com:4009/api/',witoutapi:'http://twomot.com:4009/',token:sessionStorage.getItem("token")})
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
    //admin part

    .state('UoMList', {
        url: '/UoMList',
        templateUrl: 'templates/ADMIN/UoMList.html',
        controller: 'UoMListController',
         data: {
        requireLogin: true
      }
      })

    .state('location', {
        url: '/location',
        templateUrl: 'templates/ADMIN/location.html',
        controller: 'locationController',
         data: {
        requireLogin: true
      }
      })

    .state('holiday', {
        url: '/holiday',
        templateUrl: 'templates/ADMIN/holiday.html',
        controller: 'holidayController',
         data: {
        requireLogin: true
      }
      })

    .state('transittime', {
        url: '/transittime',
        templateUrl: 'templates/ADMIN/transittime.html',
        controller: 'transittimeController',
         data: {
        requireLogin: true
      }
      })

    .state('workcenter', {
        url: '/workcenter',
        templateUrl: 'templates/ADMIN/workcenter.html',
        controller: 'workcenterController',
         data: {
        requireLogin: true
      }
      })

    .state('vendor', {
        url: '/vendor',
        templateUrl: 'templates/ADMIN/vendor.html',
        controller: 'vendorController',
         data: {
        requireLogin: true
      }
      })

    .state('workcentervendor', {
        url: '/workcentervendor',
        templateUrl: 'templates/ADMIN/workcentervendor.html',
        controller: 'workcentervendorController',
         data: {
        requireLogin: true
      }
      })

    .state('machine', {
        url: '/machine',
        templateUrl: 'templates/ADMIN/machine.html',
        controller: 'machineController',
         data: {
        requireLogin: true
      }
      })

    .state('user', {
        url: '/user',
        templateUrl: 'templates/ADMIN/user.html',
        controller: 'appuserController',
         data: {
        requireLogin: true
      }
      })
    .state('plant', {
        url: '/plant',
        templateUrl: 'templates/ADMIN/plant.html',
        controller: 'plantController',
         data: {
        requireLogin: true
      }
      })

    //admin ends

    .state('landingPage', {
        url: '/landingPage',
        templateUrl: 'templates/landingpage.html',
        controller: 'homeController',
         data: {
        requireLogin: false
      }
      })

     .state('calendarView', {
        url: '/calendarView',
        templateUrl: 'templates/calenderview.html',
        controller: 'monthViewController',
         data: {
        requireLogin: true
      }
      })

      .state('panelView', {
        url: '/panelView/:id',
        templateUrl: 'templates/panelView.html',
        controller: 'panelViewController',
         data: {
        requireLogin: true
      }
      })
      .state('scheduleView', {
        url: '/scheduleView',
        templateUrl: 'schedule.html',
         data: {
        requireLogin: true
      }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginController',
         data: {
        requireLogin: false
      }
      })
      .state('processView', {
        url: '/processView/:id',
        templateUrl: 'templates/processView.html',
        controller: 'processViewController',
         data: {
        requireLogin: true
      }
      })
      .state('signUp', {
        url: '/signUp',
        templateUrl: 'templates/ADMIN/signup.html',
        controller: 'signupController',
         data: {
        requireLogin: true
      }
      })
      .state('masterView', {
        url: '/masterView',
        templateUrl: 'templates/monthView.html',
        controller: 'monthViewController',
         data: {
        requireLogin: true
      }
      })
      .state('blackout', {
        url: '/blackout',
        templateUrl: 'templates/ADMIN/blackout.html',
        controller: 'blackoutController',
         data: {
        requireLogin: true
      }
      })
      .state('matrixScheduler', {
        url: '/matrixScheduler',
        templateUrl: 'templates/matrix_scheduler.html',
        controller: 'matrixController',
         data: {
        requireLogin: true
      }
      });
      
      
    $urlRouterProvider.otherwise('landingPage');
  }])





//-------------------------------------------------
.run(function ($rootScope,$state) {
  //console.log(sessionStorage.getItem("role"));  
$rootScope.currentRole =sessionStorage.getItem("role");
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
   console.log(toState);
    var requireLogin = toState.data.requireLogin;
    var userID=sessionStorage.getItem("userId");
    console.log(userID);
                     
    if (requireLogin && typeof userID === 'undefined') {
      event.preventDefault();
       //$window.location.href = '#/landingPage';
      $state.go('landingPage', {},{reload: true});
    }
  });

})
//----------------------------------------------------

.factory('JWTTOKEN', ['$state','$q','$http','appConfig', function($state,$q,$http,appConfig) {
        'use strict';
        return {
          /*requestFunction:function(method,modelUrl,data,checkStatus)
          {
            appConfig.token=sessionStorage.getItem("token");
            console.log('myFunction');
            var urlvar;
             if(checkStatus=="withoutAPI")
              {
                console.log('withoutAPI');
                urlvar=appConfig.witoutapi;
              }
              else
              {
                console.log('withAPI');
                urlvar=appConfig.baseUrl;
              }
              console.log(urlvar);
            var deffered=$q.defer();
            
             return $http({
                        method :method,
                        headers: {'Authorization': 'Bearer '+appConfig.token},
                        url:urlvar+modelUrl,
                        data:data,
                        //url:appConfig.baseUrl+'mastertickets?filter[where][id]=58706f183dfa6a6a2163c6ba',
                        'Content-Type':'application/x-www-form-urlencodded'
                       }).success(function(data, status,callback){
                        console.log(data);
                        deffered.resolve(data);
                       }).error(function(data, status) {
                            alert("errr");
                  });

                  return deffered.promise;     
          }*/

          requestFunction:function(method,modelUrl,data,checkStatus)
          {

            appConfig.token=sessionStorage.getItem("token");
            console.log('myFunction');
            var urlvar;
             if(checkStatus=="withoutAPI")
              {
                console.log('withoutAPI');
                urlvar=appConfig.witoutapi;
              }
              else
              {
                console.log('withAPI');
                urlvar=appConfig.baseUrl;
              }
              console.log(urlvar);
            var deffered=$q.defer();
            
            var httpObj={};
            /*if(method=="GET")
            {
              httpObj={
                        method :method,
                        headers: {'Authorization': 'Bearer '+appConfig.token},
                        url:urlvar+modelUrl,
                        params:data,
                        'Content-Type':'application/x-www-form-urlencodded'
                       }
            }
            else if(method=="POST")
            {
                httpObj={
                        method :method,
                        headers: {'Authorization': 'Bearer '+appConfig.token},
                        url:urlvar+modelUrl,
                        data:data,
                        'Content-Type':'application/x-www-form-urlencodded'
                       }
            }
              return $http(httpObj).success(function(data, status,callback){
                        console.log(data);
                        deffered.resolve(data);
                       }).error(function(data, status) {
                            alert("errr");
                  });

                  return deffered.promise; */   

                  return $http({
                        method :method,
                        headers: {'Authorization': 'Bearer '+appConfig.token},
                        url:urlvar+modelUrl,
                        data:data,
                        //url:appConfig.baseUrl+'mastertickets?filter[where][id]=58706f183dfa6a6a2163c6ba',
                        'Content-Type':'application/x-www-form-urlencodded'
                       }).success(function(data, status,callback){
                        console.log(data);
                        deffered.resolve(data);
                       }).error(function(data, status) {
                            alert("errr");
                  });

                  return deffered.promise;      
          }
    };
}])

/*var app = angular.module('app', []);

angular.module('app', [
    'ui.router',
    'app.factories',
    'ngStorage',
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'cl.paging'
  ])
.constant('appConfig',{baseUrl:document.location.protocol+"//"+document.location.host+"/api/"})
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('UoMList', {
        url: '/UoMList',
        templateUrl: 'templates/ADMIN/UoMList.html',
        controller: 'UoMListController'
      })
      .state('pagination', {
        url: '/pagination',
        templateUrl: 'templates/ADMIN/paginationSample.html',
        controller: 'paginationController'
      })
      .state('panelView', {
        url: '/panelView',
        templateUrl: 'templates/panelView.html',
        controller: 'panelViewController'
      })
      .state('scheduleView', {
        url: '/scheduleView',
        templateUrl: 'schedule.html'
      })
      
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginController'
      })
      .state('processView', {
        url: '/processView',
        templateUrl: 'templates/processView.html',
        controller: 'processViewController'
      })
      .state('sample', {
        url: '/sample',
        templateUrl: 'templates/sample.html',
        controller: 'MainGanttCtrl'
      })
      .state('schedule', {
        url: '/schedule',
        templateUrl: 'templates/schedule.html',
        controller: 'MainSchedulerCtrl'
      });
      
    //$urlRouterProvider.otherwise('home');
  }])*/


/*.factory('JWTTOKEN', ['$state','$q','$http','appConfig', function($state,$q,$http,appConfig) {
        'use strict';
        return {
          
    };
}])*/

