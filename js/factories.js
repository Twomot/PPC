/*function JWTTOKEN(methodName,modelName,$http,appConfig)
{
  console.log('JWTTOKEN');
  console.log(methodName);
  console.log(modelName);
  return $http({
        method :methodName,
        headers: {'Authorization': 'Bearer '+appConfig.token},
        url:appConfig.baseUrl+modelName+'?filter[include]=processes',
        'Content-Type':'application/x-www-form-urlencodded'
       }).success(function(data, status,callback){
          console.log(data);
          return data;
          //deffered.resolve(data);
       }).error(function(data, status) {
            alert("errr");
  });
}*/
//var tokenData = sessionStorage.getItem("token");

angular.module('app.factories', [])


//-----------------------Process Tickets---------------------------
/*Author : Prasad
Date:Feb-7-2017
*/
.factory('ProcessTktDataOp', ['JWTTOKEN', function (JWTTOKEN) {

    var ProcessTktDataOp = {};

    ProcessTktDataOp.getProcess = function (Process) {
 JWTTOKEN.requestFunction('GET','processtickets/'+Process.id).then(function(processTktResult){
        return processTktResult;});
    };

    ProcessTktDataOp.addProcess = function (Process) {
      var arrayNew = [];
      arrayNew[0] =Process;
      console.log(arrayNew);
      JWTTOKEN.requestFunction('POST','processtickets/insertAProcessTicket', {attributes:arrayNew}).then(function(processTktResult){
        return processTktResult;});
    };
    ProcessTktDataOp.updateProcess = function (Process) {
       JWTTOKEN.requestFunction('PUT','processtickets/'+Process.id, Process).then(function(processTktResult){
        return processTktResult;});
    };
    return ProcessTktDataOp;

}])
//-----------------------Master Key Values---------------------------
/*Author : Prasad
Date:Feb-7-2017
*/
.factory('MasterKeyDataOp', ['JWTTOKEN','$q', function (JWTTOKEN,$q) {

    var MasterKeyDataOp = {};
var deferred = $q.defer();
    MasterKeyDataOp.getWorkcenters = function () {
 JWTTOKEN.requestFunction('GET','workcenters/').then(function(workcenters){
        console.log(workcenters);
      deferred.resolve(workcenters);
        //return workcenters;
        return deferred;
      });
    };

    return MasterKeyDataOp;
   // return MasterKeyDataOp;

}])
//-------------------------------------------------
.factory('myService',['JWTTOKEN','$q', function(JWTTOKEN,$q) {

  return {

    myObject: {},

    getWorkCenters: function() {
      // Create the deffered object
      var deferred = $q.defer();
console.log(this.myObject.workcenters);

     // if(!this.myObject) {
       if(this.myObject.workcenters == undefined) {
        console.log('making request');
        // Request has not been made, so make it
       JWTTOKEN.requestFunction('GET','workcenters').then(function(MasterKeyResult){
        deferred.resolve(MasterKeyResult);
    });
        // Add the promise to myObject
        this.myObject.workcenters = deferred.promise;
      }

      // Return the myObject stored on the service
      return this.myObject;

    },



getUOMs: function() {
      // Create the deffered object
      var deferred = $q.defer();
console.log(this.myObject.UoMs);

     // if(!this.myObject) {
       if(this.myObject.UoMs == undefined) {
        console.log('making request');
        // Request has not been made, so make it
       JWTTOKEN.requestFunction('GET','UoMs').then(function(MasterKeyResult){
        deferred.resolve(MasterKeyResult);
    });
        // Add the promise to myObject
        this.myObject.UoMs = deferred.promise;
      }
return this.myObject;

    },//end of get UOM

getLocation: function() {
      // Create the deffered object
      var deferred = $q.defer();
console.log(this.myObject.UoMs);

     // if(!this.myObject) {
       if(this.myObject.Locations == undefined) {
        console.log('making request');
        // Request has not been made, so make it
       JWTTOKEN.requestFunction('GET','Locations').then(function(MasterKeyResult){
        deferred.resolve(MasterKeyResult);
    });
        // Add the promise to myObject
        this.myObject.Locations = deferred.promise;
      }
return this.myObject;

    }//end of get Location




  }

}])
//----------------------------------------------------
.factory('$localStorage', ['$window', function($window) {
        'use strict';
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            remove: function(key) {
                delete $window.localStorage[key];
            },
            clear: function() {
                $window.localStorage.clear();
            }
        };
    }])

 
.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})


.service('sharedProperties', function (JWTTOKEN,$filter,$q) {
        var property = 'First';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },
            //for schedulemachine home.js 

            schedulemachine:function($scope)
            {
              $scope.showTab=false;
              console.log(machineArray);
              var normalmachine=$scope.normalmachine;
                for(var key in machineArray)
                {
                    for(var i=0;i<machineArray[key].length;i++)
                    {
                      normalmachine.push(machineArray[key][i].date)
                    }
                    $scope.machine=machineArray[key][0].details;

                  
                }

                $scope.processtartDate=startDate;
                $scope.processEndDate=endDate;
                setDuration($scope);
              },
              getVendors: function($scope) {
                   console.log('service invokled');
                   console.log($scope.workCenterID);

                   console.log('gettttttttttt')
                   // console.log($scope.workCenterID)
                    var s=localStorage['machineEventsDraft'];
                    console.log(s)
                    if(s!=undefined)
                    {
                        var machineEventsDraftFull = JSON.parse(localStorage['machineEventsDraft']);
                        console.log(machineEventsDraftFull)
                        //console.log($scope.workCenterID)
                        var event=machineEventsDraftFull[$scope.workCenterID];
                        console.log(event)
                        //var vendor
                        var size=Object.keys(event).length;
                        var uniqueVendors=[];
                        for(var key in event)
                        {
                          uniqueVendors.push(event[key].workcentervendor.vendorID);
                        }
                        console.log(uniqueVendors)
                       // var unique = uniqueVendors.filter( this.onlyUnique );
                       var unique=$filter('unique')(uniqueVendors);
                         console.log(unique)
                         //getvendordetails(unique);
                         getvendordetails(unique,function(returnResult){
                            console.log(returnResult);
                            $scope.machines=returnResult.machines;
                            $scope.vendors=returnResult.vendors;
                         })
                  }
                  else
                  {

                    console.log('$scope.processticket............');
                  // console.log($scope.processticket);
                     getMachineEventsFromserver($scope.workCenterID,"addView",undefined,$scope,function(machineevents)
                      {
                        console.log(machineevents)
                        var machineEventsDraft={};
                            machineEventsDraft[$scope.workCenterID]={}
                           for(var j=0;j< machineevents.data.length;j++)
                           {  
                              // machineevents.data[j.events="";   

                             machineEventsDraft[$scope.workCenterID][machineevents.data[j].id]= machineevents.data[j];
                              if(machineevents.data[j].machinecalendar.length>0)
                              {
                                    for(var i=0;i< machineevents.data[j].machinecalendar.length;i++)
                                    {
                                      machineEventsDraft[$scope.workCenterID][machineevents.data[j].id][machineevents.data[j].machinecalendar[i].id]=machineevents.data[j].machinecalendar[i];
                                    }               
                               }
                           }
                          console.log(machineEventsDraft);
                          localStorage['machineEventsDraft']=JSON.stringify(machineEventsDraft);
                          var machineEventsDraftFull = JSON.parse(localStorage['machineEventsDraft']);
                        console.log(machineEventsDraftFull)
                        var event=machineEventsDraftFull[$scope.workCenterID];
                        //var vendor
                        var size=Object.keys(event).length;
                        var uniqueVendors=[];
                        for(var key in event)
                        {
                          uniqueVendors.push(event[key].workcentervendor.vendorID);
                        }
                        console.log(uniqueVendors)
                        //var unique = uniqueVendors.filter( this.onlyUnique );
                       var unique=$filter('unique')(uniqueVendors);
                         console.log(unique);
                         //var returnResult=getvendordetails(unique);
                         getvendordetails(unique,function(returnResult){
                            console.log(returnResult);
                            $scope.machines=returnResult.machines;
                            $scope.vendors=returnResult.vendors;
                         })
                         
                         //myfunc();

                      });

                  }


            },

            getScheduleView:function(workCenterID,$scope){
              console.log('workCenterID.............');

                console.log(workCenterID);
               // alert(workCenterID)
                  //Here GET machines api is just called to reflect changes on ganttscheduler immediately .
                  //api response data not used here 
                  JWTTOKEN.requestFunction('GET','machines').then(function(uom){
                  var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
                  console.log(jobTreeDraft);
                  var machineEventsDraft={};
                  var  currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];

                 var workcenterVendorID=undefined;
                      // if(workCenterID=="QC" && currentJoborderDetailsDraft.processes[$scope.ganttid].justAddedByPlanner==true)
                      // {
                        //console.log($scope.ganttid);
                        //console.log(currentJoborderDetailsDraft.processes[$scope.ganttid]);
                      /*if(workCenterID=="QC")
                      {
                        workcenterVendorID=currentJoborderDetailsDraft.processes[$scope.ganttid].machineID;
                      }*/
                 
                    machineEventsDraft_get= localStorage['machineEventsDraft'];

                     if(machineEventsDraft_get!=undefined)
                     {
                      console.log('ifff');
                         machineEventsDraft=JSON.parse(localStorage['machineEventsDraft']);
                        if(machineEventsDraft[workCenterID]==undefined)
                        {
                          getMachineEventsFromserver(workCenterID,"addView",workcenterVendorID,$scope,function(machineevents)
                          {
                             machineEventsDraft[workCenterID]={}
                             for(var j=0;j< machineevents.data.length;j++)
                             {  
                                   //  machineevents.data[j.events="";        
                               machineEventsDraft[workCenterID][machineevents.data[j].id]=machineevents.data[j];
                                if(machineevents.data[j].machinecalendar.length>0)
                                {
                                      for(var i=0;i< machineevents.data[j].machinecalendar.length;i++)
                                      {
                                        machineEventsDraft[workCenterID][machineevents.data[j].id][machineevents.data[j].machinecalendar[i].id]=machineevents.data[j].machinecalendar[i];
                                      }               
                                 }
                             }
                            console.log(machineEventsDraft);
                            localStorage['machineEventsDraft']=JSON.stringify(machineEventsDraft);
                          //  var machineevents=  displayScheduler(workCenterID,"schedulerView");
                                displayScheduler(workCenterID,"schedulerView",$scope).then(function(result) {
                                 // alert("got result 2121")

                                   $scope.eventsData= result;
                                   console.log( $scope.eventsData)
                                });

                                  
                          });
                        }
                        else
                        {
                         /*var machineevents=   displayScheduler(workCenterID,"schedulerView");
                                   $scope.eventsData = machineevents;*/
                                      displayScheduler(workCenterID,"schedulerView",$scope).then(function(result) {
                                 //  alert("got result 2135")

                                   $scope.eventsData= result;
                                   console.log( $scope.eventsData)
                                });
                        }          
                     }
                     else 
                     {
                        getMachineEventsFromserver(workCenterID,"addView",workcenterVendorID,$scope,function(machineevents)
                        {
                            machineEventsDraft[workCenterID]={}
                             for(var j=0;j< machineevents.data.length;j++)
                             {  
                               machineEventsDraft[workCenterID][machineevents.data[j].id]= machineevents.data[j];
                                if(machineevents.data[j].machinecalendar.length>0)
                                {
                                      for(var i=0;i< machineevents.data[j].machinecalendar.length;i++)
                                      {
                                        machineEventsDraft[workCenterID][machineevents.data[j].id][machineevents.data[j].machinecalendar[i].id]=machineevents.data[j].machinecalendar[i];
                                      }               
                                 }
                             }
                            localStorage['machineEventsDraft']=JSON.stringify(machineEventsDraft);
                               displayScheduler(workCenterID,"schedulerView",$scope).then(function(result) {
                                  //  alert("got result 2160")
                                    console.log(result)
                                   $scope.eventsData= result;
                                   console.log( $scope.eventsData)
                                });
                          /* var machineevents=   displayScheduler(workCenterID,"schedulerView");
                                  $scope.eventsData = machineevents;*/
                        });
                     }
                   });
              },//ends getScheduleView

              //---------------------------------function calcualteEndDate------------------------------------------------//
//This function is called to get the end date by skipping black out and holiday by using 
//a start date ,duration
//Following Functions are called inside this 
//1 . getHolidayForAMachine
//2 . isHoliday

//This function is called from the following functons
//1 . "updateMachineEventsNew"
//2 . app.scheduler.js -- scheduler1.attachEvent("onBeforeLightbox", function (id){ event

/////////////////////////////////////////////
                calcualteEndDate:function(date, duration,machineID)
                 {
                    //-------Feed from Local storage/server API---------------

                  
                    var machineHoliday=getHolidayForAMachine(machineID);
                    var holiday=[];

                    for(var i=0;i<machineHoliday.length;i++)
                    {
                      holiday.push(new Date(machineHoliday[i].date));
                    }

                    console.log('HOLIDAYSSSS')
                    console.log(holiday)
                    var startDate = new Date(date);
                    var endDate = new Date(date), noOfDaysToAdd = duration, count = 0;
                    console.log(noOfDaysToAdd)
                    while (count <= noOfDaysToAdd) {
                      
                      console.log('count')
                      console.log(count)
                      
                        console.log(endDate)
                        if (!isHoliday(endDate, holiday)) {
                              console.log('is not holiday')
                            count++;
                            if(count==noOfDaysToAdd)
                            {
                              endDate.setDate(endDate.getDate()+1)
                              return endDate;
                            }

                        }
                        else
                        {
                          console.log(endDate)
                          console.log('IS HOLIDAY')
                        }
                          endDate.setDate(endDate.getDate()+1)
                    }
                    console.log(endDate)
                  return endDate;
                },//end of calculate
                //---------------------------------function checkblackoutorholidayforCellClick-------------------//
//Called from app.scheduler.js -- scheduler1.attachEvent("onCellClick", event
//To check whether its a holiday ,blackout day when click on a cell from schduler


             checkblackoutorholidayforCellClick:function(date,machineID,cb)
                {
                  console.log(date)
                  console.log(machineID)
                //  date=new Date(date);
                   JWTTOKEN.requestFunction('GET','machinecalendars?filter[where][machineID]='+machineID+'&filter[where][date]='+date).then(function(instance){
                 console.log(instance)
                    if(instance.data.length>0)
                    {
                      if(instance.data[0].status=="holiday" || instance.data[0].status=="blackout")
                      {
                         cb(true);
                      }
                      else
                      {
                        cb(false);
                      }               
                    }
                    else
                    {
                      cb(false);
                    }
                  });  
                },

//---------------------------------end of function checkblackoutorholidayforCellClick-------------------------------------//


//**
//**
//**

//---------------------------------function createmachineCalendar--------------------------------------------//

//This function is calling from app.scheduler.js schedulerreschedule.attachEvent("onEventSave", event
//Following funtions are used inside "createmachineCalendar" functon
//1 . processEventFunction

/*createmachineCalendar:function(id,ev,is_new)
{

  console.log(ev);

  var days=Math.round((ev.end_date-ev.start_date)/(1000*60*60*24));

  console.log(days);
          machineCalendarObj={
              "type":"machine",
              "machineID":machineDetails.id,
              "date":new Date(ev.start_date),
              "processTicketID":$scope.ganttid,
              "workcenterVendorID":machineDetails.workcenterVendorID,
              "status": "booked",
              "deletedStatus": false,
              "usedCapacity":machineDetails.capacity,
              "statusUpdates": [],
              "endDate":ev.end_date,
              "durationData":days
            };

        JWTTOKEN.requestFunction('POST','machinecalendars',machineCalendarObj).then(function(calendarData){
            processEventFunction($scope.ganttid);

        });
}
*/
//---------------------------------end of function createmachineCalendar-------------------------------------//


            
        };//return ends



        //---------------------------------function getHolidayForAMachine-------------------//
//Used to get Holiday for a machine
//This function is called inside "calcualteEndDate" function
//localStorage['holidayBlackOutDays'] are getting loaded when logged in as an authenticated user 


        function getHolidayForAMachine(machineID)
        {
           var  holidayBlackOutDay=[];
           if(localStorage['holidayBlackOutDays']!=undefined)
           {
                var  holidayBlackOutDaysFromLocalstorage = JSON.parse(localStorage['holidayBlackOutDays']);
                console.log(holidayBlackOutDaysFromLocalstorage);
                 if(holidayBlackOutDaysFromLocalstorage[machineID]!=undefined)
                 {
                  if(holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar.length>0)
                  {
                     for(var i=0;i<holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar.length;i++)
                     {
                        holidayBlackOutDay.push({"date" : holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar[i].date ,"status" : holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar[i].status })
                     }
                  }

                 }
           }
           console.log(holidayBlackOutDay);
           
          return holidayBlackOutDay;

       }

//---------------------------------end of function getHolidayForAMachine-------------------------------------//


//**
//**
//**
    //---------------------------------function isHoliday-------------------//
//Used to check whether a date is holiday or not
//This functions is calling from "calcualteEndDate"
//Following functions are called inside  this 
//1 . compare

        function isHoliday(dt, arr){
          console.log(arr);
            var bln = false;
            for ( var i = 0; i < arr.length; i++) {
                if (compare(dt, arr[i])) { //If days are not holidays
                    bln = true;
                    break;
                }
            }
            return bln;
        }


//---------------------------------end of function isHoliday-------------------------------------//


//**
//**
//**

//---------------------------------function compare--------------------------------//
//used to compare Two dates
//This function is called inside "isHoliday" functions

      function compare(dt1, dt2){
        console.log(dt1+"_"+dt2);
        //console.log(dt2)
          var equal = false;
          if(dt1.getDate() == dt2.getDate() && dt1.getMonth() == dt2.getMonth() && dt1.getFullYear() == dt2.getFullYear()) {
              equal = true;
              console.log(equal);
          }
          return equal;
      }

//---------------------------------end of function compare-------------------------------------//


//**
//**
//**

         function getMachineEventsFromserver(workCenterID,type,workcenterVendorID,$scope,cb)
            {
              console.log('getMachineEventsFromserver');
                if(type=="addView")
                {
                  console.log(workCenterID);
                  //workcenterVendorID="WCV_73";//hard coded
                        if($scope.role=="scheduler")
                        {
                          alert('scheduler');
                          var input_Obj={"workCenterID": workCenterID, "userID" : $scope.userID};
                            console.log(input_Obj);
                            //JWTTOKEN.requestFunction('POST','machinecalendars/getMachineExVendorEventsByWorkcenterID',input_Obj).then(function(machineevents){
                           JWTTOKEN.requestFunction('POST','machinecalendars/getMachineExVendorEventsByScheduler',input_Obj).then(function(machineevents){
                              console.log(machineevents); 
                              var filterData=machineevents.data[0].machinecalendar;
                              machineeventsNew=$filter('filter')(filterData, { status: "!rework" });
                              machineevents.data[0].machinecalendar=machineeventsNew;  

                               cb(machineevents);
                            });

                        }
                        else if($scope.role=="qcscheduler")
                        {
                          //alert('scheduler');
                          var input_Obj={"workCenterID": workCenterID, "userID" : $scope.userID};
                            console.log(input_Obj);
                            //JWTTOKEN.requestFunction('POST','machinecalendars/getMachineExVendorEventsByWorkcenterID',input_Obj).then(function(machineevents){
                           JWTTOKEN.requestFunction('POST','machinecalendars/getMachineExVendorEventsByQCScheduler',input_Obj).then(function(machineevents){
                              console.log(machineevents); 
                              var filterData=machineevents.data[0].machinecalendar;
                              machineeventsNew=$filter('filter')(filterData, { status: "!rework" });
                              machineevents.data[0].machinecalendar=machineeventsNew;  

                               cb(machineevents);
                            });

                        }

                        /* else if(workCenterID =="QC" && workcenterVendorID!=undefined)
                        //else if(workCenterID =="QC")
                        {
                          alert('add view workcenterVendorID not undefined')
                            var input_Obj={"workcenterVendorID": workcenterVendorID};
                            console.log(input_Obj);
                         JWTTOKEN.requestFunction('POST','machinecalendars/getMachinesUnderWorkcenterVendor',input_Obj).then(function(machineevents){
                            console.log(machineevents);
                            var filterData=machineevents.data[0].machinecalendar;
                            machineeventsNew=$filter('filter')(filterData, { status: "!rework" });
                            machineevents.data[0].machinecalendar=machineeventsNew; 

                             cb(machineevents);
                          });
                        }*/
                        else
                        {
                          alert('based on workcenter fetch')
                            var input_Obj={"workCenterID": workCenterID};
                            console.log(input_Obj);
                           JWTTOKEN.requestFunction('POST','machinecalendars/getMachineExVendorEventsByWorkcenterID',input_Obj).then(function(machineevents){
                              console.log(machineevents); 
                              var filterData=machineevents.data[0].machinecalendar;
                              machineeventsNew=$filter('filter')(filterData, { status: "!rework" });
                              machineevents.data[0].machinecalendar=machineeventsNew;  

                               cb(machineevents);
                            });
                        }


                  
                }
                else
                {

                      if(workCenterID =="QC" && workcenterVendorID!=undefined)
                        {
                         // alert('qc row clcik')
                          //this api is not invokked ----workworkcenterVendorID is undefined in all cases

                            var input_Obj={"workcenterVendorID": workcenterVendorID};
                         JWTTOKEN.requestFunction('POST','machinecalendars/getMachinesUnderWorkcenterVendor',input_Obj).then(function(machineevents){
                            console.log(machineevents);
                            var filterData=machineevents.data[0].machinecalendar;
                            machineeventsNew=$filter('filter')(filterData, { status: "!rework" });
                            machineevents.data[0].machinecalendar=machineeventsNew; 

                             cb(machineevents);
                          });
                        }
                        else
                        {
                          /////gantt row click api
                            //alert(' row click')
                             var input_Obj={"workCenterID": workCenterID, "processTicketID" :$scope.ganttid };
                         JWTTOKEN.requestFunction('POST','machinecalendars/getMachineExVendorEventsByMachine',input_Obj).then(function(machineevents){
                            console.log(machineevents);   
                            var filterData=machineevents.data[0].machinecalendar;
                            machineeventsNew=$filter('filter')(filterData, { status: "!rework" });
                            machineevents.data[0].machinecalendar=machineeventsNew;

                             cb(machineevents);
                          });
                        }
                  
                }
            }//ends getMachineEventsFromserver

        function getvendordetails(vendorIDS,callback)
            {
              console.log('getvendordetails...')
                   var obj={"vendors" :vendorIDS };
                   JWTTOKEN.requestFunction('POST','vendors/getVendorDetails',obj).then(function(result){
                    result.data=result.data.concat([{"id" : "all" , "name" : "all vendors"},{"id" : "nearestavailable" , "name" : "Filter by Nearest avialable Date"}]);
                      //$scope.vendors=result.data;

                    JWTTOKEN.requestFunction('GET','workcenters?filter[where][name]=QC').then(function(qcworkcenter){

                                  var obj={workCenterID :qcworkcenter.data[0].id  , userID : sessionStorage.getItem("userId")}
                         JWTTOKEN.requestFunction('POST','machinecalendars/getMachinesForQCscheduler',obj).then(function(machines){

                                     console.log(machines)
                                     var resultData={"vendors":result.data,"machines":machines.data}
                                      //$scope.machines=machines.data;
                                      // return resultData;
                                      callback(resultData);

                                   });

                   });
                  });
            }//ends 

          function displayScheduler(workCenterID,type,$scope)
          {

            var textColor= "white";
            var deferred = $q.defer();
            console.log("workcenetrID")
            console.log(workCenterID)
            //console.log($scope.workCenterID)
            //alert("displayScheduler")
            //alert(workCenterID)
              //********************NOTE********************************//
                 //FILTER EVENTS CORRESSPONDING TO LOGGEDIN USER(IF HE IS A SCHDULER) NOT IMPLIMENTED HERE
              //******************************************** 
                var machineEventsDraftFull = JSON.parse(localStorage['machineEventsDraft']);
                var machineEventsDraft=machineEventsDraftFull[workCenterID];
                var machineevents=[];
                var size=  Object.keys(machineEventsDraft).length

                 var schedulerID="";
                 var QcSchedulerID="";
                    var i=0,iteration=0;
                    var k=0;
                     $scope.sections.length=0;
                     $scope.sections2.length=0;
                     //LOAD SCHEDUER VIEW WHEN ADDING PROCESS TICKETS 
                     if(type=="schedulerView")
                     {
                       console.log("hereeee schedulerView")
                          var status="not";
                          for (var key in machineEventsDraft) 
                          {
                             if(machineEventsDraft[key].type=="finalQC")
                             {
                               status="finalqc";
                             }
                             else if(machineEventsDraft[key].type=="invoice")
                             {
                               status="invoice";
                             }
                          }

                        for (var key in machineEventsDraft) 
                        {
                          iteration++;
                          //code by rinsha for external vendor section

                          ////changed for final and invoice unit

                         var labelname=machineEventsDraft[key].name;
                         if(status=="not")
                         {
                          console.log("hereeee not")
                             if(machineEventsDraft[key].type=="External")
                             {
                                labelname=machineEventsDraft[key].vendorRelation.name+'('+machineEventsDraft[key].type+')';
                             }
                             else if(machineEventsDraft[key].type=="Internal")
                             {
                              labelname=machineEventsDraft[key].displayName;
                             }
                             $scope.sections2.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});
                             console.log($scope.sections2)
                         }
                         else if(status=="finalqc")
                         {
                           console.log("hereeee finalqc")
                            if(machineEventsDraft[key].type=="finalQC")
                            {
                              $scope.sections2.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});
                            }
                         }
                         else if(status=="invoice")
                         {
                           console.log("hereeee invoice")
                            if(machineEventsDraft[key].type=="invoice")
                            {
                              $scope.sections2.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});
                            }
                         }
                          
                        }
                     }
                     else
                     {
                       for (var key in machineEventsDraft) 
                        {
                         iteration++;

                        var labelname=machineEventsDraft[key].name;
                        if(machineEventsDraft[key].type=="External")
                         {
                            labelname=machineEventsDraft[key].vendorRelation.name+'('+machineEventsDraft[key].type+')';
                         }
                          $scope.sections.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});
                         //  $scope.sections2.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});

                        }
                     }
                     


                      for (var key in machineEventsDraft) 
                      {
                        i++;
                            for(var key_machinecalendar in machineEventsDraft[key]) 
                            {
                              //WE NEED TO LOAD MACHINE EVENTS FROM ATTRIBUTE NAMED "MACHINECALENDAR's ID" ITSELF
                              //SO FIRST WE NEED TO CHECK THE ATTRIBUTE IS ALPHA NUMERIC OR NOT .ALL MONGO IDs ARE ALPHA NUMERIC 
                              //THIS CHECKING WILL IGNORE name,id etc attributes
                     
                               if (key_machinecalendar.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
                               {
                                          //PROCEED
                                           k++;
                                      ///////////////////////////////////////////////////////////////////////

                                       //display events of current job order in a distinct color from rest of the events.i.e. if u click 
                                       //weaving gantt of a particular job order,events of weaving for that job order shud be displayed in distinct color.
                                         var color;
                                         var masterID="";
                                         var textEvent="";
                                       //  var processTicketID="";
                                         if(machineEventsDraft[key][key_machinecalendar].processticketRelation!=undefined)
                                         {
                                            masterID=machineEventsDraft[key][key_machinecalendar].processticketRelation.masterTicketID;
                                            textEvent=machineEventsDraft[key][key_machinecalendar].processticketRelation.processName;
                                          
                                         }
                                         
                                         if($scope.masterTicketID== masterID)
                                         {
                                            color=$scope.selfColor;

                                            //SET READONLY attribute to "true" for events not part of clicked processticket
                                            //Can only reschedule events corressponding to the ProcessTicket clicked from Gantt
                                            if(machineEventsDraft[key][key_machinecalendar].processTicketID == $scope.ganttid)
                                            {
                                              readonly=false;
                                              type="sameprocess";
                                            }
                                            else
                                            {
                                               type="diffprocess";
                                               readonly=false;
                                            }

                                         }
                                         else
                                         {
                                            readonly=true;
                                            type="diffmaster";
                                            color=$scope.OthersColor;
                                         }
                                         var blackout=false;
                                         
                                         if(machineEventsDraft[key][key_machinecalendar].status=="blackout")
                                         {

                                            blackout=true;
                                            color=$scope.blackOutColor;
                                            textEvent="blackOut";
                                         }
                                         else if(machineEventsDraft[key][key_machinecalendar].status=="holiday")
                                         {
                                            //alert('here')
                                            blackout=true;
                                            color=$scope.holidayColor;
                                            textEvent="Holiday";
                                            readonly=true;
                                         }
                                         var start,end;

                                         //check dates less than today + its status is still pending .Color them in distinct color
                                        // console.log(machineEventsDraft[key][key_machinecalendar].date)
                                        // console.log(new Date(machineEventsDraft[key][key_machinecalendar].date));
                                         var end_date_copy=new Date(machineEventsDraft[key][key_machinecalendar].endDate);              
                                         end_date_copy.setHours(24)
                                         console.log(end_date_copy)
                                         if(end_date_copy <new Date() && machineEventsDraft[key][key_machinecalendar].status=="booked")
                                         {
                                            console.log('DATE LESS THAN TODAY');
                                            //start=new Date();
                                            //end=new Date();
                                            start=new Date().setHours(0,0,0,0);
                                            end=new Date().setHours(24,0,0,0);

                                            color=$scope.previousEventsColor;
                                            readonly=false;
                                            previousEventStatus=true;
                                            textColor= "black";
                                         }
                                         else
                                         {
                                            console.log(machineEventsDraft[key][key_machinecalendar].date)
                                             console.log(machineEventsDraft[key][key_machinecalendar])
                                            start=new Date(machineEventsDraft[key][key_machinecalendar].date);
                                            end= new Date(machineEventsDraft[key][key_machinecalendar].endDate);
                                            if(blackout)
                                            {
                                               var start_date_copy=new Date(machineEventsDraft[key][key_machinecalendar].date);
                                               start_date_copy.setHours(24)
                                               end= start_date_copy;                     
                                            }
                                            previousEventStatus=false;
                                              console.log(start); console.log(end);

                                         }

                                       
                                         //****************************************************************************//
                                         ////////////////////////////////////////////////////////////////////////////////
                                         //if logged in planner is not this masterticket's plant's planner . Then 
                                         //dont allow him drag the events under masterticket
                                         if($scope.role!="ownerplanner")
                                         {    
                                            readonly=true;
                                            console.log('not ownerplanner')
                                          //  alert('not ownerplanner')
                                         }
                                        
                                         ///////////////////////////////////////////////////////////////////////////////
                                         //****************************************************************************//
                                          
                                           //***********************************************************************************//
                                         ///////////////////////////////////////////////////////////////////////////////////////
                                         //ONLY SCHEDULER OF EVENT'S WORKCENTERVENDOR CAN DRAG MACHINE EVENTS FROM SCHEDULER
                                         //IF THE LOGGEDIN USER IS NOT THE MACHINE EVENTS SCHEDULER THEN SET THAT EVENT'S 
                                         //READONLY STATUS TRUE . 
                                         console.log(machineEventsDraft[key]);
                                          var accessstatus=checkEventAccessebility(machineEventsDraft[key].workcentervendor,workCenterID);
                                          console.log(accessstatus)
                                          readonly=accessstatus;
                                          //alert(accessstatus)
                                          if(accessstatus)
                                          {
                                             color=$scope.readonlycolor;
                                          }
                                         ///////////////////////////////////////////////////////////////////////////////////////
                                         //***********************************************************************************//


                                       //CREATE NEW MACHINE EVENT OBJECT
                                           var machineeventNew={ 
                                                  id :machineEventsDraft[key][key_machinecalendar].id,
                                                  start_date: start,
                                                  end_date: end,
                                                  startdate_temp:start,
                                                  text:textEvent,
                                                  section_id:i,
                                                  blackout:blackout,
                                                  color:color ,
                                                  machineid:machineEventsDraft[key].id ,
                                                  processTicketID:machineEventsDraft[key][key_machinecalendar].processTicketID,
                                                  masterTicketID:masterID,
                                                  readonly:readonly,
                                                  workcenterID:workCenterID,
                                                  previousEventStatus:previousEventStatus,
                                                  machinecalendarID:machineEventsDraft[key][key_machinecalendar].id,
                                                  textColor:textColor
                                                };
                                                console.log(machineeventNew)

                                             machineevents.push(machineeventNew);              
                               }      
                          }

                            console.log(machineevents) 
                          deferred.resolve(machineevents);
                      }
                      
                      // deferred.resolve(machineevents);
                    //return workcenters;
                    return deferred.promise;
                   // return machineevents;

                 //FILTER EVENTS CORRESSPONDING TO LOGGEDIN USER(IF HE IS A SCHDULER)
            }
//---------------------------------end of function displayScheduler----------------------------------//


//---------------------------------function checkEventAccessebility-------------------//
//Used to check whether logged in user can reschedule events loaded on schduler view

      var checkIfRoleEnabled = function(roleObj, userId,type){

          for(var i=0;i<roleObj.length;i++)
          {
            var checkObj=roleObj[i].schedulerID;
            if(type=="QC")
            {
              checkObj=roleObj[i].QCSchedulerID;
            }
            if(checkObj==userId)
            {
              return true
              break;
            }
            else
            {
              return false;
            }
          }

  
}

function checkEventAccessebility(workcentervendor,workcenterID)
{
  console.log(workcentervendor);
 
  /*if(workcentervendor.type=="internal")
  {*/
  if(workcentervendor.type.toLowerCase()=="internal")
  {
     if(sessionStorage.getItem('role')=="scheduler" && workcenterID!="QC" && workcenterID!="finalQC")
      {
        checkIfRoleEnabled(workcentervendor.schedulerID,$scope.userID);
        /*if(sessionStorage.getItem('userId')==workcentervendor.schedulerID[0].schedulerID)
        {
          
          return false;
        }
        else
        {
          return true;
        }*/
      }
      else if(sessionStorage.getItem('role')=="qcscheduler" && (workcenterID=="QC" || workcenterID=="finalQC"))
      {
        checkIfRoleEnabled(workcentervendor.QCSchedulerID,$scope.userID,"QC");
        /*if(sessionStorage.getItem('userId')==workcentervendor.QCSchedulerID)
        {
          return false;
        }
        else
        {
          return true;
        }*/
      }
      else
      {
        return true;
      }
  }
  else
  {
    console.log("EXTERNLA")
    return checkExternalWorkcenterVendorScheduler(workcentervendor,$scope);
  }
 
}

//-----------------------------end of function checkEventAccessebility-------------------------------------//

//---------------------------------function checkExternalWorkcenterVendorScheduler-------------------//
//calling from the function "checkEventAccessebility"
//each external workcentervendor can have a schedulerID like this  [{"plant":"AXO1" , "schedulerID":"58b10f05920053042fc901dd"}]
//so we need to test whether loggedin  user is the of the external workcenter vendor's schduler
//get clicked processticket's masterticket's plant id == JobOrderPlantID
//get item from external workcentervendor's schedulerID object where  [{"plant":"JobOrderPlantID" , "schedulerID":"LoggedinUserID"}]
//if there is not item like this  , never allow loogedin user to schdule ,movemachine for him .
    function checkExternalWorkcenterVendorScheduler(workcentervendor,$scope)
    {

          var schedulerID=workcentervendor.schedulerID;
           var jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);

              var  plant=jobTreeOriginal[$scope.masterTicketID].plant;
              console.log(plant)
              var count=0;
              console.log(sessionStorage.getItem('userId'))
        for(var i=0;i<schedulerID.length;i++)
        {
          console.log(schedulerID[i].plant)
          console.log(schedulerID[i].schedulerID)
          if(schedulerID[i].plant==plant && schedulerID[i].schedulerID==sessionStorage.getItem('userId'))
          {
            count++;
          }
          if(i==schedulerID.length-1)
          {
            console.log("here")
            if(count>0)
            {
              console.log("count>0")
              return false;
            }
            else
            {
              console.log("count=0")
              return true;
            }
          }
        }
        if(schedulerID.length==0)
        {
          return true;
        }
     
    }




 //---------------------------------end of function checkExternalWorkcenterVendorScheduler-------------------------------------//

//**
//**
//**
///setDuration on schedule button click after scheduling events

function setDuration($scope) {
    if ($scope.processEndDate && $scope.processtartDate) {
      var miliseconds = $scope.processEndDate - $scope.processtartDate;
      var seconds = miliseconds/1000;
      var minutes = seconds/60;
      var hours = minutes/60;
      var days = hours/24;
      console.log(days);
      $scope.processticket.duration = days;
    }
  }

        
    })



    .directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  };
})


.factory('dialogFactory', ['$state','$mdDialog', function($state,$mdDialog) {
        'use strict';
        return {
          confirmAlert:function(ev,title,textContent,callback){
            // var status;
            console.log('confirmAlert');
                var confirm = $mdDialog.confirm()
                      .title(title)
                      .textContent(textContent)
                      .ariaLabel('Lucky day')
                      .targetEvent(ev)
                      .ok('Ok')
                      .cancel('Cancel');

                $mdDialog.show(confirm).then(function() {
                  console.log('ok');
                  callback('OK');

                }, function() {
                  console.log('cancel');
                  callback('Cancel');
                });
               
          },
          alert:function(ev,title,content){
            $mdDialog.show(
              $mdDialog.alert()
                //.parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                // .title('Please Select')
                .title(title)
                .textContent(content)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
          }
            
        };

}])


// .factory('commonFactory', ['$state','$mdDialog','JWTTOKEN', function($state,$mdDialog,JWTTOKEN) {
//         'use strict';
//         return {
//           getHolidaysBlackOutDays:function(){
//             JWTTOKEN.requestFunction('GET','machinecalendars/getALLMachineWithBlackoutHolidayEvents').then(function(result){
//                     console.log(result);
//                     var holidayBlackOutDays={};
//                     for(var i=0;i<result.data.length;i++)
//                      {
//                        holidayBlackOutDays[result.data[i].id]=result.data[i];
//                      }

//                      console.log(holidayBlackOutDays);
//                       localStorage['holidayBlackOutDays'] = JSON.stringify(holidayBlackOutDays);
//                     // jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
//              });
               
//           }
//           // alert:function(ev,title,content){
//           //   $mdDialog.show(
//           //     $mdDialog.alert()
//           //       //.parent(angular.element(document.querySelector('#popupContainer')))
//           //       .clickOutsideToClose(true)
//           //       // .title('Please Select')
//           //       .title(title)
//           //       .textContent(content)
//           //       .ariaLabel('Alert Dialog Demo')
//           //       .ok('Got it!')
//           //       .targetEvent(ev)
//           //   );
//           // }
            
//         };

// }])

.factory('commonFactory', ['$state','$mdDialog','JWTTOKEN', function($state,$mdDialog,JWTTOKEN) {
        'use strict';
        return {
          getHolidaysBlackOutDays:function(){
            console.log('CALLLEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD SIKHAAAAAAAAAAAAAAAAAAAAAAAAAA')
            JWTTOKEN.requestFunction('GET','machinecalendars/getALLMachineWithBlackoutHolidayEvents').then(function(result){
                    console.log(result);
                    var holidayBlackOutDays={};
                    for(var i=0;i<result.data.length;i++)
                     {
                       holidayBlackOutDays[result.data[i].id]=result.data[i];
                     }

                     console.log(holidayBlackOutDays);
                      localStorage['holidayBlackOutDays'] = JSON.stringify(holidayBlackOutDays);
                      console.log(localStorage['holidayBlackOutDays'])
                    //  return true;
                    // jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
             });
               
          },

          formatDate:function(date){

                //formating Date from this format (2017-02-03T00:00:00.000Z) to this format ("03-02-2017")
                //tart_date:"20-12-2016"
                console.log(date)
                var split=date.split('T');
                var dateonly=split[0];
                var splitdateonly=dateonly.split('-');
                var newdate=splitdateonly[2]+"-"+splitdateonly[1]+"-"+splitdateonly[0];
                return newdate;
          },
          GetSortOrder:function(prop) {  
            return function(a, b) {  
                if (a[prop] > b[prop]) {  
                    return 1;  
                } else if (a[prop] < b[prop]) {  
                    return -1;  
                }  
                return 0;  
            }  
        }
         
        };

}])