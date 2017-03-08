/*function JWTTOKEN(methodName,modelName,$http,appConfig)
{
  console.log('JWTTOKEN');
  console.log(methodName);
  console.log(modelName);
  return $http({
        method :methodName,
        headers: {'Authorization': 'Bearer '+appConfig.token},
        url:appConfig.baseUrl+modelName+'?filter[include]=processes',
        'Content-Type':'application/x-www-form-urlencodded'
       }).success(function(data, status,callback){
          console.log(data);
          return data;
          //deffered.resolve(data);
       }).error(function(data, status) {
            alert("errr");
  });
}*/
//var tokenData = sessionStorage.getItem("token");

angular.module('app.factories', [])


.factory('$localStorage', ['$window', function($window) {
        'use strict';
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            remove: function(key) {
                delete $window.localStorage[key];
            },
            clear: function() {
                $window.localStorage.clear();
            }
        };
    }])

 
.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})


.service('sharedProperties', function () {
        var property = 'First';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    })



    .directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  };
})


.factory('dialogFactory', ['$state','$mdDialog', function($state,$mdDialog) {
        'use strict';
        return {
          confirmAlert:function(ev,title,textContent,callback){
            // var status;
            console.log('confirmAlert');
                var confirm = $mdDialog.confirm()
                      .title(title)
                      .textContent(textContent)
                      .ariaLabel('Lucky day')
                      .targetEvent(ev)
                      .ok('Ok')
                      .cancel('Cancel');

                $mdDialog.show(confirm).then(function() {
                  console.log('ok');
                  callback('OK');

                }, function() {
                  console.log('cancel');
                  callback('Cancel');
                });
               
          },
          alert:function(ev,title,content){
            $mdDialog.show(
              $mdDialog.alert()
                //.parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                // .title('Please Select')
                .title(title)
                .textContent(content)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
          }
            
        };

}])