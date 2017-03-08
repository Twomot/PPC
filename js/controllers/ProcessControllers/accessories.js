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

console.log($scope.processticket)
if($scope.processticket ==null || $scope.processticket == undefined)
    $scope.processticket = {};
else
    console.log('$scope.processticket exist');

// >>>>>> Added By Ramesh
if ($scope.processticket.beads == null || $scope.processticket.beads == undefined) {
    $scope.processticket.beads = [{
        "type": "",
        "color": "",
        "size": "",
        "quantity": "",
        "ponumber": ""
    }];
}

if ($scope.processticket.threads == null || $scope.processticket.threads == undefined) {
    $scope.processticket.threads = [{
    	"type": "",
        "color": "",
        "size": "",
        "quantity": "",
        "ponumber": ""
    }];
}

if ($scope.processticket.zippers == null || $scope.processticket.zippers == undefined) {
    $scope.processticket.zippers = [{
    	"type": "",
        "color": "",
        "size": "",
        "quantity": "",
        "ponumber": ""
    }];
}

if ($scope.processticket.buttons == null || $scope.processticket.buttons == undefined) {
    $scope.processticket.buttons = [{
    	"type": "",
        "color": "",
        "size": "",
        "quantity": "",
        "ponumber": ""
    }];
}

if ($scope.processticket.others == null || $scope.processticket.others == undefined) {
    $scope.processticket.others = [{
    	"type": "",
        "color": "",
        "size": "",
        "quantity": "",
        "ponumber": ""
    }];
}


$scope.addMore = function(block) {
	switch (block) {
	case "Bead":
		$scope.processticket.beads.push({
	    	"type": "",
	        "color": "",
	        "size": "",
	        "quantity": "",
	        "ponumber": ""
	    });
		break;
	case "Thread":
		$scope.processticket.threads.push({
	    	"type": "",
	        "color": "",
	        "size": "",
	        "quantity": "",
	        "ponumber": ""
	    });
		break;
	case "Zipper":
		$scope.processticket.zippers.push({
	    	"type": "",
	        "color": "",
	        "size": "",
	        "quantity": "",
	        "ponumber": ""
	    });
		break;
	case "Button":
		$scope.processticket.buttons.push({
	    	"type": "",
	        "color": "",
	        "size": "",
	        "quantity": "",
	        "ponumber": ""
	    });
		break;
	case "Other":
		$scope.processticket.others.push({
	    	"type": "",
	        "color": "",
	        "size": "",
	        "quantity": "",
	        "ponumber": ""
	    });
		break;
	}
};

}]);