angular
    .module('app')
    .controller('weavingController', ['$scope', '$state', 'Processticket', function($scope,
        $state, $mdDialog,
        Processticket) {

	$scope.processticket = $scope.$parent.$parent.selectedProcessTicket;
	
	//>>>>>> Added by Ramesh
	//$scope.addProcessTicket = $scope.$parent.$parent.addProcessTicket;
	$scope.addProcessTicket = function(processTicket) {
		$scope.$parent.$parent.addProcessTicket(processTicket, function(savedProcessTkt) {
			$scope.processticket = savedProcessTkt;
			$scope.processticket.processStartDate = new Date($scope.processticket.processStartDate);
			$scope.processticket.processEndDate = new Date($scope.processticket.processEndDate);
			console.log(savedProcessTkt);
		});
	};
	
	$scope.saveProcessTicket = function(processTicket) {
		$scope.$parent.$parent.saveProcessTicket(processTicket, function(savedProcessTkt) {
			$scope.processticket = savedProcessTkt;
			$scope.processticket.processStartDate = new Date($scope.processticket.processStartDate);
			$scope.processticket.processEndDate = new Date($scope.processticket.processEndDate);
			console.log(savedProcessTkt);
		});
	};
	//<<<<<<
	
	if($scope.processticket ==null || $scope.processticket == undefined)
	    $scope.processticket = {};
	else
	    console.log('$scope.processticket exist');

	$scope.$watch('processticket.processStartDate', function(value) {
		$scope.setDuration();
    });
	
	$scope.setDuration = function() {
		if ($scope.processEndDate && $scope.processtartDate) {
			var miliseconds = $scope.processEndDate - $scope.processtartDate;
			var seconds = miliseconds/1000;
			var minutes = seconds/60;
			var hours = minutes/60;
			var days = hours/24;
			$scope.processticket.duration = days+1;
		}
	}
        


}]);