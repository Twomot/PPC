// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
    .module('app')
    .controller('accessoriesController', ['$scope', '$state', 'Processticket', function($scope,
        $state, $mdDialog,
        Processticket) {

           /*CRUD operations are done from parent controller
       Author :prasad
Date:09-Feb-2107*/

//-----------------------Load of Controller --------------------



//console.log($scope.processticket);
console.log($scope.$parent.$parent);
$scope.processticket = $scope.$parent.$parent.selectedProcessTicket;

console.log($scope.processticket)
if($scope.processticket ==null || $scope.processticket == undefined)
    $scope.processticket = {};
else
    console.log('$scope.processticket exist');


        if ($scope.processticket.Fabric == null || $scope.processticket.Fabric == undefined) {
            console.log('Fabric null');

            $scope.Fabriccounter = 2;
            $scope.processticket.Fabric = [{
                "fabric_ExpectedDate": undefined,
                "fabric_Text_Val": "",
                "fabric_availability_Name": "",

            }];
        }else
        {
               angular.forEach($scope.processticket.Fabric, function(value, key) {
                value.fabric_ExpectedDate = new Date(value.fabric_ExpectedDate);
            });
            

        }
if ($scope.processticket.Yarns == null || $scope.processticket.Yarns == undefined) {
            //To add more Yarn on store add
            console.log('Fabric yarn');
            $scope.counter = 2;
            $scope.processticket.Yarns = [{
                "yarn_ExpectedDate": undefined,
                "yarn_Text_Val": "",
                "yarn_availability_Name": ""
            }];
        } else {


            angular.forEach($scope.processticket.Yarns, function(value, key) {
                value.yarn_ExpectedDate = new Date(value.yarn_ExpectedDate);
            });
         

        }




         $scope.Options = ["Yes", "No", "Partial"];
        //----------------Add More Yarn---------------------------------------------------
        /*called from stores process forma
       Author :prasad
Date:09-Feb-2107*/
        

 
        

        $scope.AddMoreYarn = function() {
            // console.log('more yarn');
            var counter = $scope.counter;
            //console.log(processticket);
            $scope.processticket.Yarns.push({
                "yarn_ExpectedDate": undefined,
                "yarn_Text_Val": "",
                "yarn_availability_Name": ""
            });
            //console.log( $scope.processticket.Yarns);
            //counter = counter++
            $scope.counter = $scope.counter + 1;
           
        }



        $scope.AddMoreFabric = function() {

            $scope.processticket.Fabric.push({
                "fabric_ExpectedDate": undefined,
                "fabric_Text_Val": "",
                "fabric_availability_Name": ""

            });
        
            $scope.Fabriccounter = $scope.Fabriccounter + 1;
        }


    }]);