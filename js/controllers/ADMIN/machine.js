angular.module('app')
  .controller('machineController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', 'commonFactory', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN, commonFactory) {
    console.log('userList');
    $scope.selecteddata=[];
     $scope.original = {};
     var massDelete;

	$scope.editEnabled = commonFactory.isEditAllowed();

      ////////////////////headingList/////////////////////////
    $scope.headingArray=[
                          {"title":"Name","model":"machine"},
                          {"title":"Work Center"},
                          {"title":"Vendor"},
                          {"title":"Location"},
                          {"title":"Capacity"}
                          
                          // {"title":"UoM"},
                          
                        
                          // {"title":"LocationID"}
                        ];
    ///////////////////////////////////////////////////////
      JWTTOKEN.requestFunction('GET','machines?filter[include]=plantrelation&filter[include]=workcenterrelation&filter[where][deletedStatus]=false').then(function(machineResult){
    	$scope.machinedata=machineResult.data;
    });

       JWTTOKEN.requestFunction('GET','workcentervendors').then(function(workcenterResult){
    // workcenterFactory.getalworkcenter().then(function(workcenterResult){
      console.log(workcenterResult.data);
      $scope.workcentervendors=workcenterResult.data;
    });

    JWTTOKEN.requestFunction('GET','UoMs').then(function(UoMResult){
      console.log(UoMResult);
      $scope.UoMs=UoMResult.data;
    });

	loadMachinesToBlackout();
	function loadMachinesToBlackout() {
	     JWTTOKEN.requestFunction('GET','machines/getmachinewith2levelrelation').then(function(machines){
	       $scope.machinesTosetblackout=machines.data;
	       $scope.machinesTosetblackout_copy=machines.data;
	
	    });
   	}
     $scope.searchByOptions=["By Vendor" ,"By Workcenter", "All"];


    $scope.setBlackOutDayDialog=function()
    {
      //alert('yes')
     // $scope.setblackout=true;
      console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#setblackoutdayDialog',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
    }

    $scope.searchbyChange=function(searchby)
    {
        $scope.searchby=searchby;
        if(searchby=="By Vendor")
        {
            JWTTOKEN.requestFunction('GET','vendors').then(function(vendors){
            $scope.vendororworkcenterforsearch=vendors.data;
          });
        }
        else if(searchby=="By Workcenter")
        {
            JWTTOKEN.requestFunction('GET','workcenters').then(function(workcenters){
            $scope.vendororworkcenterforsearch=workcenters.data;
          });
        }
        else if(searchby=="All")
        {
          $scope.machinesTosetblackout=angular.copy($scope.machinesTosetblackout_copy)
        }
    }

    $scope.loadmachinessearchby=function(vendorOrWorkcenter)
    {
        if($scope.searchby=="By Vendor")
        {
          $scope.machinesCopy=angular.copy($scope.machinesTosetblackout_copy)
          $scope.machinesTosetblackout = $filter('filter')($scope.machinesCopy, {"workcentervendor": {"vendorRelation":{"id": $scope.vendororworkcenterForSearch}}});
        }
        else if($scope.searchby=="By Workcenter")
        {
           $scope.machinesCopy=angular.copy($scope.machinesTosetblackout_copy)
           $scope.machinesTosetblackout = $filter('filter')($scope.machinesCopy, {"workcentervendor": {"workCenterRelation":{"id": $scope.vendororworkcenterForSearch}}});
        }
    }
    $scope.setBlackoutDay1=function(blackout)
    { 
    	var obj={machines:blackout.machines , date: blackout.date};
    	JWTTOKEN.requestFunction('POST','machinecalendars/setBlackOutDayForMultipleMachines',obj).then(function(res){
    	   blackout.machines.forEach(function(boMachine) {
    		   var blackoutMachne = $filter('filter')($scope.machinedata, {'id': boMachine})[0];
	    	   var holidayName = 'BLACKOUT - ' + blackoutMachne.name;
	    	   var holidayObj = {'from': blackout.date,
	    				   			'holidayname': holidayName,
                      'MachineID':blackoutMachne.id,
	    				   			'locationID': blackoutMachne.LocationID,
	    				   			'to': blackout.date,
	    				   			'type': 'BLACKOUT'};
	    	   
	    	   JWTTOKEN.requestFunction('POST','blackouts',holidayObj).then(function(holidayResponse){
		           console.log(holidayName + " Holiday added");
	    	   });
    	   });
    	   alert('blackout day set');
           $mdDialog.hide();
      });

    }


 $scope.setBlackoutDay = function(blackout) {
    var obj = { machines: blackout.machines, date: blackout.date };

    var holidayObj = {
        'from': blackout.date,

        'to': blackout.date,
        'type': 'BLACKOUT'
    };

    JWTTOKEN.requestFunction('POST', 'blackouts', holidayObj).then(function(holidayResponse) {
        console.log(holidayResponse);
        obj.blackoutID = holidayResponse.data.id
        console.log(obj);
        JWTTOKEN.requestFunction('POST', 'machinecalendars/setBlackOutDayForMultipleMachines', obj).then(function(res) {
            $mdDialog.hide();

        });

    });
alert('blackout day set');
}



    $scope.workcenterChange=function(workcenterID)
    {
       JWTTOKEN.requestFunction('GET','workcentervendors?filter[where][workcenterID]='+workcenterID+'&filter[include]=vendorRelation&filter[include]=plantRelation').then(function(workcentervendorResult){
        $scope.vendors=workcentervendorResult.data;
        $scope.plants=workcentervendorResult.data;
      });
    }
/////////////////////////locationChange////////////////
    $scope.vendorChange=function(workcenterID,workcenterVendorID)
    {
     
      console.log(workcenterID);
       console.log(workcenterVendorID);
       workcenterVendorID=workcenterVendorID.vendorRelation.id;
      // workcentervendorFactory.getLocationonVendor(workcenterID,workcenterVendorID).then(function(data){
        JWTTOKEN.requestFunction('GET','workcentervendors?filter[where][workcenterID]='+workcenterID+'&filter[where][vendorID]='+workcenterVendorID+'&filter[include]=plantRelation').then(function(data){
       console.log(data);
       $scope.locations=data.data;
        //$scope.vendors=workcentervendorResult.data;

      });
    }


    /*////////////////////Function ///////////////////////*/
    /*//////////////////////////////////////////*/
    /*pop dialog on click*/
      $scope.addPopup=function()
      {
        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialogmachine',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      /*dialog add click*/

  

      $scope.addmachine=function(machinedata,invalid)
      {

        console.log(machinedata);
        //machinedata.workcenterVendorID=machinedata.workcenterVendorID.id;
         var ListArray=$scope.machinedata;
        if(invalid==false)
        {
console.log(machinedata);
console.log(machinedata.workCenterVendor.workcenterID);
console.log(machinedata.workCenterVendor.id);
machinedata.workCenterID = machinedata.workCenterVendor.workcenterID;
machinedata.workcenterVendorID = machinedata.workCenterVendor.id;
console.log("VENDOR LOCTION ID ");
console.log($filter('filter')($scope.workcentervendors, {"id": machinedata.workCenterVendor.id})[0].locationID);
var selectedWCV = $filter('filter')($scope.workcentervendors, {"id": machinedata.workCenterVendor.id})[0];
machinedata.LocationID = selectedWCV.locationID;
machinedata.LocationName = selectedWCV.location.name?selectedWCV.location.name:selectedWCV.location;
machinedata.vendor = selectedWCV.vendor.name?selectedWCV.vendor.name:selectedWCV.vendor;
delete machinedata.workCenterVendor;



          // machineFactory
          //   .addmachine(machinedata)
          //   .then(function(res){
             JWTTOKEN.requestFunction('POST','machines',machinedata).then(function(res){

              var newItemID=res.data.id;
               JWTTOKEN.requestFunction('GET','machines?filter[where][id]='+newItemID+'&filter[include]=plantrelation&filter[include]=workcenterrelation').then(function(machineResult){
                
                 ListArray.push(machineResult.data[0]);
                //ListArray.push(res.data);
                //$(".projectAddForm")[0].reset();
                $scope.machine={};
                $scope.projectAddForm.$setPristine();
                $mdDialog.hide();
				loadMachinesToBlackout();
              });
            },function(err){
             
          })
        }
      }

     


      /*cancel function*/
      var cancelFun=function(fun,data)
      {
        console.log(fun);
        console.log(data);
        if(fun=='edit')
        {
          angular.copy($scope.original, $scope.machineEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.machine="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }
      /*updaet pop up*/
      $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);

        $scope.machineEdit=$scope.selecteddata[0];
        angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];

        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialogmachine'
              });//$mdDialog show
      }


      $scope.updatemachineclick=function(data,invalid,button)
      {
        console.log('updatemachineclick');
        if(button=="Edit")
        {
          $scope.buttonText='Save';
          $scope.editRead=false;
           $scope.selectdisabled=false;
        }
        else
        {
          console.log('update');
          if(invalid==false)
          {
        	  if (data.type !== 'normal') {
        		  data.UoM = undefined;
        		  data.capacity = undefined;
        	  }
            // machineFactory
            // .updatemachine(data)
            // .then(function(response){
              JWTTOKEN.requestFunction('PUT','machines/'+data.id,data).then(function(res){
                //$(".projectEditForm")[0].reset();
                $mdDialog.hide();
              },function(err){
                console.log(err);  
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
             // machineFactory
             // .massDeletemachine(idArray);
             JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'machine'});
                    // var idArray=$scope.selecteddata[i].id;
                  // view update
                  var ListArray=$scope.machinedata;
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
              // machineFactory
              //       .removemachine($scope.selecteddata[0])
              //       .then(function(response){
              	// JWTTOKEN.requestFunction('DELETE','machines/'+data.id+'/machinecalendar').then(function(response){
                JWTTOKEN.requestFunction('DELETE','machines/'+$scope.selecteddata[0].id).then(function(res){
                      var ListArray=$scope.machinedata;
                                var index = ListArray.indexOf($scope.selecteddata[0]);
                                ListArray.splice(index, 1);

                   });
                // });
            }
            else{
              console.log('Canceled');
            }
         });
          
      }
      


   

}]);