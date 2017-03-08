
angular.module('app')
	.controller('auditHistoryController', ['$filter','$scope', '$state', '$stateParams','Audithistory', 
	                                  function($filter,$scope, $state, $stateParams, Audithistory) {
		Audithistory
		.find({})
        .$promise
        .then(function(results) {
          $scope.auditHistories = results;
          $scope.nonFilteredHistories = results;
          initPagination();
        });
		
		$scope.searchValue = "";
		
		
		$scope.historyFilter = function(history) {
			if ($scope.searchValue !== '') {
				var dateStr = new Date(history.date).toString();
				if (dateStr.indexOf($scope.searchValue) >= 0
						|| history.id.indexOf($scope.searchValue) >= 0 
						|| history.type.indexOf($scope.searchValue) >= 0
						|| history.action.indexOf($scope.searchValue) >= 0) {
					return true;
				}	else {
					return false;
				}
			}	else {
				return true;
			}
		};
		
		$scope.currentPage = 0;
		$scope.pageSize = 10;
		$scope.offset = $scope.currentPage * $scope.pageSize;

		function initPagination() {
			var totalRecords = $scope.auditHistories.length;
			var totalPages = Math.ceil((totalRecords / $scope.pageSize));
	        $scope.paging = {
	            total: totalPages,
	            current: 1,
	            onPageChanged: loadPages,
	        };
		}

        function loadPages() {
            console.log('Current page is : ' + $scope.paging.current);
            $scope.currentPage = $scope.paging.current;
            $scope.offset = ($scope.currentPage-1) * $scope.pageSize;
        }
        
        $scope.$watch('searchValue', function(value) {
        	$scope.paging.current = 1;
        	$scope.currentPage = 1;
        });
	}]);
  