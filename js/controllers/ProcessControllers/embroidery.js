// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
    .module('app')
    .controller('embroideryController', ['$scope', '$state', 'Processticket', function($scope,
        $state, $mdDialog,
        Processticket) {

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

console.log($scope.processticket);
if($scope.processticket ==null || $scope.processticket == undefined)
    $scope.processticket = {};
else
    console.log('$scope.processticket exist');


        if ($scope.processticket.Fabric == null || $scope.processticket.Fabric == undefined) {
            console.log('Embroidery Fabric null');

            $scope.processticket.Fabric = [{
                "fromStores": "",
                "mtrs": "",
                "dyed": "",
                "noofscreens": ""
            }];
        }
        
        if ($scope.processticket.Thread == null || $scope.processticket.Thread == undefined) {
            console.log('Embroidery Thread null');

            $scope.processticket.Thread = [{
                "thread": "",
                "approved": "",
                "bulkpurchase": ""
            }];
        }

         $scope.Options = ["Dyed", "RFP"];
        
        $scope.addMore = function(block) {
        	if (block === 'Fabric') {
	            $scope.processticket.Fabric.push({
	            	"fromStores": "",
	                "mtrs": "",
	                "dyed": "",
	                "noofscreens": ""
	            });  
        	}	else if (block === 'Thread'){
        		$scope.processticket.Thread.push({
	            	"thread": "",
	                "approved": "",
	                "bulkpurchase": ""
	            }); 
        	}
        };


    }]);