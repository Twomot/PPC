
angular
    .module('app')
    .controller('cabinetController', ['$scope', '$state', 'Processticket', function($scope,
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



        if ($scope.processticket.WarpRow == null || $scope.processticket.WarpRow == undefined) {
            
            $scope.processticket.WarpRow = [{
                "warp":"",
                "lots": "",
                "bundles": "",
                "types": "",
                "tiendyelots": "",
                "tiendyebundles": "",
                "po": "",
                "lineitem": ""
            }];
        }

        if ($scope.processticket.WeftRow == null || $scope.processticket.WeftRow == undefined) {
            
            $scope.processticket.WeftRow = [{
                "weft":"",
                "weftlots": "",
                "weftbundles": "",
                "wefttype": "",
                "wefttiendyelots": "",
                "wefttiendyebundles": ""
            }];
        }

        if ($scope.processticket.EmbThreadRow == null || $scope.processticket.EmbThreadRow == undefined) {
            
            $scope.processticket.EmbThreadRow = [{
                "embthread":"",
                "emblots": "",
                "embbundles": "",
                "embtypes": "",
                "embtiendyelots": "",
                "embtiendyebundles": ""
            }];
        }

        //----------------Add More ---------------------------------------------------
 
    /*   Author :Ramesh
Date:03-Mar-2017*/
        

        $scope.AddMore = function(section) {
        	
            if (section === 'warp') {
	            $scope.processticket.WarpRow.push({
	            	"warp":"",
	                "lots": "",
	                "bundles": "",
	                "types": "",
	                "tiendyelots": "",
	                "tiendyebundles": "",
	                "po": "",
	                "lineitem": ""
	            });
        	}	else if (section === 'weft') {
	            $scope.processticket.WeftRow.push({
	            	"weft":"",
	                "weftlots": "",
	                "weftbundles": "",
	                "wefttype": "",
	                "wefttiendyelots": "",
	                "wefttiendyebundles": ""
	            });
        	}	else if (section === 'embThread') {
	            $scope.processticket.EmbThreadRow.push({
	            	"embthread":"",
	                "emblots": "",
	                "embbundles": "",
	                "embtypes": "",
	                "embtiendyelots": "",
	                "embtiendyebundles": ""
	            });
        	}
            
           
        }


    }]);