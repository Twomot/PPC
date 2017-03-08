angular.module('app')
  /*.controller('holidayController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,dialogFactory,JWTTOKEN) {*/
	.controller('holidayController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','dialogFactory','JWTTOKEN','Holiday', 'Location', 'Machinecalendar', 
	                                  function($location,$filter,$scope, $state,$stateParams,$mdDialog, dialogFactory, JWTTOKEN, Holiday, Location, MachineCalendar) {
    console.log('userList');
    $scope.selecteddata = [];
    $scope.original = {};
    var massDelete;

    localStorage.removeItem('machineCaledarAll');
    localStorage.removeItem('machineCaledarOnDate');

    ////////////////////headingList/////////////////////////
    $scope.headingArray = [{"title":"Location", "model": "holiday"},
                           {"title":"Type"},
                           {"title":"Name"},
                           {"title":"From"},
                           {"title":"To"}];
    
    ///////////////////////////////////////////////////////
    // holidayFactory.getalholiday().then(function(holidayResult){
       JWTTOKEN.requestFunction('GET','holidays?filter[include]=locationRelation&filter[where][deletedStatus]=false').then(function(holidayResult){
      console.log(holidayResult);
      $scope.holidayData=holidayResult.data;
    });
    
    // Gets the list of all holidays
    /*function getAllHolidays() {
    	Holiday
          .find({deletedStatus: false, filter: {include: 'locationRelation'}})
          .$promise
          .then(function(results) {
            $scope.holidayData = results;
          });
      }
    getAllHolidays();*/
      

    //////////////location fetch//////////
    /*JWTTOKEN.requestFunction('GET','Locations').then(function(locationResult){
      console.log(locationResult);
    // locationFactory.getallocation().then(function(locationResult){
      $scope.locations=locationResult.data;
    });<<<<<<*/
    
    // Gets the list of locations from the server
    function getLocations() {
    	Location
          .find()
          .$promise
          .then(function(results) {
            console.log(results);
            $scope.locations = results;
          });
    }
    getLocations();

    $scope.validateDate = function(startDate,endDate) {
        $scope.errMessage = '';
        var curDate = new Date();

        if(new Date(startDate) > new Date(endDate)){
          $scope.errMessage = 'To Date should be greater than From date';
          alert($scope.errMessage);
          return false;
        }
        if(new Date(startDate) < curDate){
           $scope.errMessage = 'From date should not be before today.';
           alert($scope.errMessage);
           return false;
        }
        return true;
    };
    
    /*////////////////////Function ///////////////////////*/
    /*//////////////////////////////////////////*/
    /*pop dialog on click*/
    function initPopup() {
    	var year = new Date().getFullYear();
        var range = [];

        for (var i = 0; i < 7; i++) {
            range.push({
              label: year + i,
              value: parseInt(String(year + i).slice(2, 4))
            });
        }
        
        $scope.weekdays = [
                         {id:0, name:'Sunday', selected: false},
                         {id:1, name: 'Monday', selected: false },
                         {id:2, name: 'Tuesday', selected: false},
                         {id:3, name: 'Wednesday', selected: false},
                         {id:4, name: 'Thursday', selected: false}, 
                         {id:5, name: 'Friday', selected: false}, 
                         {id:6, name:'Saturday', selected: false}
                         ];
        $scope.range = [{year:2017}];
    }
    
    $scope.addPopup=function() {
        $scope.recurring=false;
        $scope.selYear="";
        $scope.recurringHoliday={};
        initPopup();
        // $scope.holiday.holidayname="";
        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialogholiday',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
    
      /*dialog add click*/
      $scope.addholiday=function(holidaydata,invalid)
      {

        if(!$scope.recurring)
        {
        	if (!$scope.validateDate(holidaydata.from, holidaydata.to)) {
        		return false;
        	}
        	console.log(holidaydata);
        	console.log(invalid);
        	var ListArray=$scope.holidayData;
        	holidaydata.type = 'NORMAL';
            JWTTOKEN.requestFunction('POST','holidays',holidaydata).then(function(res){

               var newItemID=res.data.id;
               JWTTOKEN.requestFunction('GET','holidays?filter[where][id]='+newItemID+'&filter[include]=locationRelation').then(function(holidayResult){

                ListArray.push(holidayResult.data[0]);
	            $scope.holiday={};
	              alert('Holidays added !!!!')
	                $mdDialog.hide();
	            //$mdDialog.hide();
	          });
	        },function(err){
	         
	      });
        	
        	/*Holiday
        		.create(holidaydata) // Get Details from form
        		.$promise
        		.then(function(res) {
        			$scope.holidayData = '';

        			Holiday.find({id: res.id, filter: {include: 'locationRelation'}})
        			.$promise
        	          .then(function(results) {
        	        	  ListArray.push(results[0]);
        		            $scope.holiday={};
        		              alert('Holidays added !!!!')
        		                $mdDialog.hide();
        	          });
        		});*/
        	
        }
        else
        {
//          $scope.holiday.holidayname="name";
        //  var recurringHoliday=$scope.recurringHoliday;
           var selectdDays=$filter('filter')($scope.weekdays, { selected: true });
           holidaydata.year = {'year' : holidaydata.year};
           console.log(holidaydata.year);
           console.log($scope.SelYear);
    
            $scope.start=new Date(2017,0,1);
            $scope.end= new Date(2017,11,31);
            $scope.weekends = [];
            if(!holidaydata.recurringdate)
            {
            	holidaydata.recursiveDays = selectdDays;
            var day = angular.copy($scope.start);
            while(day <= $scope.end){        
              var d = day.getDay(); 
               for (i=0;i< selectdDays.length;i++){
                if(d === selectdDays[i].id){

                    $scope.weekends.push(new Date(day));
                 }
               }
               
               day.setDate(day.getDate()+1);
          }
        }
        else
        {
//          alert('hereeee')
           $scope.weekends.push(new Date(holidaydata.recurringdateselected));

        }
          console.log($scope.weekends);
          console.log(holidaydata)
          var obj = {dates : $scope.weekends,locationID: holidaydata.locationID};
             /*JWTTOKEN.requestFunction('POST','machinecalendars/addRecurringHolidays',obj).then(function(holidayResult){
                   alert('Holidays added !!!!')
                    $mdDialog.hide();
                
              });*/
          holidaydata.type = 'RECURSIVE';
          holidaydata.from = undefined;
          holidaydata.to = undefined;
          
          JWTTOKEN.requestFunction('POST','holidays',holidaydata).then(function(res){

              var newItemID=res.data.id;
              obj.holidayID = newItemID;
              JWTTOKEN.requestFunction('POST','machinecalendars/addRecurringHolidays',obj).then(function(holidayMachCalResult){
//                  alert('Holidays Cal added !!!!')
	              JWTTOKEN.requestFunction('GET','holidays?filter[where][id]='+newItemID+'&filter[include]=locationRelation').then(function(holidayResult){
	            	  console.log(holidayResult.data[0]);
	            	  $scope.holidayData.push(holidayResult.data[0]);
		            $scope.holiday={};
		              alert('Holidays added !!!!');
		              $mdDialog.hide();
		          });
              });
	        },function(err){
	         
	      });
          /*MachineCalendar.addRecurringHolidays(obj)
          	.$promise
        		.then(function(res) {
        			console.log(res);
        			$mdDialog.hide();
        		});*/
        }
      }
      
     /*cancel function*/
      var cancelFun=function(fun,data)
      {
        console.log(fun);
        console.log(data);
        if(fun=='edit')
        {
          angular.copy($scope.original, $scope.locationEdit);       
        }
        else if(fun=="add")
        {
           //$(".projectAddForm")[0].reset();
           $scope.holiday="";
        }
        $mdDialog.hide();
      }//cancelFun ends

      $scope.cancel=function(fun,data)
      {

        console.log(fun);
        cancelFun(fun,data);
      }

      /*update pop up*/

        $scope.updatePopup=function()
      {
        console.log('updatePopup');
        console.log($scope.selecteddata);
        console.log($scope.selecteddata[0]);
        initPopup();
        
        $scope.holidayEdit = $scope.selecteddata[0];
        console.log($scope.holidayEdit.year);
        if ($scope.holidayEdit.type === 'BLACKOUT') {
        	return false;
        }
        if ($scope.holidayEdit.type === 'RECURSIVE') {
        	$scope.holidayEdit.year = $scope.holidayEdit.year.year;
		    $scope.weekdays.forEach(function(weekday) {
		    	weekday.selected = false;
		    	$scope.holidayEdit.recursiveDays.forEach(function(recursiveDay) {
		    		if (weekday.name === recursiveDay.name) {
		    			weekday.selected = true;
		    		}
		    	});
		    	
		    });
        }
        
		angular.copy($scope.selecteddata[0],$scope.original);

        $scope.editRead=true;
        $scope.dateDisable=true;
        $scope.selectdisabled=true;
        $scope.buttonText='Edit';
        $scope.selecteddata=[];
        
        $scope.holidayEdit.from = new Date($scope.holidayEdit.from);
        $scope.holidayEdit.to = new Date($scope.holidayEdit.to);
        
        $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                contentElement: '#editDialogholiday'
              });//$mdDialog show
      }
     
       //////edit button//////////////////
      $scope.updateholidayclick=function(data,invalid,button)
      {
        console.log('updateholidayclick');
        if(button=="Edit")
        {
          $scope.buttonText='Save';
          $scope.editRead=false;
          $scope.dateDisable=false;
          $scope.selectdisabled=false;
        }
        else
        {
          console.log('update' + invalid);
          if(invalid==false)
          {
            // holidayFactory
            // .updateholiday(data)
            // .then(function(response){
                //$(".projectEditForm")[0].reset();
        	  	if (data.type === 'RECURSIVE') {
        	  		data.recursiveDays = $filter('filter')($scope.weekdays, { selected: true });
        	  		data.year = {'year' : data.year};
        	  		Holiday.machinecalendar.destroyAll({id: data.id});
        	  	}	else {
        	  		if (!$scope.validateDate(data.from, data.to)) {
        	  			return false;
        	  		}
        	  	}
        	  	
                 JWTTOKEN.requestFunction('PUT','holidays/'+data.id,data).then(function(res){
                  
                  data.from = $filter('date')(Date.parse(data.from), 'yyyy-MM-dd');
                  data.to = $filter('date')(Date.parse(data.to), 'yyyy-MM-dd');
                $mdDialog.hide();
              },function(err){
                console.log(err);  
              });
        	  
          }
        }       
      }
      
    /*$scope.updateholidayclick = function(holiday, invalid, button) {
    	if(button=="Edit") {
          $scope.buttonText='Save';
          $scope.editRead=false;
          $scope.dateDisable=false;
          $scope.selectdisabled=false;
        } else {
          console.log('update');
          if(invalid==false) {
	    	holiday
	        	.$save()
	            .then(function(res)  { console.log("Updated") })
	            .catch(function(req) { console.log("error saving process obj"); });
          }
        }
    };*/

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
             // holidayFactory
              JWTTOKEN.requestFunction('POST','mastertickets/massDelete',{idarray:idArray,modelname:'holiday'});
             // .massDeleteholiday(idArray);
                    
                  var ListArray=$scope.holidayData;
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

       $scope.deleteFunction=function(ev)
      {
        console.log('deletelist');
        console.log($scope.selecteddata);
         console.log($scope.selecteddata[0]);
         var title='Are you sure to delete this item?';
         var text='';
         /*var confirm = $mdDialog.confirm()
         .title(title)
         .textContent("")
         .ariaLabel('Lucky day')
         .targetEvent(ev)
         .ok('Ok')
         .cancel('Cancel');

     $mdDialog.show(confirm).then(function() {
         console.log('ok');
//         Holiday.machinecalendars.destroyAll({id: $scope.selecteddata[0].id});
         $scope.machCals = Holiday.machinecalendars({
        	  id: $scope.selecteddata[0].id,
        	  filter: {
        	    where: { id: $scope.selecteddata[0].id}
        	  }
        	});
         Holiday.deleteById({
        	    id: $scope.selecteddata[0].id
        	  })
        	  .$promise
        	  .then(function() {
        	    console.log('deleted');
        	    var ListArray = $scope.holidayData;
                var index = ListArray.indexOf($scope.selecteddata[0]);
                ListArray.splice(index, 1);
        	  });
         console.log($scope.machCals);
     }, function() {
         console.log('cancel');
         
     });*/
         
         dialogFactory.confirmAlert(ev,title,text,function(status){
            if(status=="OK"){
//            	Holiday.machinecalendar.destroyAll({id: $scope.selecteddata[0].id});
              // holidayFactory
              //       .removeholiday($scope.selecteddata[0])
              //       .then(function(response){
                if ($scope.selecteddata[0].type ==  "BLACKOUT")
                  var selectedURL='holidays/'+$scope.selecteddata[0].MachineID;+'/machinecalendar2'
                else
                    var selectedURL='holidays/'+$scope.selecteddata[0].id+'/machinecalendar';

                  console.log(selectedURL);
                
                      //JWTTOKEN.requestFunction('DELETE','holidays/'+$scope.selecteddata[0].id + '/machinecalendar').then(function(response){
                        JWTTOKEN.requestFunction('DELETE',selectedURL).then(function(response){
                       
                        console.log(response)
                    	  JWTTOKEN.requestFunction('DELETE','holidays/'+$scope.selecteddata[0].id).then(function(res){
                    		  var ListArray=$scope.holidayData;
                                var index = ListArray.indexOf($scope.selecteddata[0]);
                                ListArray.splice(index, 1);

                    	  });
                      });
//            	Holiday.machinecalendars.destroyAll({id: })
            }
            else{
              console.log('Canceled');
            }
         });
          
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

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
      //***************************************SET HARTHAL DAY FOR MULTIPLE LOCATIONS**************************//
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
         ////////////////////headingList/////////////////////////
    /*$scope.headingArray=[
                          {"title":"Location" ,"model":'holiday'},
                          {"title":"Date"}
                        ];*/
    ///////////////////////////////////////////////////////
 dateFormatting=function(date)
  {
  
  //////////////////////////////////
 var date = new Date(date);
                      var dd = date.getDate();
                      var mm = date.getMonth()+1; //January is 0!

                      var yyyy = date.getFullYear();
                      if(dd<10){
                          dd='0'+dd;
                      } 
                      if(mm<10){
                          mm='0'+mm;
                      } 
                      //var today = dd+'-'+mm+'-'+yyyy;
                      var date=yyyy+'-'+mm+'-'+dd;
                  //    console.log(date);
                      return date;
///////////////////////////////////////
}
$scope.harthalPopup=function()
      {

        localStorage.removeItem('machineCaledarAll');
        localStorage.removeItem('machineCaledarOnDate');
        console.log('addPopup click');
        $mdDialog.show({
          contentElement: '#addDialogharthal',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      }
      $scope.workcenterID=[];
 // var workcenterIDs=[];
 var check=false;
      $scope.setHarthalDay=function(data)
      {
        console.log(data);
        check=data.check;
        var date=dateFormatting(data.date);

        for(var i=0;i<data.locationID.length;i++)
        {
          getMachineEvents(data.locationID[i].id,data.locationID.length-1,i,date);
        }
      }


     getMachineEvents=function(locationID,length,iteration,date)
     {
        JWTTOKEN.requestFunction('GET','workcentervendors?filter[where][deletedStatus]=false&&filter[include][machinecalendar]&&filter[where][locationID]='+locationID).then(function(workcentervendors){
               //get all machine calendar on picked date from the data
               var localStorageData=[] ,localStorageDataOnDate =[];
               if(localStorage["machineCaledarAll"]!=undefined  )
               {
                console.log('if(localStorage["machineCaledarAll"]!=undefined)')
                 localStorageData =JSON.parse(localStorage["machineCaledarAll"]);
               }
               if(localStorage["machineCaledarOnDate"]!=undefined)
               {
                 localStorageDataOnDate =JSON.parse(localStorage["machineCaledarOnDate"]);
               }
               console.log(localStorageData)
              localStorageData=localStorageData.concat(workcentervendors.data);
              localStorage["machineCaledarAll"]=JSON.stringify(localStorageData);

               if(length==iteration)
               {
                      if(localStorage["machineCaledarAll"]!=undefined)
                      {
                          var data=JSON.parse(localStorage["machineCaledarAll"]);
                          var tempData={};
                          var tempDataOnDate={};
                              
                            for(var i=0;i<data.length;i++)
                            {
                              for(var j=0;j<data[i].machinecalendar.length;j++)
                              {
                                tempData[data[i].machinecalendar[j].id]=data[i].machinecalendar[j];
                                //filter out machine events from localstorage having date equal to selected date from UI
                                if(data[i].machinecalendar[j].date.toString().split('T')[0]==date && data[i].machinecalendar[j].status=="booked")
                                {
                                   tempDataOnDate[data[i].machinecalendar[j].id]=data[i].machinecalendar[j];
                                }

                                if(data.length-1==i && j==data[i].machinecalendar.length-1)
                                {
                                  localStorage["machineCaledarAll"]=JSON.stringify(tempData);
                                  localStorage["machineCaledarOnDate"]=JSON.stringify(tempDataOnDate);
                                  console.log(tempData)
                                  console.log(tempDataOnDate)
                                  PostponeEvents(tempDataOnDate,tempData);
                                }
                              }
                              if(data.length-1==i)
                              {
                                  localStorage["machineCaledarAll"]=JSON.stringify(tempData);
                                  localStorage["machineCaledarOnDate"]=JSON.stringify(tempDataOnDate);
                                  console.log(tempData)
                                  console.log(tempDataOnDate)
                                   var length_tempDataOnDate=Object.keys(tempDataOnDate).length;
                                   console.log(length_tempDataOnDate)
                                  if(length_tempDataOnDate==0)
                                  {

                                    alert('No events existing on selected Date!!!')
                                  }
                                  else
                                  { 
                                    PostponeEvents(tempDataOnDate,tempData);
                                  }

                                
                              }
                          }
                    }
               }
            });

     }
    

    PostponeEvents=function(tempDataOnDate,tempData)
    {
         var length=Object.keys(tempDataOnDate).length;
      if(localStorage["machineCaledarAll"]!=undefined)
       {
        
         var i=0;

          for (var key in tempDataOnDate) 
          {
            i++;
            var data =JSON.parse(localStorage["machineCaledarAll"]);
           var result= AllotNextAvailableDay(data,tempDataOnDate[key].date,tempDataOnDate[key].machineID,tempDataOnDate[key].id,i,length);

           if(result)
           {
              //alert('HERE')
              var data =JSON.parse(localStorage["machineCaledarAll"]);
              var iteration=0;
                var length_=Object.keys(data).length;
                console.log(length_)
              for (var key in data) 
              {
                JWTTOKEN.requestFunction('PUT','machinecalendars/'+data[key].id,{date:data[key].date}).then(function(resultput){
                        console.log(resultput);
                       
                       console.log(data[key])
                       var processTicketID=data[key].processTicketID;
                           JWTTOKEN.requestFunction('GET','machinecalendars?filter[where][processTicketID]='+processTicketID).then(function(res){
                            if(res.length!=0)
                            {
                              var data=res.data;
                               data.sort(GetSortOrder("date"));
                                var data_obj={actualstartdate : data[0].date ,actualenddate: data[data.length-1].date};  
                                console.log(data_obj)
                                JWTTOKEN.requestFunction('PUT','processtickets/'+processTicketID,data_obj).then(function(res_processticket){
                                     //UPDATE MASTERTICKETS DATE RANGE
                                     console.log(iteration)
                                    iteration++;
                                     if(length_==iteration)
                                     {
                                         localStorage.removeItem('machineCaledarAll');
                                         localStorage.removeItem('machineCaledarOnDate');
                                         alert('All machine events postponed!!!!');
                                     }   
                                });
                            }
                        
                      });
                       

                      
                      });
              }
           }
         //  console.log(tempDataOnDate[key])
          /*  var date=addOneDay(tempDataOnDate[key].date);
            var result= checkBlackOutHoliday(date,tempDataOnDate[key].machineID);
            if(result==false)
            {
              alert('try next day');
              var result= checkBlackOutHoliday(date,tempDataOnDate[key].machineID);
            }
            else
            {
              alert('save')
            }
            console.log(result);*/
          //  var overloadResult= checkOverLoad(date,tempDataOnDate[key].machineID);

          }
        }
    }
function GetSortOrder(prop) {  
    return function(a, b) {  
        if (a[prop] > b[prop]) {  
            return 1;  
        } else if (a[prop] < b[prop]) {  
            return -1;  
        }  
        return 0;  
    }  
}

 AllotNextAvailableDay=function(data,date,machineID,machinecalendarID,i,length)
 {
           var date=addOneDay(date);
            var result= checkBlackOutHoliday(data,date,machineID,machinecalendarID);
            if(result.status==false)
            {
              alert('check next day')
              date=addOneDay(date);
              console.log('NEW DATE'+date);
              AllotNextAvailableDay(data,date,machineID,machinecalendarID,i,length);
            }
            else
            {
               var data =JSON.parse(localStorage["machineCaledarAll"]);
               data[result.machinecalendarID].date=result.date;
               localStorage["machineCaledarAll"]=JSON.stringify(data);
               alert('save');
               if(i==length)
               {
                return true;
               }
               console.log(JSON.parse(localStorage["machineCaledarAll"]));

            }
            console.log(result);

 }


  addOneDay=function(ActualDate)
  {
    var date=new Date(ActualDate);
     date.setDate(date.getDate() + 1);
     var dateNew=new Date(date).toISOString();
     var splited=dateNew.split('T');
      date=splited[0].concat('T00:00:00.000Z');
      console.log('returning date ' + date)
      return date;

  }



  checkBlackOutHoliday=function(data,date,machineID,machinecalendarID)
  {
    var count=0;
      /*if(localStorage["machineCaledarAll"]!=undefined)
       {*/
         //var data =JSON.parse(localStorage["machineCaledarAll"]);
         var length=Object.keys(data).length;
          for (var key in data) 
          {
            if(data[key].machineID==machineID && data[key].date==date)
            {
              console.log('here')
              if(data[key].status=="blackout" || data[key].status=="holiday")
              {
                return {"status":false,"machinecalendarID" :undefined ,"date":undefined};
              }
              else
              {
                return {"status":true,"machinecalendarID" :machinecalendarID ,"date":date};
              }
            }
            else
            {
              count++;
              if(count==length)
              {
                return {"status":true,"machinecalendarID" :machinecalendarID ,"date":date};

              }
            }
          }
      /* }
       else
       {
        return true;
       }*/
  }

   checkOverLoad=function(date,machineID)
   {
    console.log('called');
    console.log(date);
    console.log(machineID);
    return false;

   }
      

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
      //***************************************END OF SET HARTHAL DAY FOR MULTIPLE LOCATIONS*******************//
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////


      

}]);