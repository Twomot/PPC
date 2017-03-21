angular.module('app')
  .controller('workcentervendorController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN','myService','Workcentervendor', 'commonFactory', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN,myService, Workcentervendor,commonFactory) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;


//Invoking factory method to get Locations
var locationObj = myService.getLocation();
locationObj.Locations.then(function(promiseData){
  $scope.locations = promiseData.data; 
})

	$scope.editEnabled = commonFactory.isEditAllowed();
      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"Work Center Vendor","modelname":"workcentervendor"},
                          {"title":"Work Center"},
                          {"title":"Vendor"},
                          {"title":"Location"},
                          {"title":"Type"}
                          
                        ];
    ///////////////////////////////////////////////////////
    // workcentervendorFactory.getalworkcentervendor().then(function(workcentervendorResult){
       JWTTOKEN.requestFunction('GET','workcentervendors?filter[include]=locationRelation&filter[include]=workCenterRelation&filter[include]=vendorRelation&filter[where][deletedStatus]=false').then(function(workcentervendorResult){
      console.log(workcentervendorResult);
    	$scope.workcentervendorData=workcentervendorResult.data;
    });

     /*location fetch*/
    // workcenterFactory.getalworkcenter().then(function(workcenterResult){
      JWTTOKEN.requestFunction('GET','workcenters').then(function(workcenterResult){
      $scope.workcenters=workcenterResult.data;
    });
     
     /*location fetch*/
    // vendorFactory.getalvendor().then(function(vendorResult){
     /* JWTTOKEN.requestFunction('GET','vendors').then(function(vendorResult){
      $scope.vendors=vendorResult.data;
    });*/
    JWTTOKEN.requestFunction('GET','vendors').then(function(vendorResult){
      $scope.vendors=vendorResult.data;
    });

    JWTTOKEN.requestFunction('GET','plants').then(function(plantResult){
      $scope.plants=plantResult.data;
    });

///user fetch
JWTTOKEN.requestFunction('GET','appusers').then(function(userResult){
      $scope.users=userResult.data;
    });

	//>>>>>> Added by Ramesh
	$scope.addMore = function(userType) {
		if (userType === "fieldofficer") {
			if ($scope.workcentervendorEdit) {
				$scope.workcentervendorEdit.fieldofficerID.push({
		            "plant": "" ,
		            "fieldofficerID": ""
		        });
			}	else {
				$scope.workcentervendor.fieldofficerID.push({
		            "plant": "" ,
		            "fieldofficerID": ""
		        });
			}
		}	else if (userType === "scheduler") {
			if ($scope.workcentervendorEdit) {
				$scope.workcentervendorEdit.schedulerID.push({
		            "plant": "" ,
		            "schedulerID": ""
		        });
			}	else {
				$scope.workcentervendor.schedulerID.push({
		            "plant": "" ,
		            "schedulerID": ""
		        });
			}
		}
	};
	//<<<<<< 
	
	$scope.$watch('workcentervendor.type', function(value) {
		if (value.toLowerCase() === 'internal') {
			$scope.workcentervendor.fieldofficerID = [];
			$scope.workcentervendor.schedulerID = [];
		}	else {
			$scope.workcentervendor.fieldofficerID = [{
	            "plant": "" ,
	            "fieldofficerID": ""
	        }];
	        
	        $scope.workcentervendor.schedulerID = [{
	            "plant": "" ,
	            "schedulerID": ""
	        }];
		}
	});
	
    // /*////////////////////Function ///////////////////////*/
    // /*//////////////////////////////////////////*/
    // /*pop dialog on click*/
      $scope.addPopup=function()
      {
    	$scope.workcentervendorEdit = undefined;
		
    	$scope.editRead=true;
        console.log('addPopup click');
        //>>>>>> Added by Ramesh
        $scope.workcentervendor = {};
        $scope.workcentervendor.fieldofficerID = [{
            "plant": "" ,
            "fieldofficerID": ""
        }];
        
        $scope.workcentervendor.schedulerID = [{
            "plant": "" ,
            "schedulerID": ""
        }];
        //<<<<<<
        
        $mdDialog.show({
          contentElement: '#addDialogworkcentervendor',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/
      $scope.addworkcentervendor=function(workcentervendor,invalid)
      {
    	  var compositeUniqueKey = {workcenterID: workcentervendor.workcenter.id, 
					locationID: workcentervendor.location.id,
					vendorID: workcentervendor.vendor.id};
    	  hasDuplicate(compositeUniqueKey).then(function(isDuplicate){
    		  if (isDuplicate) {
				alert("Already record exists!");
    		  }	else {
				saveWorkcenterVendor(workcentervendor,invalid);
    		  }	
    	  });

      }

      /*cancel function*/
      var cancelFun=function(fun,data)
      {
        console.log(fun);
        console.log(data);
        if(fun=='edit')
        {
          angular.copy($scope.original, $scope.workcentervendorEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.workcentervendor="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }

     
        //////////location change///////////
        $scope.locationChange=function(locationID)
          {
            console.log(locationID);
            // vendorFactory.getVendoronLocation(locationID).then(function(vendorResult){

               JWTTOKEN.requestFunction('GET','vendors?filter[where][locationID]='+locationID).then(function(vendorResult){

              console.log(vendorResult);
              $scope.vendors=vendorResult.data;
            });
          }

        ////////////////////////////////
        /*$scope.vendorChange=function(vendorData)
        {
          console.log(vendorData);
          console.log(vendorData.plantRelation);
          //$scope.locations=vendorData.locationID;
          $scope.plants=vendorData.plantRelation;
          
        }*/


        function getWCName() {
        	var filteredWC = $filter('filter')($scope.workcenters, { id: $scope.workcentervendorEdit.workcenterID })[0];
        	$scope.editWCName = filteredWC?filteredWC.name:undefined;
        }
        
    //   /*update pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        $scope.workcentervendorEdit=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.selectdisabled=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];
        getWCName();
        //>>>>>> Added by Ramesh
        if ($scope.workcentervendorEdit.type.toLowerCase() === 'internal') {
        var fieldOfficerArray = [];
        $scope.workcentervendorEdit.fieldofficerID.forEach(function(fieldOfficer) {
       	 var fieldOfficerID = fieldOfficer.fieldofficerID ;
       	 fieldOfficerArray.push(fieldOfficerID);
        });
        $scope.workcentervendorEdit.fieldofficerID = fieldOfficerArray;
        
        if ($scope.workcentervendorEdit.schedulerID !== undefined) {
	        var schedulerArray = [];
	        $scope.workcentervendorEdit.schedulerID.forEach(function(scheduler) {
	       	 var schedulerID = scheduler.schedulerID ;
	       	 schedulerArray.push(schedulerID);
	        });
	        $scope.workcentervendorEdit.schedulerID = schedulerArray;
        }
        
        if ($scope.workcentervendorEdit.QCSchedulerID !== undefined) {
	        var schedulerArray = [];
	        $scope.workcentervendorEdit.QCSchedulerID.forEach(function(scheduler) {
	       	 var QCSchedulerID = scheduler.QCSchedulerID ;
	       	 schedulerArray.push(QCSchedulerID);
	        });
	        $scope.workcentervendorEdit.QCSchedulerID = schedulerArray;
        }
        }
        //<<<<<<
        
        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialogworkcentervendor'
              });//$mdDialog show
      }

    //   //////edit button//////////////////
      $scope.updateworkcentervendorclick=function(data,invalid,button)
      {
    	  console.log('updateworkcentervendorclick');
          
    	 
	  	  
	  	  
        if(button=="Edit")
        {
          $scope.buttonText='Save';
          $scope.selectdisabled=false;
          $scope.editRead=false;
           $scope.selectdisabled=false;
        }
        else
        {
          console.log('update');
          if(invalid==false)
          {
        	  var compositeUniqueKey = {workcenterID: data.workcenterID, 
					  					locationID: data.locationID,
					  					vendorID: data.vendorID};
	  	  	  hasDuplicate(compositeUniqueKey).then(function(isDuplicate){
	  	  		  if (!isDuplicate || isDuplicate === data.id) {
	  	  			updateWorkCenterVendor(data,invalid,button);
	  	  		  }	else {
	  	  			  alert("Already record exists");
	  	  		  }
	  	  	  });
        	
          }
        }       
      }

    $scope.massDelete=function(ev)
      {
        if(massDelete==true)
        {
          console.log('deletePop');
          console.log($scope.selecteddata);
          var title='Are you sure to delete these selected item?';
          var text='';
           dialogFactory.confirmAlert(ev,title,text,function(status){
            if(status=="OK"){
              var idArray=[];
              for(var i=0;i<$scope.selecteddata.length;i++)
              {
                  idArray.push($scope.selecteddata[i].id)
              }
             // workcentervendorFactory
             // .massDeleteworkcentervendor(idArray);
              JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'workcentervendor'});
                    // var idArray=$scope.selecteddata[i].id;
                  // view update
                  var ListArray=$scope.workcentervendorData;
                  for(var i=0;i<$scope.selecteddata.length;i++)
                  {
                    var idx = ListArray.indexOf($scope.selecteddata[i]);
                    ListArray.splice(idx,1);
                  }
                   massDelete=false;
                  // view update

            }
            else{
              console.log('Canceled');
            }
         });
        }
        else
        {
          console.log('pls');
          dialogFactory.alert(ev,'Please Select any of them to delete','');
        }
        
      }

      $scope.toggleFun=function()
      {
        console.log('toggleFun');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata.length);
        if($scope.selecteddata.length!=0)
        {
          massDelete=true;
        }
        else
        {
          massDelete=false;
        }

        
      }
      

      $scope.deleteFunction=function(ev)
      {
        console.log('deletelist');
        console.log($scope.selecteddata);
         console.log($scope.selecteddata[0]);
         var title='Are you sure to delete this item?';
         var text='';
         dialogFactory.confirmAlert(ev,title,text,function(status){
            if(status=="OK"){
              // workcentervendorFactory
              //       .removeworkcentervendor($scope.selecteddata[0])
              //       .then(function(response){
                 JWTTOKEN.requestFunction('DELETE','workcentervendors/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.workcentervendorData;
                                var index = ListArray.indexOf($scope.selecteddata[0]);
                                ListArray.splice(index, 1);

                    })
            }
            else{
              console.log('Canceled');
            }
         });
          
      }

      
     function hasDuplicate(filterObject) {
    	 
    	return Workcentervendor.find()
    	 .$promise
         .then(function(results) {
        	 var filteredValue = $filter('filter')(results, filterObject);
        	 return filteredValue.length>0?filteredValue[0].id:undefined;
         });
    	 
     };
     
      function saveWorkcenterVendor(workcentervendor,invalid){
    	  console.log(workcentervendor);
          var ListArray=$scope.workcentervendorData;
          //workcentervendor.vendorID=workcentervendor.vendorID.id;
         var vendorName =workcentervendor.vendor.name;
           var locationName =workcentervendor.location.name;
           var workcenterName =workcentervendor.workcenter.name;

          workcentervendor.vendorID=workcentervendor.vendor.id;
          workcentervendor.locationID=workcentervendor.location.id;
          workcentervendor.workcenterID=workcentervendor.workcenter.id;

         var displayName=vendorName+"_"+locationName+"_"+workcenterName;
          workcentervendor.displayName=displayName;

          //>>>>>> Added by Ramesh
          if (workcentervendor.type.toLowerCase() === 'internal') {
 	         var fieldOfficerArray = [];
 	         workcentervendor.fieldofficerID.forEach(function(fieldOfficer) {
 	        	 var fieldOfficerObj = {fieldofficerID: fieldOfficer};
 	        	 fieldOfficerArray.push(fieldOfficerObj);
 	         });
 	         workcentervendor.fieldofficerID = fieldOfficerArray;
 	         
 	         if (workcentervendor.schedulerID !== undefined) {
 		         var schedulerArray = [];
 		         workcentervendor.schedulerID.forEach(function(scheduler) {
 		        	 var schedulerObj = {schedulerID: scheduler};
 		        	 schedulerArray.push(schedulerObj);
 		         });
 		         workcentervendor.schedulerID = schedulerArray.length>0?schedulerArray:undefined;
 	         }
 	         
 	         if (workcentervendor.QCSchedulerID !== undefined) {
 		         var QCschedulerArray = [];
 		         workcentervendor.QCSchedulerID.forEach(function(QCscheduler) {
 		        	 var schedulerObj = {QCSchedulerID: QCscheduler};
 		        	 QCschedulerArray.push(schedulerObj);
 		         });
 		         workcentervendor.QCSchedulerID = QCschedulerArray.length>0?QCschedulerArray:undefined;
 	         }
       	}
          //<<<<<<

         if(invalid==false)
         {
            JWTTOKEN.requestFunction('POST','workcentervendors',workcentervendor).then(function(res){
             /*console.log(res);
              console.log(res);
             */
  var newItemID=res.data.id;
            JWTTOKEN.requestFunction('GET','workcentervendors?filter[where][id]='+newItemID+'&filter[include]=locationRelation&filter[include]=workCenterRelation&filter[include]=vendorRelation').then(function(workcentervendorResult){
                
                console.log(workcentervendorResult) 
                  ListArray.push(workcentervendorResult.data[0]);
                 $scope.workcentervendor={};
                 $mdDialog.hide();
              }
              );
                 //ListArray.push(res.data);

                //$mdDialog.hide();
             },function(err){
              
           })
         }
      }

      function updateWorkCenterVendor(data,invalid,button) {
    	//>>>>>> Added by Ramesh
          if (data.type.toLowerCase() === 'internal') {
 	         var fieldOfficerArray = [];
 	        data.fieldofficerID.forEach(function(fieldOfficer) {
 	        	 var fieldOfficerObj = {fieldofficerID: fieldOfficer};
 	        	 fieldOfficerArray.push(fieldOfficerObj);
 	         });
 	       data.fieldofficerID = fieldOfficerArray;
 	         
 	         if (data.schedulerID !== undefined) {
 		         var schedulerArray = [];
 		        data.schedulerID.forEach(function(scheduler) {
 		        	 var schedulerObj = {schedulerID: scheduler};
 		        	 schedulerArray.push(schedulerObj);
 		         });
 		       data.schedulerID = schedulerArray.length>0?schedulerArray:undefined;
 	         }
 	         
 	         if (data.QCSchedulerID !== undefined) {
 		         var QCschedulerArray = [];
 		        data.QCSchedulerID.forEach(function(QCscheduler) {
 		        	 var schedulerObj = {QCSchedulerID: QCscheduler};
 		        	 QCschedulerArray.push(schedulerObj);
 		         });
 		       data.QCSchedulerID = QCschedulerArray.length>0?QCschedulerArray:undefined;
 	         }
       	}
          //<<<<<<
          
        // workcentervendorFactory
        // .updateworkcentervendor(data)
        // .then(function(response){
          JWTTOKEN.requestFunction('PUT','workcentervendors/'+data.id,data).then(function(res){
            //$(".projectEditForm")[0].reset();
            $mdDialog.hide();
          },function(err){
            console.log(err);  
          });
      }

}]);