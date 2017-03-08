// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
    .module('app')
    .controller('printingController', ['$scope', '$state', 'Processticket', function($scope,
        $state, $mdDialog,
        Processticket) {

           /*CRUD operations are done from parent controller
       Author :prasad
Date:09-Feb-2107*/

//-----------------------Load of Controller --------------------


$scope.processticket = $scope.$parent.$parent.selectedProcessTicket;

//>>>>>> Added by Ramesh
//$scope.addProcessTicket = $scope.$parent.$parent.addProcessTicket;
$scope.addProcessTicket = function(processTicket) {
	$scope.$parent.$parent.addProcessTicket(processTicket, function(savedProcessTkt) {
		$scope.processticket = savedProcessTkt;
	});
};

$scope.saveProcessTicket = function(processTicket) {
	$scope.$parent.$parent.saveProcessTicket(processTicket, function(savedProcessTkt) {
		$scope.processticket = savedProcessTkt;
	});
};
//<<<<<<

if($scope.processticket ==null || $scope.processticket == undefined)
    $scope.processticket = {};



        if ($scope.processticket.FabricRow == null || $scope.processticket.FabricRow == undefined) {
        	console.log("Printing process Ticket Fabric Row is null");
            $scope.Fabriccounter = 2;
            $scope.processticket.FabricRow = [{
                "fromstores":"",
                "meter": "",
                "dyed": "",
                "screen":""

            }];
        }

        console.log($scope.processticket.FabricRow);

        //----------------Add More ---------------------------------------------------
 
    /*   Author :prasad
Date:09-Feb-2107*/
        

        $scope.AddMore = function() {
            // console.log('more yarn');
            var counter = $scope.counter;
            //console.log(processticket);
            $scope.processticket.FabricRow.push({
                "fromstores":"",
                "meter": "",
                "dyed": "",
                "screen":""

            });

            $scope.counter = $scope.counter + 1;
           
        }


    }]);