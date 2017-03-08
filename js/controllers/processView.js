angular.module('app')
  .controller('processViewController', ['$location','$filter','$scope', '$state','$stateParams','$mdDialog','$window','$compile','JWTTOKEN','$q','dialogFactory','commonFactory','$q','Processticket','Workcenter', function($location,$filter,$scope,
      $state,$stateParams,$mdDialog,$window,$compile,JWTTOKEN,$q,dialogFactory,commonFactory,$q,Processticket,Workcenter) {


//-------------------------CRUD USING Services--------------------------

//Author:Prasad,
// Used in Process form editing in Gantt and Scheduler
function getWorkcenters() {
      Workcenter
        .find()
        .$promise
        .then(function(results) {
          console.log(results);
          $scope.workcenters = results;


        });
    }
    commonFactory.getHolidaysBlackOutDays();
    getWorkcenters(); //To populate in process dialog 

function getProcessTktForRead(taskId, linkId, event,splitDependency) {
     Processticket
        .find({
            filter: {
                where: {
                    id: taskId
                }
            }
        })
        .$promise
        .then(function(result) {
          console.log(result[0])
           $scope.ReadModeOnly = true;
            $scope.selectedProcessTicket= result[0]; // For onload at ng-include
            $scope.ProcessQR = $filter('filter')($scope.workcenters, {id:result[0].workcenterID})[0];
            console.log($scope.ProcessQR.name);
            if ($scope.ProcessQR.name == "Dyeing")
            $scope.DyeingsubType=$filter('filter')($scope.dyeingProcess,{name:result[0].processName1})[0];
            console.log( $scope.DyeingsubType);
            console.log(result[0].workcenterID);
            console.log($scope.ProcessQR)
            splitDependency(taskId, linkId, event);
        });

}

//Save Process Ticket
$scope.saveProcessTicket= function(processticket) {
  console.log('Save Process ticket');
  console.log(processticket);

      processticket
        .$save()
        .then(function(res)  { console.log("Saved");
            $mdDialog.hide();})
    .catch(function(req) { console.log("error saving process obj"); });
    /*.finally(function()  { console.log("always called") });*/

    };

// Selection for dyeing subtypes
    $scope.dyeingProcess = [
{"name":"Jigger_Dyeing"},
{"name":"Vat_Dyeing"},
{"name":"Cabinet_Dyeing"}];
//---------------------------------------------------------------------
    //********************SCOPE VARAIBALES*************************************************************//

   
    $scope.userID=sessionStorage.getItem('userId');
     processName="new Process";
     $scope.splitDate=false;
    $scope.maxSequential="0";
    //$scope.role  is used to check whether the loggedin user is a planner or scheduler or 
    //field officer or planner of the selected joborder etc
    $scope.role=sessionStorage.getItem('role');
    //
    $scope.finalShow=true;
    //$scope.scheduleShow is used to get the status for showing "dhtmlx schedule view" at the time of planning 
    //stage by the planner OR at the time of rescheduling by the scheduler 
    $scope.scheduleShow=true;
    $scope.dyeingEnd=false;
    $scope.createView=false;
    $scope.processes;

    $scope.processdialog=true;

    $scope.masterTicketID=JSON.parse(sessionStorage.getItem("info")).id;
    $scope.masterData=JSON.parse(sessionStorage.getItem("info"));

    if($scope.masterData.lastUpdate==undefined)
    {
      $scope.masterData.lastUpdate="No updates" ;
    }
    if($scope.masterData.currentProcess==undefined)
    {
      $scope.masterData.currentProcess="NA" ;
    }
    if($scope.masterData.noOfProcessTogo==undefined)
    {
      $scope.masterData.noOfProcessTogo="NA" ;
    }
    if($scope.masterData.currentExFactoryDate==undefined)
    {
      $scope.masterData.currentExFactoryDate="NA" ;
    }
    if($scope.masterData.exFactoryDate==undefined)
    {
      $scope.masterData.exFactoryDate="NA" ;
    }

	$scope.selectedIndex="1";
    //used to draw new link OR delete existing link
    $scope.linkStatus="normal";

    //TO add more Fabric on store add
    $scope.processticket ={};
    $scope.processticket.Fabric = [ { 
        "fabric_ExpectedDate": "fabric_date_1", 
        "fabric_Text_Val": "",
        "fabric_availability_Name": "fabric_availability_1",
        "Options": ["Yes", "No", "Partial"]
      }];
 
     $scope.Fabriccounter = 2 ;

     //To add more Yarn on store add
      $scope.processticket.Yarns = [{  
        "yarn_ExpectedDate": "yarn_date_1", 
        "yarn_Text_Val": "",
        "yarn_availability_Name": "yarn_availability_1",
        "Options": ["Yes", "No", "Partial"]}];
 
      $scope.counter = 2 ;

      $scope.sections2=[{key:1, label:""}];

      $scope.sections=[{key:1, label:""}];



    //***************************************************************************************************//



    //********************GLOBAL  VARIBALES *************************************************************//

	//used inside app.scheduler.js too .so that its a global variable .that's why not declared it with "var"
	gantdata=[];
	clickedProcessTicket="";
    OverLoadedDateArray=[];
    //global objects to store event's,joborder's ,process ticket's chnages done by 
    HistoryObj=[];
    eventsForHistory=[];
    machineCalendar_TrackChanges_Obj=[];
    processTicket_TrackChanges_Obj=[];
    masterTicket_TrackChanges_Obj=[];
    //To check machine overload at the time of schduler event loading .which is used insde
    //1 . schedulerreschedule.attachEvent("onEventLoading", function(ev){ on app.scheduler.js
    //2 . checkoverloadOnSchedulerEventLoad
    onEventLoadingCount=0; 
    

    //*************************************************************************************************//
    


  //********************LOCAL VARIBALES *************************************************************//

    //To store newly added link details when scheduling/reschduling
    var linkArray=[];
    //To store deleted link's details when scheduling/reschduling
    var linkDeleteArray=[];
    var normalmachine=[];
    var machine=[];

/////////////////////////////////////////////////////////
dateFormattingNOTINUSE=function(date)
  {
/*
Prasad
Included only for back ward compatability.Eventually we need to delete this function. Do not call this function 
at new place
*/  

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

}
///////////////////////////////////////


////////////////////////////////////////
//GetSortOrder function

// GetSortOrder:function(prop) {  
  function GetSortOrder(prop)
  {
            return function(a, b) {  
                if (a[prop] > b[prop]) {  
                    return 1;  
                } else if (a[prop] < b[prop]) {  
                    return -1;  
                }  
                return 0;  
            }  
        }


//////////////////////////////////////////



  //*******************************************************************************************************//

    
    //***********COLORS USED TO DRAW GANTT,SCHDULER***********************************************//

    blackOutColor="grey";
    holidayColor="#E64F22";
    selfColor="#98DEE9";
    OthersColor="#7f345a";
    errorColor="#EC966D";
    ganttErrorFreeColor="#22E6B9";
    previousEventsColor="yellow";
    readonlycolor="#B7BBB7";

    //****************************************************************************************************//
   
   

    

//**
//**
//**
//**
//**
   


////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------FUNCTION DECLARATIONS---------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////////




//-----------------------------getGanttDisplayStuff-----------------------------------------------------//
//------------------------------------------------------------------------------------------------------//

  //** USED TO GET DATA TO DISPLAY GANTT 
  //**WE NEED TO SHOW 2 GANTTS . DRAFT GANTT & ORIGINAL GANTT.
  //**first check whether is there any item named "jobTreeOriginal" on localstorage.it contains many joborder's data .
  //**   a )if "YES" get it from local storage 
  //               i) getting data corresponding to selected "MASTERTICKET" from localstorage data
  //               ii)If there is no data corresponding to selected "MASTERTICKET" then get it from server ,adding it
  //                   to localstorage data and use it diaply gantt.                     
  //**   b )if "NO" get it from server by calling corresponding API 
  //               i) saving data into localstorage . and use it to display gantt
  //**After all the above steps call "displayGantt"  function by passing original,draft gantt's data to display gantt.
  //**This function is called inside app.scheduler.js .Thts why its declared as Global
          getGanttDisplayStuff=function(masterTicketID,processTicketID)
          {

             $scope.masterTicketID=masterTicketID;
            var jobTreeOriginal_get=localStorage['jobTreeOriginal'];
            if(jobTreeOriginal_get!=undefined)
            {
                var jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);
                var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);

                var  currentJoborderDetailsOriginal=jobTreeOriginal[$scope.masterTicketID];
                var  currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
                 if(currentJoborderDetailsOriginal==undefined && currentJoborderDetailsDraft==undefined)
                 {
                        jobTreeObjOriginal={};
                        jobTreeObjDraft={};


                         jobTreeObjDraft= JSON.parse(localStorage['jobTreeDraft']);
                        jobTreeObjOriginal= JSON.parse(localStorage['jobTreeOriginal']);
                       
                        JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID).then(function(masterticketresult){

                         
                           jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
                           jobTreeObjOriginal[masterticketresult.data.id]=masterticketresult.data;
                           JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                            //JWTTOKEN.requestFunction('POST','mastertickets/getMasterTicket',{id:$scope.masterTicketID}).then(function(processes_result){

                             var processarray={};
                             for(var i=0;i<processes_result.data.length;i++)
                             {
                               processarray[processes_result.data[i].id]=processes_result.data[i];
                             }

                             jobTreeObjDraft[masterticketresult.data.id]["processes"]= processarray;
                             jobTreeObjOriginal[masterticketresult.data.id]["processes"]= processarray;

                             localStorage['jobTreeDraft'] = JSON.stringify(jobTreeObjDraft);
                             localStorage['jobTreeOriginal'] = JSON.stringify(jobTreeObjOriginal);

                              jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);
                           jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);

                           currentJoborderDetailsOriginal=jobTreeOriginal[$scope.masterTicketID];
                           currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
                           displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,processTicketID);
                         
                        }); //end of GET','mastertickets/MASTERTICKET1/processes
                      }); //end of 'GET','mastertickets/MASTERTICKET1'
                 }
                 else
                 {

                   displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,processTicketID);
                 }
            }
            else
            {
                        jobTreeObjOriginal={};
                        jobTreeObjDraft={};
               
                        JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID).then(function(masterticketresult){

                         
                           jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
                           jobTreeObjOriginal[masterticketresult.data.id]=masterticketresult.data;
                           JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                           // JWTTOKEN.requestFunction('POST','mastertickets/getMasterTicket',{id:$scope.masterTicketID}).then(function(processes_result){

                             var processarray={};
                             for(var i=0;i<processes_result.data.length;i++)
                             {
                               processarray[processes_result.data[i].id]=processes_result.data[i];
                             }

                             jobTreeObjDraft[masterticketresult.data.id]["processes"]= processarray;
                             jobTreeObjOriginal[masterticketresult.data.id]["processes"]= processarray;

                             localStorage['jobTreeDraft'] = JSON.stringify(jobTreeObjDraft);
                             localStorage['jobTreeOriginal'] = JSON.stringify(jobTreeObjOriginal);

                             jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);
                           jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);

                           currentJoborderDetailsOriginal=jobTreeOriginal[$scope.masterTicketID];
                           currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
                           displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,processTicketID);
                           

                         
                        }); //end of GET','mastertickets/MASTERTICKET1/processes
                      }); //end of 'GET','mastertickets/MASTERTICKET1'
            }
          }
//---------------------------------end of function getGanttDisplayStuff----------------------------------//



//**
//**
//**




//-----------------------------displayGantt--------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------//

  function displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,processTicketID)
  {
    

     //Here GET machines api is just called to reflect changes on ganttscheduler immediately .
    //api response data not used here 
   JWTTOKEN.requestFunction('GET','machines').then(function(uom){

        //**********************************************************************************************************//
        //CHECK WHETHER THE LOGGED IN USER IS THE PLANNER FOR THE CORRESPONDING MASTER TICKET .IF NOT NO NEED TO 
        //SHOW THE "ADD PROCESS" BUTTON .ONLY MASTERTICKT'S PLANT'S PLANNER CAN ADD PROCESS UNDER A MASTER TICKET
        //OR PLAN A MASTER TICKET
         checkOwner(currentJoborderDetailsOriginal.plant);
        //**********************************************************************************************************//

          var linksOriginal=[] , linksDraft=[] ;
          ganttDataOriginal=[];
          ganttDataDraft=[];


          //---------------Start of G0-V1
                        /*Modified
                        Rev:G0-V1
                        Author:PK
                        Date:Feb-20
                        To maintain sanctity of date format
                          
                        */

                    //LOAD ORIGINAL GANTT
                    //ganttDataOriginal.push({ id: currentJoborderDetailsOriginal.id, text: currentJoborderDetailsOriginal.salesorderNo, duration: 24, start_date: commonFactory.formatDate(currentJoborderDetailsOriginal.actualstartdate), end_date: commonFactory.formatDate(currentJoborderDetailsOriginal.actualenddate) + " 23:59", order: 10, progress: 0.4, open: true, color: "green" })
                    var jobdata= {id:currentJoborderDetailsOriginal.id, text:currentJoborderDetailsOriginal.salesorderNo,duration:24, start_date:currentJoborderDetailsOriginal.exFactoryDate, end_date:currentJoborderDetailsOriginal.exFactoryDate , order:10, progress:0.4, open: true,color:"green"}
                jobdata.start_date =new Date(currentJoborderDetailsOriginal.exFactoryDate); 
               jobdata.end_date =new Date(currentJoborderDetailsOriginal.exFactoryDate);
                ganttDataOriginal.push(jobdata); 
//---------------End of G0-V1--------------------

                for (var key in currentJoborderDetailsOriginal.processes) 
                {
                    var color="";
                    if(currentJoborderDetailsOriginal.processes[key].status=="rework")
                    {
                      color="#8142E8";
                    }
                    else if(currentJoborderDetailsOriginal.processes[key].status=="completed")
                    {
                      color="#258338";
                    }
                    else
                    {
                      color=ganttErrorFreeColor;
                    }


                     //---------------Start of G0-V1
                        /*Modified
                        Rev:G0-V1
                        Author:PK
                        Date:Feb-20
                        To maintain sanctity of date format
                          
                        */
                         //ganttDataOriginal.push({ id: currentJoborderDetailsOriginal.processes[key].id, text: currentJoborderDetailsOriginal.processes[key].processName, start_date: commonFactory.formatDate(currentJoborderDetailsOriginal.processes[key].actualstartdate), end_date: commonFactory.formatDate(currentJoborderDetailsOriginal.processes[key].actualenddate) + " 23:59", order: 10, progress: 0.4, open: true, parent: currentJoborderDetailsOriginal.id, color: color })
                       
                        jobdata = { id: currentJoborderDetailsOriginal.processes[key].id, text: currentJoborderDetailsOriginal.processes[key].processName, start_date: currentJoborderDetailsOriginal.processes[key].actualstartdate, end_date: currentJoborderDetailsOriginal.processes[key].actualenddate, order: 10, progress: 0.4, open: true, parent: currentJoborderDetailsOriginal.id, color: color }
                        jobdata.start_date = new Date(currentJoborderDetailsOriginal.processes[key].actualstartdate);
                        jobdata.end_date = new Date(currentJoborderDetailsOriginal.processes[key].actualenddate);
                        jobdata.processType=currentJoborderDetailsOriginal.processes[key].processType;
                        ganttDataOriginal.push(jobdata);


                        //---------------End of G0-V1--------------------
                   for(var j=0;j<currentJoborderDetailsOriginal.processes[key].successorID.length;j++)
                   {
                     linksOriginal.push({ id:(currentJoborderDetailsOriginal.processes[key].id)+'.'+j, source:currentJoborderDetailsOriginal.processes[key].id, target:currentJoborderDetailsOriginal.processes[key].successorID[j].id, type:"0"});
                   }           
                }
              //LOAD DRAFT GANTT
             // ganttDataDraft.push( {id:currentJoborderDetailsDraft.id, text:currentJoborderDetailsDraft.salesorderNo,duration:24, start_date:commonFactory.formatDate(currentJoborderDetailsDraft.actualstartdate), end_date:commonFactory.formatDate(currentJoborderDetailsDraft.actualenddate) +" 23:59", order:10, progress:0.4, open: true,color:"green",type:gantt.config.types.project})

              //var maxSequentialNo=0;
              var processLength=Object.keys(currentJoborderDetailsDraft.processes).length;
              var count=0;
                for(var key in currentJoborderDetailsDraft.processes)
                {
                  count++;
                  if(count==processLength)
                  {
                    $scope.maxSequential=currentJoborderDetailsDraft.processes[key].sequentialorParrallelOrderNo;
                  }
                }
                for (var key in currentJoborderDetailsDraft.processes) 
                {
                    var color="";
                    if(currentJoborderDetailsDraft.processes[key].status=="rework")
                    {
                      color="#8142E8";
                    }
                    else if(currentJoborderDetailsDraft.processes[key].status=="completed")
                    {
                      color="#258338";
                    }
                    else
                    {
                      color=ganttErrorFreeColor;
                    }
                    //Stop users from adding final QC twice----code by rinsha
                   

                    if(currentJoborderDetailsDraft.processes[key].processType=="finalQC")
                    {
                      $scope.finalShow=false;
                    }


                    //rinsha code for process parent {id:1, text:"SO#45637", start_date:"20-12-2016", duration:24, order:10, progress:0.4, open: true,type:gantt.config.types.project,planned_end_date:"01-03-2017"}
                    
                    var currentSequentialNo=currentJoborderDetailsDraft.processes[key].sequentialorParrallelOrderNo;
                      if(currentSequentialNo=="10")
                      {
                        var processParent=parseInt(currentSequentialNo)+'_1';
                         //ganttDataDraft.push( {id:processParent, text:"step "+currentSequentialNo.charAt(0),duration:5, start_date:commonFactory.formatDate(currentJoborderDetailsDraft.actualstartdate), order:10, progress:0.4, open: true,color:"green",type:gantt.config.types.project,parent:currentJoborderDetailsDraft.id})
                          
                      }
                    else if(currentJoborderDetailsDraft.processes[key].predecessorID[0]!=undefined)
                    {
                      var previousSequentialNo=currentJoborderDetailsDraft.processes[currentJoborderDetailsDraft.processes[key].predecessorID[0].id].sequentialorParrallelOrderNo;
                     
                       if(parseInt(currentSequentialNo)!=parseInt(previousSequentialNo))
                        {
                            var processParent=parseInt(currentSequentialNo)+'_1';
                           //ganttDataDraft.push( {id:processParent, text:"step "+currentSequentialNo.charAt(0),duration:5, start_date:commonFactory.formatDate(currentJoborderDetailsDraft.actualstartdate), order:10, progress:0.4, open: true,color:"green",type:gantt.config.types.project,parent:currentJoborderDetailsDraft.id})
                        }
                    }         
                    // ganttDataDraft.push( {id:currentJoborderDetailsDraft.processes[key].id, text:currentJoborderDetailsDraft.processes[key].processName, start_date:commonFactory.formatDate(currentJoborderDetailsDraft.processes[key].actualstartdate), end_date:commonFactory.formatDate(currentJoborderDetailsDraft.processes[key].actualenddate) +" 23:59", order:10, progress:0.4, open: true , parent:processParent,color:color,processType:currentJoborderDetailsDraft.processes[key].processType})

                    //ends

                      var linkColorData;


                   for(var j=0;j<currentJoborderDetailsDraft.processes[key].successorID.length;j++)
                   {
                    if(currentJoborderDetailsDraft.processes[currentJoborderDetailsDraft.processes[key].successorID[j].id]!=undefined)
                    {

                      var sequential=parseInt(currentJoborderDetailsDraft.processes[currentJoborderDetailsDraft.processes[key].successorID[j].id].sequentialorParrallelOrderNo)-10;
                        if(currentJoborderDetailsDraft.processes[key].sequentialorParrallelOrderNo==sequential+'c')
                        {
                          var iter=-1;  
                        }

                    }
                        /*var sequential=parseInt(currentJoborderDetailsDraft.processes[currentJoborderDetailsDraft.processes[key].successorID[j].id].sequentialorParrallelOrderNo)-10;
                        if(currentJoborderDetailsDraft.processes[key].sequentialorParrallelOrderNo==sequential+'c')
                        {
                          var iter=-1;  
                        }*/


                     linksDraft.push({ id:(currentJoborderDetailsDraft.processes[key].id)+'.'+j, source:currentJoborderDetailsDraft.processes[key].id, target:currentJoborderDetailsDraft.processes[key].successorID[j].id, type:"0",color:linkColorData});
                   }               
                }



                 ganttDataDraft = ganttDataOriginal; // During page load draft and original is same.

                 console.log('ganttDataDraft.............');
                 console.log(ganttDataDraft);
                    
                $scope.tasks = {data:ganttDataOriginal,links:linksOriginal};
                $scope.drafttasks = {data:ganttDataDraft,links:linksDraft}; 

                //CLICK ON DIFFERENT PROCESS'S EVENT FROM SCHEDULER, WHICH WILL LOAD ITS CORRESPONDING GANTT 
                //IF WE ARE CLICKING FROM "WEAVING" EVENTS , WE NEED TO LOAD "WEAVING" EVENTS ON NEWLY DISPLAYING GANTT'S 
                //SCHEDULER . FOR THAT WE DONE BELOW CODE 
                if(processTicketID!="")
                {
                  schedulerScopeLoad(processTicketID);
                }  
     });
  }
//---------------------------------end of function getGanttDisplayStuff----------------------------------//

//**
//**
//**


//-----------------------------checkOwner--------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------//

//** check whether the logged user is the planner of the selected JOBORDER
 function checkOwner(plantid)
  {
   
    if(sessionStorage.getItem('role')=="planner")
    {
        JWTTOKEN.requestFunction('GET','plants/'+plantid).then(function(plant){
          var splitPlannerIDs=plant.data.plannerID.split(',');
          for(var i=0;i<splitPlannerIDs.length;i++)
          {
            if(splitPlannerIDs[i]==sessionStorage.getItem('userId'))
            {
               $scope.role="ownerplanner";
            }
          }
          
        });
      }
  }

//---------------------------------end of function checkOwner----------------------------------//


//**
//**
//**



//-----------------------------schedulerScopeLoad--------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------//


function schedulerScopeLoad(id)
{
     //Here GET machines api is just called to reflect changes on ganttscheduler immediately .
    //api response data not used here 
   JWTTOKEN.requestFunction('GET','machines').then(function(uom){
    $scope.eventsReschedule=[];
    $scope.ganttid=id;

    var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
    var machineEventsDraft={};
    var  currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
    var workCenterID=currentJoborderDetailsDraft.processes[$scope.ganttid].workcenterID;
   
  var workcenterVendorID=undefined;
        if(workCenterID=="QC" && currentJoborderDetailsDraft.processes[$scope.ganttid].justAddedByPlanner==true)
        {
          workcenterVendorID=currentJoborderDetailsDraft.processes[$scope.ganttid].machineID;
        }
   
      machineEventsDraft_get= localStorage['machineEventsDraft'];

       if(machineEventsDraft_get!=undefined)
       {
           machineEventsDraft=JSON.parse(localStorage['machineEventsDraft']);
          if(machineEventsDraft[workCenterID]==undefined)
          {
            getMachineEventsFromserver(workCenterID,"row",workcenterVendorID,function(machineevents)
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
              localStorage['machineEventsDraft']=JSON.stringify(machineEventsDraft);
              var machineevents=  displayScheduler(workCenterID);
             $scope.eventsReschedule = machineevents;
             angular.copy( $scope.eventsReschedule ,eventsForHistory);

            });
          }
          else
          {
             var machineevents=  displayScheduler(workCenterID);
              $scope.eventsReschedule = machineevents;
              angular.copy( $scope.eventsReschedule ,eventsForHistory);

          }          
       }
       else 
       {
          getMachineEventsFromserver(workCenterID,"row",workcenterVendorID,function(machineevents)
          {
              machineEventsDraft[workCenterID]={}
               for(var j=0;j< machineevents.data.length;j++)
               {  
                  // machineevents.data[j.events="";   

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
               var machineevents=  displayScheduler(workCenterID);
                  $scope.eventsReschedule = machineevents;
                  angular.copy( $scope.eventsReschedule ,eventsForHistory);
          });
       }
     });
}

//---------------------------------end of function schedulerScopeLoad----------------------------------//


//**
//**
//**



//-----------------------------displayScheduler--------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------//


function displayScheduler(workCenterID,type)
{

var textColor= "white";
var deferred = $q.defer();
console.log("workcenetrID")
console.log(workCenterID)
console.log($scope.workCenterID)
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
                                color=selfColor;

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
                                color=OthersColor;
                             }
                             var blackout=false;
                             
                             if(machineEventsDraft[key][key_machinecalendar].status=="blackout")
                             {

                                blackout=true;
                                color=blackOutColor;
                                textEvent="blackOut";
                             }
                             else if(machineEventsDraft[key][key_machinecalendar].status=="holiday")
                             {
                                //alert('here')
                                blackout=true;
                                color=holidayColor;
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

                                color=previousEventsColor;
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
                                 color=readonlycolor;
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


//**
//**
//**



//---------------------------------function displaySchedulerBasedOnVendorFilter----------------------------------//


displaySchedulerBasedOnVendorFilter=function(machineEventsDraft,workCenterID,type)
{
var deferred = $q.defer();
    var machineEventsDraft=machineEventsDraft;
    console.log(machineEventsDraft)
    var machineevents=[];
    var size=  Object.keys(machineEventsDraft).length
     if(size==0)
     {
        $scope.sections2.length=0;
     }
     var schedulerID="";
     var QcSchedulerID="";
        var i=0,iteration=0;
        var k=0;
         $scope.sections.length=0;
         $scope.sections2.length=0;
         //LOAD SCHEDUER VIEW WHEN ADDING PROCESS TICKETS 
         if(type=="schedulerView")
         {

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
                 if(machineEventsDraft[key].type=="External")
                 {
                    labelname=machineEventsDraft[key].vendorRelation.name+'('+machineEventsDraft[key].type+')';
                 }
                 else if(machineEventsDraft[key].type=="Internal")
                 {
                  labelname=machineEventsDraft[key].displayName;
                 }
                 $scope.sections2.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});
             }
             else if(status=="finalqc")
             {
                if(machineEventsDraft[key].type=="finalQC")
                {
                  $scope.sections2.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});
                }
             }
             else if(status=="invoice")
             {
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
              //$scope.sections.push( {key:iteration, label:machineEventsDraft[key].name});
              $scope.sections.push( {key:iteration, label:labelname,details:machineEventsDraft[key]});
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
                                color=selfColor;


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
                                color=OthersColor;
                             }
                             var blackout=false;

                             if(machineEventsDraft[key][key_machinecalendar].status=="blackout")
                             {

                                blackout=true;
                                color=blackOutColor;
                                textEvent="blackOut";
                             }
                             else if(machineEventsDraft[key][key_machinecalendar].status=="holiday")
                             {
                                blackout=true;
                                color=holidayColor;
                                textEvent="Holiday";
                                readonly=true;
                             }
                             var start,end;

                             var end_date_copy=new Date(machineEventsDraft[key][key_machinecalendar].endDate);                       
                             end_date_copy.setHours(24)
                             console.log(end_date_copy)

                             //check dates less than today + its status is still pending .Color them in distinct color
                             if(end_date_copy <new Date() && machineEventsDraft[key][key_machinecalendar].status=="booked")
                             {
                               start=new Date();
                                end=new Date();
                                color=previousEventsColor;
                                readonly=false;
                                previousEventStatus=true;
                             }
                             else
                             {
                                start=new Date(machineEventsDraft[key][key_machinecalendar].date);
                                end= new Date(machineEventsDraft[key][key_machinecalendar].endDate);
                                if(blackout)
                                {
                                   var start_date_copy=new Date(machineEventsDraft[key][key_machinecalendar].date);
                                   start_date_copy.setHours(24)
                                   end= start_date_copy;                     
                                }
                                previousEventStatus=false;
                             }

                             //****************************************************************************//
                             ////////////////////////////////////////////////////////////////////////////////
                             //if logged in planner is not this masterticket's plant's planner . Then 
                             //dont allow him drag the events under masterticket
                             if($scope.role!="ownerplanner")
                             {    
                                readonly=true;
                             }
                             ///////////////////////////////////////////////////////////////////////////////
                             //****************************************************************************//
                              
                               //***********************************************************************************//
                             ///////////////////////////////////////////////////////////////////////////////////////
                             //ONLY SCHEDULER OF EVENT'S WORKCENTERVENDOR CAN DRAG MACHINE EVENTS FROM SCHEDULER
                             //IF THE LOGGEDIN USER IS NOT THE MACHINE EVENTS SCHEDULER THEN SET THAT EVENT'S 
                             //READONLY STATUS TRUE . 
                              var accessstatus=checkEventAccessebility(machineEventsDraft[key].workcentervendor,workCenterID);
                              readonly=accessstatus;


                              //alert(accessstatus)
                              if(readonly)
                              {
                                 color=readonlycolor;
                              }
                             ///////////////////////////////////////////////////////////////////////////////////////
                             //***********************************************************************************//

                          ////////////////////////////////////////////////////////////////////////
                        
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
                                                  machinecalendarID:machineEventsDraft[key][key_machinecalendar].id
                                                };
                                                machineevents.push(machineeventNew);
                   }
              }   

                 deferred.resolve(machineevents);

          }
          console.log(machineevents)
           return deferred.promise;

     //    $scope.eventsData= machineevents;
}


//---------------------------------end of function displaySchedulerBasedOnVendorFilter----------------------------------//

//**
//**
//**

//---------------------------------function checkProcessFactoryOutdateOnGanttLoad----------------------------------//
//This function is called on gantt's "onGanttReady" event
//Following functions are called inside this "checkProcessFactoryOutdateOnGanttLoad"
//1 .getfactoryOutdateMissedProcesses


var ganttLoadFactoryOutdateArray=[];

//used to SHOW FACTORY OUTDATED FUNCTIONS IN RED COLOR
function checkProcessFactoryOutdateOnGanttLoad(myData)
{
  ganttLoadFactoryOutdateArray=[];
    for(var i=1;i<myData.length;i++)
    {
      getfactoryOutdateMissedProcesses(myData[i].id);
      if(i==myData.length-1)
      {
        for(var k=0;k<ganttLoadFactoryOutdateArray.length;k++)
        {
          if(ganttLoadFactoryOutdateArray[k].status==true)
          {
            gantt.getTask(ganttLoadFactoryOutdateArray[k].id).color= errorColor;
            gantt.updateTask(ganttLoadFactoryOutdateArray[k].id);
          }
        }
      }
    }
}


//---------------------------------end of function checkProcessFactoryOutdateOnGanttLoad----------------------------------//


//**
//**
//**

//---------------------------------function getfactoryOutdateMissedProcesses-------------------//
//This fun ction is called inside "checkProcessFactoryOutdateOnGanttLoad" function
//This is used to get factory outdate missed processes list and populate "ganttLoadFactoryOutdateArray" array 
//following functions are called inside this function
//1 .checkSuccessors

function getfactoryOutdateMissedProcesses(processTicketID)
{
   var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
   if(jobTreeDraft[$scope.masterTicketID].processes[processTicketID]!=undefined)
   {
      var predecessorID= jobTreeDraft[$scope.masterTicketID].processes[processTicketID].predecessorID;
      var successorID= jobTreeDraft[$scope.masterTicketID].processes[processTicketID].successorID;
      var actualstartdate=jobTreeDraft[$scope.masterTicketID].processes[processTicketID].actualstartdate;
      var actualenddate=jobTreeDraft[$scope.masterTicketID].processes[processTicketID].actualenddate;
      var result=[];
      var succObj = checkSuccessors(actualenddate,successorID);
      result=result.concat(succObj);
      ganttLoadFactoryOutdateArray=ganttLoadFactoryOutdateArray.concat(result);
      return result;
   }

}


//---------------------------------end of function getfactoryOutdateMissedProcesses-------------------------------------//


//**
//**
//**

//---------------------------------function checkSuccessors-------------------//
//Used to check a process's successor status 
//This function is callled inside "getfactoryOutdateMissedProcesses" ,"CheckProcessFactoryOutdatedOnDrag" function


function checkSuccessors(enddate,successors)
{
  var obj=[];
   var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
 
  for(var i=0;i<successors.length;i++)
  {
          var date=new Date(jobTreeDraft[$scope.masterTicketID].processes[successors[i].id].actualstartdate);
          var slacktime=jobTreeDraft[$scope.masterTicketID].processes[successors[i].id].slacktime; 
          slacktime=0;
          enddate=new Date(enddate);
          enddate.setDate(enddate.getDate() + slacktime); 

          if(enddate>new Date(date))
          {
            obj.push({"id":successors[i].id ,"status" : true});
          }
          else
          {
            obj.push({"id":successors[i].id ,"status" : false});
          }
          if(i==successors.length-1)
          {
            return obj;
          }
  }
  if(successors.length==0)
  {
    return [];
  }

}

//---------------------------------end of function checkSuccessors-------------------------------------//


//**
//**
//**

//---------------------------------function checkpredecessors-------------------//
//Used to check a process's predecessor status 
//This function is callled inside "getfactoryOutdateMissedProcesses" ,"CheckProcessFactoryOutdatedOnDrag" function



function checkpredecessors(startdate, predecessors)
{
   var obj=[];
   var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
  for(var i=0;i<predecessors.length;i++)
  {
   var date=new Date(jobTreeDraft[$scope.masterTicketID].processes[predecessors[i].id].actualenddate);
    var slacktime=jobTreeDraft[$scope.masterTicketID].processes[predecessors[i].id].slacktime;
    slacktime=0;
    date.setDate(date.getDate() + slacktime); 

    if(date>new Date(startdate))
    {
      obj.push({"id":predecessors[i].id ,"status" : true});
       return true;
    }
   else
    {
      obj.push({"id":predecessors[i].id ,"status" : false});
    }
    if(i==predecessors.length-1)
    {
      return obj;
    }
  }
  if(predecessors.length==0)
  {
    return [];
  }
}


//---------------------------------end of function checkpredecessors-------------------------------------//


//**
//**
//**



//---------------------------------function processFetch-------------------------------------------//
//called on gantt's "onContextMenu" event 


function processFetch()
{
  JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
    //JWTTOKEN.requestFunction('POST','mastertickets/getMasterTicket',{id:$scope.masterTicketID}).then(function(processes_result){
                  $scope.processes=processes_result.data;
                });
}

//---------------------------------end of function processFetch-------------------//


//**
//**
//**

//---------------------------------function checkoverloadOnEventDrag-------------------------------------//
//CHECK MACHINE OVERLOAD ON SCHEDULER EVENTS DRAG
// When we drag a particular event from one position to another , we need to check machine overload .
// "checkoverloadOnEventDrag" function called from app.scheduler.js when dragging event from scheduler view
// following functions are used inside "checkoverloadOnEventDrag" function  
// 1 . CheckmachineOverload
// 2 . 


checkoverloadOnEventDrag=function(workCenterID,ev_date,ev,fromDate)
{
  var machineEventsDraft_=JSON.parse(localStorage['machineEventsDraft']);
  machineEventsDraft=machineEventsDraft_[workCenterID][ev.machineid];

   var result=  CheckmachineOverload(machineEventsDraft, ev_date);
            if(result==true)
            {
                for(var key_machinecalendar in machineEventsDraft) 
                {
                  //check whether attribute is alpha numeric
                  if (key_machinecalendar.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
                   {
                       //console.log(key_machinecalendar);
                       if(new Date(machineEventsDraft[key_machinecalendar].date) == new Date(ev.start_date) )
                        {
                          schedulerreschedule.getEvent(key_machinecalendar).color =errorColor;
                          schedulerreschedule.updateEvent(key_machinecalendar);

                        }
                   }
                }
            }
            else
            {
                 for(var key_machinecalendar in machineEventsDraft) 
                {

                    if (key_machinecalendar.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
                   {
                      var color;
                     //SHOULD SHOW CURRENT JOB ORDER'S MACHINE EVENTS IN DISTINCT COLOUR
                     if(machineEventsDraft[key_machinecalendar].processticketRelation!=undefined)
                     {

                      if(machineEventsDraft[key_machinecalendar].processticketRelation.masterTicketID==$scope.masterTicketID)
                      {
                        if(machineEventsDraft[key_machinecalendar].previousEventStatus)
                        {
                            color=previousEventsColor;
                        }
                        else
                        {
                          color=selfColor;
                        }                  
                      }
                      else
                      {
                        if(machineEventsDraft[key_machinecalendar].previousEventStatus)
                        {
                            color=previousEventsColor;
                        }
                        else
                        {
                           color=OthersColor;
                        }
                      }
                    }
                    if(new Date(machineEventsDraft[key_machinecalendar].date) == new Date(ev.start_date))
                    {
                      schedulerreschedule.getEvent(key_machinecalendar).color =color;
                      schedulerreschedule.updateEvent(key_machinecalendar);
                    }
                  }
               }
            }

    var result2=  CheckmachineOverload(machineEventsDraft, fromDate+"T00:00:00.000Z");

          if(result2==true)
          {
            console.log(machineEventsDraft)
            for(var key_machinecalendar in machineEventsDraft) 
            {
               if (key_machinecalendar.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
              {

              if(new Date(machineEventsDraft[key_machinecalendar].date)==  fromDate  )
              {
                schedulerreschedule.getEvent(key_machinecalendar).color = errorColor;
                schedulerreschedule.updateEvent(key_machinecalendar);
              }
            }
            }
          }
          else
          {

            for(var key_machinecalendar in machineEventsDraft) 
            {
              if (key_machinecalendar.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
                   {
                      var color;
                      if(machineEventsDraft[key_machinecalendar].processticketRelation!=undefined)
                     {

                     //SHOULD SHOW CURRENT JOB ORDER'S(MASTERTICKETS) MACHINE EVENTS IN DISTINCT COLOUR
                      if(machineEventsDraft[key_machinecalendar].processticketRelation.masterTicketID==$scope.masterTicketID)
                      {
                         if(machineEventsDraft[key_machinecalendar].previousEventStatus)
                          {
                              color=previousEventsColor;
                          }
                          else
                          {
                            color=selfColor;
                          }
                      }
                      else
                      {
                         if(machineEventsDraft[key_machinecalendar].previousEventStatus)
                          {
                              color=previousEventsColor;
                          }
                          else
                          {
                             color=OthersColor;
                          }                
                      }
                    }
                      if(new Date(machineEventsDraft[key_machinecalendar].date) ==  fromDate )
                      {
                        schedulerreschedule.getEvent(key_machinecalendar).color = color;
                        schedulerreschedule.updateEvent(key_machinecalendar);
                      }
            }
          }
          }
          return true;
}





//---------------------------------end of function checkoverloadOnEventDrag----------------------------------------------//

//**
//**
//**

//---------------------------------function checkoverloadOnSchedulerEventLoad-------------------//
//CHECK MACHINE OVERLOAD ON SCHEDULER EVENTS WHEN SCHEDULER IS LOADING
//1 . Get min date,max date shown on schduler view
//2 . Get all overloaded dates between min and max dates using "CheckmachineOverload" method
//3 . Then color all events under that each overloaded date as red
//4 . "colorOverLoadedEvents" method is used to change event color to red.
//5 . "checkoverloadOnSchedulerEventLoad" will be called on scheduler event "onEventLoading" 
//6 . "onEventLoading" will triggred twice for each event . so after loading all events we need to change 
//     overloaded events color . Call function "checkoverloadOnSchedulerEventLoad" inside setTimeout 
//     function should be the best practise.


//"colorOverLoadedEvents" function is called from app.scheduler.js on schedulerreschedule.attachEvent("onEventLoading", function(ev){ event

//following functions are used inside function "checkoverloadOnSchedulerEventLoad" are 
//1 . colorOverLoadedEvents
checkoverloadOnSchedulerEventLoad=function()
{

   var machineEventsDraft_=JSON.parse(localStorage['machineEventsDraft']);
   machineEventsDraft=machineEventsDraft_[$scope.eventsReschedule[0].workcenterID];

  
  onEventLoadingCount=0;
  var min_date=new Date(schedulerreschedule.getState().min_date);
  var max_date=new Date (schedulerreschedule.getState().max_date);
  var noOfDays= Math.round((schedulerreschedule.getState().max_date-schedulerreschedule.getState().min_date)/(1000*60*60*24));
  var iteration=0;
  var eventlength=0;

  for (var keyMachine in machineEventsDraft) 
      {
             for (var key in machineEventsDraft[keyMachine]) 
              {
                    if (key.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
                       {
                            eventlength++;
                       }
             }
    }

  for (var keyMachine in machineEventsDraft) 
      {
             for (var key in machineEventsDraft[keyMachine]) 
              {
                    if (key.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
                       {
                        iteration++;
                            var date=new Date(schedulerreschedule.getState().min_date);
                            for(var j=0;j<noOfDays;j++)
                            {
                              if(j==0)
                              {
                                date_=date;
                                min_date_=new Date(date_);
                              }
                              else  
                              {
                                 date_=new Date(min_date_);
                              }
                                CheckmachineOverload(machineEventsDraft[keyMachine], date_+"T00:00:00.000Z");
                                min_date_.setDate(min_date_.getDate() + 1);

                                if(j==noOfDays-1 && iteration==eventlength)
                                {
                                  colorOverLoadedEvents(machineEventsDraft);
                                }
                            }
                       }

              }
            }

}


//---------------------------------end of function checkoverloadOnSchedulerEventLoad-------------------------------------//


//**
//**
//**

//---------------------------------function colorOverLoadedEvents-------------------//

//This function is called inside "checkoverloadOnSchedulerEventLoad" function
//This is used to color overloaded events in error color 
//Following functions are used inside "colorOverLoadedEvents"
/

function colorOverLoadedEvents(machineEventsDraft)
{
// var 
   for (var keyMachine in machineEventsDraft) 
      {
       for (var key in machineEventsDraft[keyMachine]) 
          {
               if(key.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
               {

                   var date= new Date(machineEventsDraft[keyMachine][key].date);
                   for(var j=0;j<OverLoadedDateArray.length;j++)
                    {
                      if(date == new Date(OverLoadedDateArray[j].date)  &&machineEventsDraft[keyMachine][key].machineID == OverLoadedDateArray[j].machine)
                      {
                        schedulerreschedule.getEvent(key).color =errorColor;
                        schedulerreschedule.updateEvent(key);
                      }
                    }
               }
          }
    }
 
}


//---------------------------------end of function colorOverLoadedEvents-------------------------------------//


//**
//**
//**

//---------------------------------function checkPredecessorStatus-------------------//
//This function is used to get a process ticket's predecessor's status .whether it is completed or not
//This function is called from app.scheduler.js -- schedulerreschedule.attachEvent("onBeforeEventChanged", event
//Follwing functions are called from "checkPredecessorStatus" function
//1 .getProcessDetailsFromLocalstorage


checkPredecessorStatus=function(toDate,fromDate)
{
  var currentProcessrDetailsDraft= getProcessDetailsFromLocalstorage($scope.ganttid);
  var predecessorID=currentProcessrDetailsDraft.predecessorID;
  var completedCount=0;
  var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
  if(predecessorID.length==0)
  return true;
   for(var i=0;i<predecessorID.length;i++)
   {
      
       var machineEventsDraft={};
       var  currentProcessrDetailsDraft_temp=getProcessDetailsFromLocalstorage(predecessorID[i].id);
       var status=currentProcessrDetailsDraft_temp.status;
        if(status=="completed")
        {
          completedCount++;
        }
        if(i==predecessorID.length-1)
        {
           if(completedCount==predecessorID.length)
            {
              return true;
            }
            else
            {
              if(toDate>=fromDate)
              {
                return true;
              }
              else
              {
                return false;
              }           
            }
        }
   }
}

//---------------------------------end of function checkPredecessorStatus-------------------------------------//


//**
//**
//**



//---------------------------------function getProcessDetailsFromLocalstorage-------------------//
//This function is called from "checkPredecessorStatus" function
//This funtion is used to get process ticket details from localstorage by passing processTicketID 

getProcessDetailsFromLocalstorage=function(processTicketID)
{
    var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
    var machineEventsDraft={};
    var  currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
    var currentProcessDetailsDraft=currentJoborderDetailsDraft.processes[processTicketID];
    return currentProcessDetailsDraft;
}



//---------------------------------end of function getProcessDetailsFromLocalstorage-------------------------------------//




//**
//**
//**




//---------------------------------function CheckmachineOverload-------------------//
//WHICH IS CALLED INSIDE 2 FUNCTIONS 
//1 . checkoverloadOnSchedulerEventLoad
//2 . checkoverloadOnEventDrag
//above 2 functions are used inside app.scheduler.js . not used inside processView.js




function CheckmachineOverload(jsonObject,date)
{
  //check whether machine running on overload on a particular day by checking its machinecalendar
  //use machinecalendarObj_copy object 
  //filter items having machineID=123,date=12/12/12
  //get that machine's capacity from machineObj_original
  //add all used capacities from filtered items object
  //if used capacity total < machine capacity return false
  //else return true (machine overloaded)


      console.log('CheckmachineOverload////////////');

       var machineCapacity=jsonObject.capacity;
       var machineID=jsonObject.id;
       var totalcapacity=0;
       var iteration=0;
        for (var key in jsonObject) 
        {
            if (key.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
            {
              iteration++;
              if((jsonObject[key].date!=undefined) &&(date!=undefined))
              {
                if(jsonObject[key].date.toString() == date.toString())
                {
                      if(jsonObject[key].usedCapacity!=undefined)
                      {
                         totalcapacity=totalcapacity +parseInt(jsonObject[key].usedCapacity);
                      }
                }
              }    
            }
            if(iteration==jsonObject.machinecalendar.length)
            {
                  if(totalcapacity <= machineCapacity)
                  {
                    return false;
                  }
                  else if(machineCapacity==undefined)
                  {
                    return false;
                  }
                  else
                  {                 
                    OverLoadedDateArray.push({"date" : date, "machine" : machineID});
                    return true;
                    
                  }
            }
          }
}

//---------------------------------end of function CheckmachineOverload-------------------//


//**
//**
//**

//-------------------------------- ----function processLinkUpdate-------------------//
//This function is called inside "$scope.saveSchedule" 
//To update newly added links to the server 




function processLinkUpdate()
{
  console.log('processLinkUpdate');
  var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
  var  currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
  var processArray=currentJoborderDetailsDraft.processes;
  //check linkArray 0

  //else loop
  if((linkArray.length==0) && (linkDeleteArray.length==0))
  {
                localStorage.removeItem('jobTreeDraft');
                  localStorage.removeItem('jobTreeOriginal');
                  localStorage.removeItem('machineEventsDraft');
                  $scope.activated=false;
                  alert('Schedule saved successfully');

                  ///redirection--------------- set localstorge////rinshaaaa
                  $window.location.href = '#/panelView/' + $scope.masterTicketID;
  }
  else
  {
    if(linkArray.length!=0)
    {
      for(var i=0;i<linkArray.length;i++)
      {
            var linkProcessSource=processArray[linkArray[i].processSource];
            var successorIDArray=linkProcessSource.successorID;
            successorIDArray.push({"id":linkArray[i].processTarget});

            var linkProcessTarget=processArray[linkArray[i].processTarget];
            var predecessorIDArray=linkProcessTarget.predecessorID;
            predecessorIDArray.push({"id":linkArray[i].processSource});
      }
    }
    else if(linkDeleteArray.length!=0)
    {
      var successorsArray=[];
      var predecessorsArray=[];
      for(var i=0;i<linkDeleteArray.length;i++)
      {
        console.log(processArray);
            var linkProcessSource=processArray[linkDeleteArray[i].processSource];
            var successorIDArray=linkProcessSource.successorID;

           for(var j=0;j<successorIDArray.length;j++)
           {
            successorsArray.push(successorIDArray[j].id);
           }
            var idx = successorsArray.indexOf(linkDeleteArray[i].processTarget);
            successorIDArray.splice(idx, 1);

            var linkProcessTarget=processArray[linkDeleteArray[i].processTarget];
            var predecessorIDArray=linkProcessTarget.predecessorID;
            console.log(predecessorIDArray);

            for(var k=0;k<predecessorIDArray.length;k++)
            {
              predecessorsArray.push(predecessorIDArray[k].id);
            }
            var idx = predecessorsArray.indexOf(linkDeleteArray[i].processSource);
            predecessorIDArray.splice(idx, 1);
            //predecessorIDArray.push({"id":linkDeleteArray[i].processSource});
      }
    }
    
    var linkProcess=[];
    var j=0;
        for (var key in processArray) 
        {
          linkProcess[j]=processArray[key];
          j++;
        }
    console.log(linkProcess);
    JWTTOKEN.requestFunction('POST','processtickets/saveProcessFlow',{"sourceTargetArray":linkProcess,"linkArray":linkArray,"linkStatus":$scope.linkStatus}).then(function(res1){
    //JWTTOKEN.requestFunction('POST','processtickets/saveProcessFlow',{"sourceTargetArray":linkProcess}).then(function(res1){
      console.log(res1);
      linkArray=[];
      linkDeleteArray=[];
      $scope.linkStatus="normal";
                localStorage.removeItem('jobTreeDraft');
                  localStorage.removeItem('jobTreeOriginal');
                  localStorage.removeItem('machineEventsDraft');
                  $scope.activated=false;
                  alert('Schedule saved successfully');

                  //////////////////////////////////////////
                  console.log('INSIDE getGanttDataFromServer')
                          jobTreeObjOriginal={};
                          jobTreeObjDraft={};
                          /* if(type!="firsttime")
                           {*/
                            
                           //}
                          
                          
                         
                          JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID).then(function(masterticketresult){

                           
                             jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
                             jobTreeObjOriginal[masterticketresult.data.id]=masterticketresult.data;
                             JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                              //JWTTOKEN.requestFunction('POST','mastertickets/getMasterTicket',{id:$scope.masterTicketID}).then(function(processes_result){

                               var processarray={};
                               for(var i=0;i<processes_result.data.length;i++)
                               {
                                 processarray[processes_result.data[i].id]=processes_result.data[i];
                               }

                               jobTreeObjDraft[masterticketresult.data.id]["processes"]= processarray;
                               jobTreeObjOriginal[masterticketresult.data.id]["processes"]= processarray;

                               localStorage['jobTreeDraft'] = JSON.stringify(jobTreeObjDraft);
                               localStorage['jobTreeOriginal'] = JSON.stringify(jobTreeObjOriginal);

                               jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);
                             jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);

                             currentJoborderDetailsOriginal=jobTreeOriginal[$scope.masterTicketID];
                             currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
                             displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,"");
                               ///////////
                              }); //end of GET','mastertickets/MASTERTICKET1/processes
                          }); //end of 'GET','mastertickets/MASTERTICKET1'
                  ///////////////////////////////////////
    });
  }
}

//---------------------------------end of function processLinkUpdate-------------------//


//**
//**
//**

//---------------------------------function updateMachineEventsNew-------------------//
//To update changed machine events 
//This function is called inside "$scope.saveSchedule" function
//following functions are called inside "updateMachineEventsNew" function
//1 . getUpdateprocessTicketDateRangeLoop

function updateMachineEventsNew(data,length,iteration)
{
  console.log('............................................................................');

   /*var machineEventsDraft_=JSON.parse(localStorage['machineEventsDraft']);
   machineEventsDraft=machineEventsDraft_[$scope.eventsReschedule[0].workcenterID];

      for (var keyMachine in machineEventsDraft) 
      {
          for (var key in machineEventsDraft[keyMachine]) 
          {
            console.log(machineEventsDraft[keyMachine]);
            console.log(key);
             if(key.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
             {
                 if((machineEventsDraft[keyMachine][key].id==data.id)&&(machineEventsDraft[keyMachine][key].durationData!=undefined))
                 {
                     endDate=calcualteEndDate(machineEventsDraft[keyMachine][key].date,machineEventsDraft[keyMachine][key].durationData,machineEventsDraft[keyMachine][key].machineID);
                 }
             }
          }
        }*/
        // var sdate=new Date(data.date);
        // console.log(sdate.toISOString());
        // console.log(endDate.toISOString());

        // console.log(new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(),  endDate.getUTCHours(), endDate.getUTCMinutes(), endDate.getUTCSeconds()))


            //var exceldate = data.date;
         //  var newdate = new Date((endDate - (25567 + 2)) * 86400 * 1000);
             //newdate.setDate(newdate.getDate() + 1);
             //newdate.setHours(0,0,0,0);

             //console.log(newdate);

  var data_obj={date : data.date,endDate:data.endDate};
  if(data.durationData!=undefined)
  {
    data_obj={date : data.date,endDate:data.endDate,durationData:data.durationData};
  }
  console.log(data);
  console.log(data_obj);
  JWTTOKEN.requestFunction('PUT','machinecalendars/'+data.id,data_obj).then(function(res){
    console.log(length)
    console.log(iteration)
    console.log(processTicket_TrackChanges_Obj)
    if(length==iteration)
    {
       getUpdateprocessTicketDateRangeLoop(processTicket_TrackChanges_Obj);
    }
  });
}

//---------------------------------end of function updateMachineEventsNew-------------------------------------//


//**
//**
//**

//---------------------------------function getUpdateprocessTicketDateRangeLoop-------------------//
//Its the loop function To update ProcesTicket's date range corresponding to machine events date change .
//This function is called from "updateMachineEventsNew" funtion
//Following functions are used inside "getUpdateprocessTicketDateRangeLoop"  funtion
//1 . getUpdateprocessTicketDateRange

getUpdateprocessTicketDateRangeLoop=function(processTicket_TrackChanges_Obj)
{
  console.log('getUpdateprocessTicketDateRangeLoop........')
  console.log(processTicket_TrackChanges_Obj);
  for(var i=0;i<processTicket_TrackChanges_Obj.length;i++)
  {
    getUpdateprocessTicketDateRange(processTicket_TrackChanges_Obj[i].id,processTicket_TrackChanges_Obj.length-1,i);
  }
}



//---------------------------------end of function getUpdateprocessTicketDateRangeLoop-------------------------------------//


//**
//**
//**

//---------------------------------function getScheduleView-------------------//
//This is called from " $scope.selectChange" functions
//Following functions used inside "getScheduleView" function
//1 . getMachineEventsFromserver
//2 . displayScheduler

 
function getScheduleView(workCenterID)
{

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
          console.log($scope.ganttid);
          console.log(currentJoborderDetailsDraft.processes[$scope.ganttid]);
        if(workCenterID=="QC")
        {
          workcenterVendorID=currentJoborderDetailsDraft.processes[$scope.ganttid].machineID;
        }
   
      machineEventsDraft_get= localStorage['machineEventsDraft'];

       if(machineEventsDraft_get!=undefined)
       {
        console.log('ifff');
           machineEventsDraft=JSON.parse(localStorage['machineEventsDraft']);
          if(machineEventsDraft[workCenterID]==undefined)
          {
            getMachineEventsFromserver(workCenterID,"addView",workcenterVendorID,function(machineevents)
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
                  displayScheduler(workCenterID,"schedulerView").then(function(result) {
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
                        displayScheduler(workCenterID,"schedulerView").then(function(result) {
                   //  alert("got result 2135")

                     $scope.eventsData= result;
                     console.log( $scope.eventsData)
                  });
          }          
       }
       else 
       {
          getMachineEventsFromserver(workCenterID,"addView",workcenterVendorID,function(machineevents)
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
                 displayScheduler(workCenterID,"schedulerView").then(function(result) {
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
}

//---------------------------------end of function getScheduleView-------------------------------------//


//**
//**
//**


//---------------------------------function getUpdateprocessTicketDateRange-------------------//
//To update ProcesTicket's date range corresponding to machine events date change .
//This function is called from "getUpdateprocessTicketDateRangeLoop" funtion
//Following functions are used inside "getUpdateprocessTicketDateRange"  funtion
//1 . getUpdatemasterTicketDateRangeLoop

function getUpdateprocessTicketDateRange(processTicketID,length,iteration)
{
  console.log('getUpdateprocessTicketDateRange//////////');
  console.log(processTicketID);
      JWTTOKEN.requestFunction('GET','machinecalendars?filter[where][processTicketID]='+processTicketID+'&filter[where][type]=machine').then(function(res){
    if(res.length!=0)
    {
      var data=res.data;
       data.sort(GetSortOrder("date"));

       console.log('date............');
       console.log(data[0].endDate);
        //var data_obj={actualstartdate : data[0].date ,actualenddate: data[data.length-1].date};  
        var data_obj={actualstartdate : data[0].date ,actualenddate:data[0].endDate};  
        JWTTOKEN.requestFunction('PUT','processtickets/'+processTicketID,data_obj).then(function(res_processticket){
             //UPDATE MASTERTICKETS DATE RANGE
             if(length==iteration)
             {
              getUpdatemasterTicketDateRangeLoop(masterTicket_TrackChanges_Obj);
             }   
        });
    }
  });
  }


//---------------------------------end of function getUpdateprocessTicketDateRange-------------------------------------//


//**
//**
//**


//---------------------------------function getUpdatemasterTicketDateRangeLoop-------------------//
//Its the loop function To update MasterTicket's date range corresponding to machine events date change .
//This function is called from "getUpdateprocessTicketDateRange" funtionb after processtciekts date range change update
//Following functions are used inside "getUpdatemasterTicketDateRangeLoop"  funtion
//1 . getUpdatemasterTicketDateRange

  getUpdatemasterTicketDateRangeLoop =function(masterTicket_TrackChanges_Obj)
  {
    console.log('getUpdatemasterTicketDateRangeLoop//////////////////');
    console.log(masterTicket_TrackChanges_Obj);
    for(var i=0;i<masterTicket_TrackChanges_Obj.length;i++)
    {
      getUpdatemasterTicketDateRange(masterTicket_TrackChanges_Obj[i].id,masterTicket_TrackChanges_Obj.length-1,i);
    }
  }


//---------------------------------end of function getUpdatemasterTicketDateRangeLoop-------------------------------------//


//**
//**
//**

//---------------------------------function getUpdatemasterTicketDateRange-------------------//

//To update MasterTicket's date range corresponding to machine events date change .
//This function is called from "getUpdatemasterTicketDateRangeLoop" funtion
//Following functions are used inside "getUpdatemasterTicketDateRange"  funtion
//1 . processLinkUpdate

getUpdatemasterTicketDateRange=function(masterTicketID,length,iteration)
  {
    console.log('getUpdatemasterTicketDateRange..........');
    console.log(masterTicketID);
    JWTTOKEN.requestFunction('POST','mastertickets/getmasterTicketDateRange',{"masterTicketID":masterTicketID}).then(function(res){
      console.log(res);
      if(res.data.length!=0)
      {

         JWTTOKEN.requestFunction('GET','mastertickets/'+masterTicketID).then(function(_masterticketdata){
          var impracticalPlan=false;
          if(new Date(_masterticketdata.data.exFactoryDate) < new Date(res.data[1].date) )
          {
            impracticalPlan=true;
          } 
                 var data_obj={actualstartdate : res.data[0].date ,actualenddate: res.data[1].date ,currentExFactoryDate: res.data[1].date ,impracticalPlan :impracticalPlan};
         JWTTOKEN.requestFunction('PUT','mastertickets/'+masterTicketID,data_obj).then(function(res_masterticket){
               //UPDATE MASTERTICKETS DATE RANGE
               if(length==iteration)
               {
                  //for process split
                    processLinkUpdate();

                  
               }   
          });
          });
        
      }
    });
  }


 /* getUpdatemasterTicketDateRange=function(masterTicketID,length,iteration)
  {
    console.log('getUpdatemasterTicketDateRange..........');
    console.log(masterTicketID);
    JWTTOKEN.requestFunction('POST','mastertickets/getmasterTicketDateRange',{"masterTicketID":masterTicketID}).then(function(res){
    if(res.data.length!=0)
    {
       var data_obj={actualstartdate : res.data[0].date ,actualenddate: res.data[1].date ,currentExFactoryDate: res.data[1].date};
       JWTTOKEN.requestFunction('PUT','mastertickets/'+masterTicketID,data_obj).then(function(res_masterticket){
             //UPDATE MASTERTICKETS DATE RANGE
             if(length==iteration)
             {
                //for process split
                  processLinkUpdate();

                
             }   
        });
    }
  });
  }*/

//---------------------------------end of function getUpdatemasterTicketDateRange-------------------------------------//


//**
//**
//**

//---------------------------------function createmachineCalendar--------------------------------------------//

//This function is calling from app.scheduler.js schedulerreschedule.attachEvent("onEventSave", event
//Following funtions are used inside "createmachineCalendar" functon
//1 . processEventFunction

createmachineCalendar=function(id,ev,is_new)
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

//---------------------------------end of function createmachineCalendar-------------------------------------//


//**
//**
//**

//---------------------------------function processEventFunction-------------------//
//Called inside createmachineCalendar
//following functions are called inside this function 
//1 . sortdateArray
//2 . afterQcScheduling

function processEventFunction(processTicketID)
{
  console.log(processTicketID);
  JWTTOKEN.requestFunction('GET','machinecalendars?filter[where][processTicketID]='+processTicketID).then(function(calendarData){
  console.log('calendarData.data');
  console.log(calendarData.data);
  /*var dateArray=[];
  for(var i=0;i<calendarData.data.length;i++)
  {
      dateArray.push(calendarData.data[i].date);
  }
  
  sortdateArray(dateArray);
  console.log(dateArray);

  var start=dateArray[0];
  var end=dateArray[parseInt(calendarData.data.length)-2]
  console.log(end);
  var obj={"start" : start ,"end" :end};*/
  var obj={"start" : calendarData.data[0].date ,"end" :calendarData.data[0].endDate};

   afterQcScheduling($scope.ganttid,machineDetails.id,obj.start,obj.end);
// return obj;
});
}


//---------------------------------end of function checkoverloadOnEventDrag-------------------------------------//


//**
//**
//**


//---------------------------------function afterQcScheduling-------------------//
//This fucntion is called from "processEventFunction" function


afterQcScheduling=function(processTicketID,machineID,startdate,enddate)
{
   console.log(startdate);
  console.log(enddate);
      var obj={"machineID" :machineID , "justAddedByPlanner" :false ,"actualstartdate" : startdate,"actualenddate" : enddate };

        JWTTOKEN.requestFunction('PUT','processtickets/'+processTicketID,obj).then(function(res){

          localStorage.removeItem('machineEventsDraft');
      
      });
}

//---------------------------------end of function afterQcScheduling-------------------------------------//


//**
//**
//**


//---------------------------------function checkblackoutorholidayforCellClick-------------------//
//Called from app.scheduler.js -- scheduler1.attachEvent("onCellClick", event
//To check whether its a holiday ,blackout day when click on a cell from schduler


 checkblackoutorholidayforCellClick=function(date,machineID,cb)
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
    }

//---------------------------------end of function checkblackoutorholidayforCellClick-------------------------------------//


//**
//**
//**


//---------------------------------function checkblackoutorholiday-------------------------------------//
//called from app.scheduler.js --schedulerreschedule.attachEvent("onBeforeEventChanged"
//CHECK WHETHER DRAGGED TO DATE IS BLACK OUT OR HOLIDAY FOR THAT MACHINE

 checkblackoutorholiday=function(date,machineEventsDraft_samples,machineID)
    {
   //   alert('Here ss')
       var count=0;
      if(machineEventsDraft_samples[machineID]!=undefined)
      {
        var length= Object.keys(machineEventsDraft_samples[machineID].machinecalendar).length;
          for(var i=0;i<length;i++)
          {
            var eventDate=new Date(machineEventsDraft_samples[machineID].machinecalendar[i].date);
             console.log(eventDate)
              console.log(date)
            if(eventDate.toISOString()==date.toISOString())
            {
              console.log('YES DATES ARE EQUAL')
              console.log(machineEventsDraft_samples[machineID].machinecalendar[i].status)
              if(machineEventsDraft_samples[machineID].machinecalendar[i].status=="holiday" || machineEventsDraft_samples[machineID].machinecalendar[i].status=="blackout" )
              {
                 console.log('count incremented')
                count++;
              }
             
            }
            else
            {
              console.log('NOT EQAUL')
            }
            if(i==length-1)
            {
              if(count>0)
              {
                console.log('true')
                return true;
              }
              else
              {
                console.log('false')
                return false;
              }
            }
          }
      }
      else
      {
        console.log('false machine ID undefined')
        return false;
      }
       
    
    }

//---------------------------------end of function checkblackoutorholiday-------------------------------------//


//**
//**
//**

//---------------------------------function checkExternalWorkcenterVendorScheduler-------------------//
//calling from the function "checkEventAccessebility"
//each external workcentervendor can have a schedulerID like this  [{"plant":"AXO1" , "schedulerID":"58b10f05920053042fc901dd"}]
//so we need to test whether loggedin  user is the of the external workcenter vendor's schduler
//get clicked processticket's masterticket's plant id == JobOrderPlantID
//get item from external workcentervendor's schedulerID object where  [{"plant":"JobOrderPlantID" , "schedulerID":"LoggedinUserID"}]
//if there is not item like this  , never allow loogedin user to schdule ,movemachine for him .
function checkExternalWorkcenterVendorScheduler(workcentervendor)
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
 
//---------------------------------function checkEventAccessebility-------------------//
//Used to check whether logged in user can reschedule events loaded on schduler view

/* function checkEventAccessebility(workcentervendor)
{
  console.log(workcentervendor);
  if(sessionStorage.getItem('role')=="scheduler" || sessionStorage.getItem('role')=="qcscheduler")
  {
    if(sessionStorage.getItem('userId')==workcentervendor.schedulerID)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  else
  {
    return false;
  }
  // else if(sessionStorage.getItem('role')=="qcscheduler")
  // {
  //   if(sessionStorage.getItem('userId')==workcentervendor.QCSchedulerID)
  //   {
  //     return false;
  //   }
  //   else
  //   {
  //     return true;
  //   }
  // }
  
}*/

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
    return checkExternalWorkcenterVendorScheduler(workcentervendor);
  }
 
}

//dxffcc ggg jjj 
//---------------------------------end of function checkEventAccessebility-------------------------------------//


//**
//**
//** 

//---------------------------------function CheckProcessFactoryOutdatedOnDrag-------------------//

CheckProcessFactoryOutdatedOnDrag=function(processTicketID)
{
 //get changed machine's process details by id 
 //get masterticket id from process details
 //get we could get its predecessorID ,successorID 
 //first take its predecessorID and get its details 
 //check whether predecessor's enddate +slacktime > process's startdate -- then all its previous processes are get 
 //  factory outdated
 //check whether process's enddate +slacktime > successor's startdate --then all its successor processes are get
 // factory outdated

 //This function is called from app.scheduler.js --schedulerreschedule.attachEvent("onBeforeEventChanged", event
 //Following functions are called inside this funtion
 //1 . checkpredecessors
 //2 . checkSuccessors

  var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);               
  var predecessorID= jobTreeDraft[$scope.masterTicketID].processes[processTicketID].predecessorID;
  var successorID= jobTreeDraft[$scope.masterTicketID].processes[processTicketID].successorID;
  var actualstartdate=jobTreeDraft[$scope.masterTicketID].processes[processTicketID].actualstartdate;
  var actualenddate=jobTreeDraft[$scope.masterTicketID].processes[processTicketID].actualenddate;
  var result=[];
  var predObj=   checkpredecessors(actualstartdate,predecessorID);
  var succObj = checkSuccessors(actualenddate,successorID);
  result=result.concat(predObj);
  result=result.concat(succObj);
  return result;

}



//---------------------------------end of function CheckProcessFactoryOutdatedOnDrag-------------------------------------//


//**
//**
//**


//---------------------------------function getProcessStartEndDate----------------------------------------------//
//This function is used to get a process ticket's startend date
//This function is calld inside app.scheduler.js -- schedulerreschedule.attachEvent("onBeforeEventChanged", event

getProcessStartEndDate=function(jsonObject,processTicketID)
{
  
   var dateObj=[];
   for(var key_machinecalendar in jsonObject) 
    {
       if (key_machinecalendar.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
       {
          if(jsonObject[key_machinecalendar].processTicketID==processTicketID)
          {
            console.log(jsonObject[key_machinecalendar]);
            dateObj.push({"date" :jsonObject[key_machinecalendar].date })
            //dateObj.push({"date" :jsonObject[key_machinecalendar].date,"endDate":jsonObject[key_machinecalendar].endDate })
          }
       }
    }
    dateObj.sort(GetSortOrder("date"));
    //console.log(dateObj);
    var obj=[dateObj[0].date,dateObj[dateObj.length-1].date];
   // var obj=[dateObj[0].date,dateObj[dateObj.length-1].endDate];
    return obj;
}



//---------------------------------end of function getProcessStartEndDate-------------------------------------//


//**
//**
//**

//---------------------------------function sortdateArray-------------------//
//Used to sort date array
//This function is called inside following functions
//1 .  $scope.StoreAdd
//2 . processEventFunction
//3 . 

function sortdateArray(sortArray)
{
  sortArray.sort(function(a,b){
      return new Date(a) - new Date(b);
  });
}

//---------------------------------end of function sortdateArray-------------------------------------//


//**
//**
//**

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
calcualteEndDate=function(date, duration,machineID)
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
}



 /*calcualteEndDate=function(date, duration,machineID)
 {
    //-------Feed from Local storage/server API---------------
    console.log(date);
    console.log(duration);
    var machineHoliday=getHolidayForAMachine(machineID);
    console.log(machineHoliday);
    var holiday=[];

    for(var i=0;i<machineHoliday.length;i++)
    {
      holiday.push(new Date(machineHoliday[i].date));
    }

    console.log(holiday);
    var startDate = new Date(date);
    var endDate = new Date(date), noOfDaysToAdd = duration, count = 0;
    console.log(startDate);
    console.log(endDate);
    while (count < noOfDaysToAdd) {
        endDate.setDate(endDate.getDate()+1)
             if (!isHoliday(endDate, holiday)) {
            count++;
        }
    }
    console.log(endDate);
  return endDate;
}*/


//---------------------------------end of function calcualteEndDate-------------------------------------//


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

//---------------------------------function dateDuartionFunction-------------------//
//USED to get the days between a startdate ,end date

 function  dateDuartionFunction(startdate,endDate)
      {

          var today = new Date(startdate);
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!

          var yyyy = today.getFullYear();
          if(dd<10){
              dd='0'+dd;
          } 
          if(mm<10){
              mm='0'+mm;
          } 
          var today = dd+'-'+mm+'-'+yyyy;

          var days=Math.round((endDate-startdate)/(1000*60*60*24));
          return [today,days];
      }




//---------------------------------end of function dateDuartionFunction-------------------------------------//


//**
//**
//**


//---------------------------------function getvendordetails----------------------------------------------//
//Get vendor & its details corresponding to seelcted workcenter from processs add dialog
//Get vendor details from vendorID 
//It is used to filter machine events based on vendor
//THis is called inside "getVendors" function

function getvendordetails(vendorIDS)
  {
         var obj={"vendors" :vendorIDS };
         JWTTOKEN.requestFunction('POST','vendors/getVendorDetails',obj).then(function(result){
          result.data=result.data.concat([{"id" : "all" , "name" : "all vendors"},{"id" : "nearestavailable" , "name" : "Filter by Nearest avialable Date"}]);
            $scope.vendors=result.data;

          JWTTOKEN.requestFunction('GET','workcenters?filter[where][name]=QC').then(function(qcworkcenter){

                        var obj={workCenterID :qcworkcenter.data[0].id  , userID : sessionStorage.getItem("userId")}
               JWTTOKEN.requestFunction('POST','machinecalendars/getMachinesForQCscheduler',obj).then(function(machines){

                           console.log(machines)
                            $scope.machines=machines.data;

                         });

         });
        });
  }

  /*function getvendordetails(vendorIDS)
  {
         var obj={"vendors" :vendorIDS };
         JWTTOKEN.requestFunction('POST','vendors/getVendorDetails',obj).then(function(result){
          result.data=result.data.concat([{"id" : "all" , "name" : "all vendors"},{"id" : "nearestavailable" , "name" : "Filter by Nearest avialable Date"}]);
            $scope.vendors=result.data;

         });
  } */


//---------------------------------end of function getvendordetails-------------------------------------//


//**
//**
//**


//---------------------------------function onlyUnique-------------------//
//To get unique values from an array
//This function is usd inside "getVendors" function

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


//---------------------------------end of function onlyUnique-------------------------------------//


//**
//**
//**

//---------------------------------function getVendors-------------------//
//Get vendor corresponding to seelcted workcenter from processs add dialog
//This function is called from "$scope.DyeingChange" 
 function getVendors()
 {
                    console.log('gettttttttttt')
                    console.log($scope.workCenterID)
                    var s=localStorage['machineEventsDraft'];
                    console.log(s)
                    if(s!=undefined)
                    {
                        var machineEventsDraftFull = JSON.parse(localStorage['machineEventsDraft']);
                        console.log(machineEventsDraftFull)
                        console.log($scope.workCenterID)
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
                        var unique = uniqueVendors.filter( onlyUnique );
                         console.log(unique)
                         getvendordetails(unique);
                  }
                  else
                  {

                    console.log('$scope.processticket............');
                    console.log($scope.processticket);
                      getMachineEventsFromserver($scope.workCenterID,"addView",undefined,function(machineevents)
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
                        var unique = uniqueVendors.filter( onlyUnique );
                         console.log(unique)
                         getvendordetails(unique);

                      });

                  }

             }

//---------------------------------end of function getVendors-------------------------------------//


//**
//**
//**


//---------------------------------function dateUpdateFun-------------------//
//This function is called from "StoreAdd" function
//

dateUpdateFun=function(machineDetailsLength,iter,arrayDate)
{
      console.log(machineDetailsLength);
      console.log(iter);
      if(iter==machineDetailsLength)
      {
        console.log('machineeeeeee');
         var selected = $filter('unique')(arrayDate, 'type');
         for(var k=0;k<selected.length;k++)
         {
          
          var putObj={"machineID":selected[k].machineID};
                if(selected[k].type!="normaldate")
                {
                   var justAddedByPlanner=false;
                  if(selected[k].type=="qccontainerdate")
                  {
                    justAddedByPlanner=true;
                  }
                  putObj={
                      "machineID":selected[k].machineID,
                      "actualstartdate":selected[k].dateArray[0],
                      "actualenddate":selected[k].dateArray[(selected[k].dateArray.length)-1],
                      "planstartdate":selected[k].dateArray[0],
                      "planenddate":selected[k].dateArray[(selected[k].dateArray.length)-1],
                      "statusupdatePercentage" : "0",
                      "lastStatusUpdateOn" : "No updates done",
                      "justAddedByPlanner" : justAddedByPlanner
                    }
                }
                    console.log(putObj);
           updateProcessTicket(selected[k].pID,putObj);
         }
         
      }
}

//---------------------------------end of function dateUpdateFun-------------------------------------//


//**
//**
//**

//---------------------------------function updateProcessTicket-------------------//
//this function is called from "StoreAdd"

updateProcessTicket=function(processTicketID,obj,type)
{

      JWTTOKEN.requestFunction('GET','machinecalendars?filter[where][processTicketID]='+processTicketID).then(function(machinecalendar){

                    var eventLength=machinecalendar.data.length;

                    obj.statusupdatePercentage="0/"+eventLength ;
                    obj.lastStatusUpdateOn= "No updates done";
                      JWTTOKEN.requestFunction('PUT','processtickets/'+processTicketID,obj).then(function(processResult){
                          if(type=="invoice")
                          {
                            JWTTOKEN.requestFunction('PUT','mastertickets/'+processResult.data.masterTicketID,{"exFactoryDate":processResult.data.actualenddate}).then(function(processResult){

                            });
                          }
              });
              }); 
}

//---------------------------------end of function updateProcessTicket-------------------------------------//


//**
//**
//**

//---------------------------------function setAnAttributeValueOnObject_FromFilter_ByKeyValuePair-------------------//
//This function is called from app.scheduler.js -- schedulerreschedule.attachEvent("onBeforeEventChanged",  event
//This is used to filter an attribute from an object & its  value
//
setAnAttributeValueOnObject_FromFilter_ByKeyValuePair=function(theObject,filterkey,value,setkey,setvalue,setkey2,setvalue2)
{
   for(var i=0;i<theObject.length;i++)
   {
     var instance=theObject[i];
      if(instance[filterkey] == value )
      {
        instance[setkey]=setvalue;
        if((setkey2!=undefined) && (setvalue2 !=undefined))
        {
          instance[setkey2]=setvalue2;
        }
        return theObject;
      }
   }

   return false;
}



//---------------------------------end of function setAnAttributeValueOnObject_FromFilter_ByKeyValuePair-------------------------------------//


//**
//**
//**


//---------------------------------function getMachineEventsFromserver-------------------//
//This function is called to display machine calendar events to different type of users
//Planner need to show all machines under a workcenter under all workcentervendors
//But scheduler only need to show the schduled machine for a particular processticket
//QC need to show only QC machines under his workcentervendor
//this function is called from "schedulerScopeLoad" function

getMachineEventsFromserver=function(workCenterID,type,workcenterVendorID,cb)
{


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
              //alert('based on workcenter fetch')
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
}

//---------------------------------end of function getMachineEventsFromserver-------------------------------------//


//**
//**
//**


////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------FUNCTION DECLARATIONS ENDS HERE-----------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////////


//**
//**
//**
//**
//**


////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------SCOPE FUNCTION DECLARATIONS---------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////////
//SCOPE functions are called from its corresponding HTML page 


//---------------------------------function vendorChange-------------------------------------------//





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****FILTER MACHINE AND EVENTS USING VENDORS,NEAREST AVAIBALE DATE ,ALL FOR PLANNER'S SCHEDULER VIEW ON PLANNING STAGE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//. We need vendor filter , nearest available date filter for machines on when planner planning processes on machine level
// .For that loading vendors having a selected workcenter's machine's will display on filter dropdown from  " $scope.DyeingChange"
//. On "$scope.DyeingChange" we are calling "getVendors" function to load vendors having a selected workcenter's machine's 
//. on "getVendors" filtering data from localstorage "machineEventsDraft" .If there is no data on localstorage "machineEventsDraft"
//  get machine events for selected workcenter from server 
//. Then get unique vendor ID  from the data in to an array. Then get each vendorsID's details (name,id) using "getvendordetails" function
//. setting  $scope.vendors value from "getvendordetails" function .  $scope.vendors used to load vendors on dropdown for filter
//. "$scope.vendorChange" will trigger when selecting one vendor  from  filter dropdown 
//. when selecting "Filter by Nearest avialable Date"  from dropdown , we need to call "machinecalendars/getNearestAvailableDateOfMachines" api
//. The api result will the machine ID s order by its nearest available date on acsending order
//. Then getting machine data from localstorage on the above order 
//. Then displaying palnner's schduler view using the above data using "displaySchedulerNew" function


//following functions are invoked "vendorChange"
//1 . displaySchedulerNew


   $scope.vendorChange=function(selectedVendor)
   {
        var data={};
        var workCenterID;
        var machineEventsDraftFull = JSON.parse(localStorage['machineEventsDraft']);
        var machineEventsDraft=machineEventsDraftFull[$scope.workCenterID];
        var size = Object.keys(machineEventsDraft).length;

        if(selectedVendor.id=="all")
        {
               data=machineEventsDraft;
             //  displaySchedulerBasedOnVendorFilter(data,workCenterID,"schedulerView");
               displaySchedulerBasedOnVendorFilter(data,workCenterID,"schedulerView").then(function(result){
                    //alert('aaaaaa');
                    console.log('call back for scheduler');
                    console.log(result)
                     $scope.eventsData = result;
                  });
        }
        else if(selectedVendor.id=="nearestavailable")
        { 
              var obj={workCenterID :$scope.workCenterID};
              console.log(obj)
              JWTTOKEN.requestFunction('POST','machinecalendars/getNearestAvailableDateOfMachines',obj).then(function(result){
                console.log(result)

                     var i=0;
                     for(var i=0;i<result.data.length;i++)
                     {
                       data[result.data[i].machineID]=machineEventsDraft[result.data[i].machineID];
                       workCenterID=machineEventsDraft[result.data[i].machineID].workCenterID;
                         console.log(data)
                         if(i==result.data.length-1)
                         {
                          //displaySchedulerBasedOnVendorFilter(data,workCenterID,"schedulerView");
                            displaySchedulerBasedOnVendorFilter(data,workCenterID,"schedulerView").then(function(result){
                              //alert('aaaaaa');
                              console.log('call back for scheduler');
                              console.log(result)
                               $scope.eventsData = result;
                            })
                         }
                     }
                  });
        } 
        else
        {
            for(var key in machineEventsDraft)
            {
              if(machineEventsDraft[key].workcentervendor.vendorID==selectedVendor.id)
              {
                data[key]=machineEventsDraft[key];
                workCenterID=machineEventsDraft[key].workCenterID;
              }
            }
         //   displaySchedulerBasedOnVendorFilter(data,workCenterID,"schedulerView");

            displaySchedulerBasedOnVendorFilter(data,workCenterID,"schedulerView").then(function(result){
                    //alert('aaaaaa');
                    console.log('call back for scheduler');
                    console.log(result)
                     $scope.eventsData = result;
                  })



       }
   }


//---------------------------------end of function vendorChange-------------------//

//**
//**
//**


//---------------------------------function MoveToNewMachineDialogOpen-------------------//
//This function is called 
//when right click on a gantt + scheduler view's event
//a dialog will open with option to chnage process's machineID 
//This function is called from app.scheduler.js --> schedulerreschedule.attachEvent("onContextMenu", function (id, e){

$scope.showDurationChange=false;

MoveToNewMachineDialogOpen = function (e) {
  //rinsha code for duration change

  $scope.showDurationChange=true;

   getVendors();
   $scope.showTab=true;
   $scope.movemachine=true;



     console.log($scope.workCenterID);
         
    var workcenterID=$scope.workCenterID;
    //alert("MoveToNewMachineDialogOpen")
    // alert(workcenterID)
    //call function to load machine vents in newly open  dialog
     getScheduleView(workcenterID);


     if($scope.workCenterID=="QC")
     {
      $scope.qcschedule=true;
     }
     else
     {
      $scope.qcschedule=false;
     }
     //
     console.log(workcenterID)
     console.log( $scope.ganttid)
    var userid=sessionStorage.getItem('userId');
    var workcentervendors;
    //get all workcenter vendors where this user is the scheduler
     //  JWTTOKEN.requestFunction('GET','workcentervendors?filter[where][schedulerID]='+userid+'&filter[where][workcenterID]='+workcenterID).then(function(workcentervendors){
      var obj={workcenterID :workcenterID , userID :userid};
      JWTTOKEN.requestFunction('POST','workcentervendors/getSchedulerWorkcentervendor',obj).then(function(workcentervendors){

             $scope.workcentervendors=workcentervendors.data;

             console.log($scope.workcentervendors)

          $mdDialog.show({
                    //templateUrl: 'templates/processDialog.html',
                    templateUrl: 'templates/Processes/ProcessDialog.html',
                      locals: { dataToPass:  $scope.workcentervendors },
                      controller: function DialogController($scope, $mdDialog,dataToPass) {
                          processFetch();

                          var dialogData = {};
                          dialogData.workcentervendors = dataToPass;
                          $scope.dialogData = dialogData;

                           $scope.workcentervendorOnChange = function(selectedworkcentervendor) { 
                            console.log(selectedworkcentervendor);
                           
                               JWTTOKEN.requestFunction('GET','machines?filter[where][workcenterVendorID]='+selectedworkcentervendor.id).then(function(machines){
                                         $scope.dialogData.machines=machines.data;
                                         console.log(selectedworkcentervendor)
                                         if(selectedworkcentervendor.type=="external")
                                         {
                                           $scope.selectedmachine=machines.data[0].id;
                                         }
                                        
                                  });
                           };

                            $scope.machineOnChange = function(selectedmachine) {
                             console.log(selectedmachine) 
                             $scope.selectedmachine=selectedmachine;
                              console.log($scope.selectedmachine)
                            };

                            $scope.MoveToNewMachine=function()
                            {
                                var obj={processTicketID : $scope.ganttid , machineID :  $scope.selectedmachine};   
                                       JWTTOKEN.requestFunction('POST','machinecalendars/allotNewMachineToAProcess', obj).then(function(status){
                                   if(status.data.status=="success")
                                   {
                                    var processObj={ machineID :  $scope.selectedmachine};
                                          JWTTOKEN.requestFunction('PUT','processtickets/'+$scope.ganttid, processObj).then(function(status){
                                            alert("moved sucessfully");
                                             localStorage.removeItem('machineEventsDraft');
                                           //   $window.location.href = '#/panelView/' + $scope.masterTicketID;
                                     $mdDialog.hide();
                                     onTaskRowClickFun($scope.ganttid);
                                      });
                                    
                                   }
                              });
                            }

                             $scope.distributeQCTicket=function(machines)
                            {
                              console.log(machines)
                              var processIDtoSplit=$scope.ganttid;

                               var obj={processIDtoSplit : $scope.ganttid , noofSplit :  machines.length , machines :machines};   
                                       JWTTOKEN.requestFunction('POST','processtickets/QCTicketSplit', obj).then(function(status){
                                    console.log(status)
                                    alert("QC Ticket Distributed Successfully")
                                     $mdDialog.hide();
                                       $window.location.href = '#/panelView/' + $scope.masterTicketID;
                              });

                            }

                            /*$scope.MoveToNewMachine=function()
                            {
                                var obj={processTicketID : $scope.ganttid , machineID :  $scope.selectedmachine};   
                                       JWTTOKEN.requestFunction('POST','machinecalendars/allotNewMachineToAProcess', obj).then(function(status){
                                   if(status.data.status=="success")
                                   {
                                    alert("moved sucessfully");
                                     $mdDialog.hide();
                                   }
                              });
                            };*/

                      }, // controlelr passed to dialog ends,
                    parent: angular.element(document.body),
                    targetEvent: e,
                    scope: $scope,
                    preserveScope: true,  // do not forget this if use parent scope
                    clickOutsideToClose:false
                  })
  });
}




//---------------------------------end of function MoveToNewMachineDialogOpen-------------------------------------//

//**
//**
//**


//---------------------------------function AddMoreFabric-------------------//


//---------------Add More Fabric------------------------------------
/*called from stores process forma
Author :prasad
Date:09-Feb-2107*/

$scope.AddMoreFabric = function(){
  console.log('more yarn');
  var counterFab = $scope.Fabriccounter ;
   $scope.processticket.Fabric.push(   { 
        "fabric_ExpectedDate": "fabric_date_"+counterFab, 
        //"fabric_Text_Val": "fabric_"+counterFab,
        "fabric_Text_Val": "",
        "fabric_availability_Name": "fabric_availability_"+counterFab,
        "Options": ["Yes", "No", "Partial"]
      });
   
        $scope.Fabriccounter = $scope.Fabriccounter +1;
}



//---------------------------------end of function AddMoreFabric-------------------//

//**
//**
//**



//---------------------------------function AddMoreYarn-------------------//


//----------------Add More Yarn---------------------------------------------------
 /*called from stores process forma
Author :prasad
Date:09-Feb-2107*/


$scope.AddMoreYarn = function(){
  console.log('more yarn');
  var counter = $scope.counter;
   $scope.processticket.Yarns.push(   { 
        "yarn_ExpectedDate": "yarn_date_"+counter, 
        "yarn_Text_Val": "",
        "yarn_availability_Name": "yarn_availability_"+counter,
        "Options": ["Yes", "No", "Partial"]
      });
   console.log( $scope.processticket.Yarns);
        //counter = counter++
        $scope.counter = $scope.counter +1;
}



//---------------------------------function AddMoreYarn-------------------//

//**
//**
//**

//---------------------------------function saveSchedule-------------------//

//SAVE SCHEDULE AS PER CURRENT SCHEDULE VIEW 
//1 .  update each machine calendar events as per latest schdule
//2 . Then update Cliked process's (from the gantt) actual start date,actual end date
//3  . Then update its masterTickets actualstartdate,actualenddate 

//following functions are used inside "saveSchedule" function
//1. updateMachineEventsNew
//2 . processLinkUpdate
//3 . 
$scope.saveSchedule=function()
{
  $scope.activated=true;
  //SIKHA CHNAGES DONE
  console.log(machineCalendar_TrackChanges_Obj);
  console.log(machineCalendar_TrackChanges_Obj.length)
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  for(var i=0;i<machineCalendar_TrackChanges_Obj.length;i++)
  {
     updateMachineEventsNew(machineCalendar_TrackChanges_Obj[i],machineCalendar_TrackChanges_Obj.length-1,i);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////
    //for process split
    //if machineCalendar_TrackChanges_Obj==0
    if(machineCalendar_TrackChanges_Obj.length==0)
    {
       processLinkUpdate();
    }
   
}


//---------------------------------function saveSchedule--------------------------------------------------------//

//**
//**
//**

//---------------------------------function addProcess-------------------//
//Functions called inside this funtion "processFetch"
//add process button 
    /*$scope.addProcess=function(ev)
      {
        localStorage.removeItem('machineEventsDraft');
        markedArray=[];
        $scope.showTab=false;
          $mdDialog.show({
              //templateUrl: 'templates/processDialog.html',
              templateUrl: 'templates/Processes/ProcessDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              scope: this,
              preserveScope: true,  // do not forget this if use parent scope
              clickOutsideToClose:true,
              controller: function processDialogController($scope, $mdDialog) {

                processFetch();

                $scope.taskClick="button";
                /////////code by rinsha endss///////////////////////////
                $scope.processdialog=true;
                $scope.dyeingEnd=false;
                }//controller endss
            }) //md-dialog
      }*/

//---------------------------------end of function addProcess-------------------------------------//


//**
//**
//**

//---------------------------------function splitChange-------------------//
//Functions called inside this funtion "processFetch"


/* $scope.splitChange=function(number)
{
    $scope.fullTask=gantt.getTaskByTime();
    $scope.totalinput=number;
    processFetch(); 
    var myEl = angular.element( document.querySelector( '#myDiv' ) );

    myEl.html('');
   // myEl.append('<label>Task Name</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <label>Quantity</label><br><br>');
    myEl.append('<label>Task Name</label><br><br>');
    
    for(var i=0;i<number;i++)
    {
      //myEl.append('<input type="text" id="taskId'+(i+1)+'">&nbsp;<input id="quantity'+(i+1)+'"><br><br>'); 
       myEl.append('<input type="text" id="taskId'+(i+1)+'"><br><br>'); 
      $compile(myEl)($scope);
    }

}*/

//---------------------------------end of function splitChange-------------------------------------//


//**
//**
//**


//---------------------------------function splitFun-------------------------------------------------------------//
//used to split a processs ticket
//Functions called inside this funtion "displayGantt"

$scope.splitFun=function(splitObj)
{

         /*var attributesData=[];
         for(var i=1;i<=splitObj.no;i++)
          {
            //var quantityVal=document.getElementById('quantity'+i).value;
            var processVal=document.getElementById('taskId'+i).value;
            //attributesData.push({"quantity":quantityVal,"processName":processVal,"predecessor":"","successors":""});
            attributesData.push({"quantity":"0","processName":processVal,"predecessor":"","successors":""});
          }

          JWTTOKEN.requestFunction('POST','processtickets/splitAProcessTicket',{processID:$scope.rightClickTask,attributes:attributesData}).then(function(resultSplit){
*/

             //Processticket.SplitProcess({processIDtoSplit:$scope.rightClickTask,noofSplit:splitObj.no},function(resultSplit){

              

              Processticket.SplitProcess({processIDtoSplit:$scope.rightClickTask,noofSplit:splitObj.no})
              .$promise
              .then(function(resultSplit){

                console.log(resultSplit);

               $scope.linkStatus="split";


              jobTreeObjOriginal={};
              jobTreeObjDraft={};
              JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID).then(function(masterticketresult){

               
                 jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
                 jobTreeObjOriginal[masterticketresult.data.id]=masterticketresult.data;
                 JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                  //JWTTOKEN.requestFunction('POST','mastertickets/getMasterTicket',{id:$scope.masterTicketID}).then(function(processes_result){

                   var processarray={};
                   for(var i=0;i<processes_result.data.length;i++)
                   {
                     processarray[processes_result.data[i].id]=processes_result.data[i];
                   }

                   jobTreeObjDraft[masterticketresult.data.id]["processes"]= processarray;
                   jobTreeObjOriginal[masterticketresult.data.id]["processes"]= processarray;

                   localStorage['jobTreeDraft'] = JSON.stringify(jobTreeObjDraft);
                   localStorage['jobTreeOriginal'] = JSON.stringify(jobTreeObjOriginal);

                   jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);
                 jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);

                 currentJoborderDetailsOriginal=jobTreeOriginal[$scope.masterTicketID];
                 currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
                 displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,"");
                   ///////////
                    $mdDialog.hide();
                  }); //end of GET','mastertickets/MASTERTICKET1/processes
              }); //end of 'GET','mastertickets/MASTERTICKET1'
          });
}



//---------------------------------end of function splitFun-------------------------------------//


//**
//**
//**



//---------------------------------function QRReject------------------------------------------------------//
//following functions are used inside "QRReject" function
//1. displayGantt
//Used to call reject a process ticket after its inline QC


$scope.QRReject=function(ProcessQR,reworkProcess)
{

    JWTTOKEN.requestFunction('POST','processtickets/ProcessReworkCreateDuplicates',{rejectedProcessID:ProcessQR,reworkStartProcessID:reworkProcess}).then(function(QRresult){

                        jobTreeObjOriginal={};
                        jobTreeObjDraft={};

                         
                          JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID).then(function(masterticketresult){

                           
                               jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
                               jobTreeObjOriginal[masterticketresult.data.id]=masterticketresult.data;
                               JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                                //JWTTOKEN.requestFunction('POST','mastertickets/getMasterTicket',{id:$scope.masterTicketID}).then(function(processes_result){

                                       var processarray={};
                                       for(var i=0;i<processes_result.data.length;i++)
                                       {
                                         processarray[processes_result.data[i].id]=processes_result.data[i];
                                       }

                                       jobTreeObjDraft[masterticketresult.data.id]["processes"]= processarray;
                                       jobTreeObjOriginal[masterticketresult.data.id]["processes"]= processarray;

                                       localStorage['jobTreeDraft'] = JSON.stringify(jobTreeObjDraft);
                                       localStorage['jobTreeOriginal'] = JSON.stringify(jobTreeObjOriginal);

                                       jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);
                                     jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);

                                     currentJoborderDetailsOriginal=jobTreeOriginal[$scope.masterTicketID];
                                     currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
                                     displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,"");
                                });
                            });

                    $mdDialog.hide();
    });
}

//---------------------------------end of function QRReject------------------------------------------------------//




//---------------------------------function selectTypeChange------------------------------------------//


$scope.selectTypeChange=function(select)
{
  if(select=="create")
  {
    $scope.createView=true;
  }
  
}

//---------------------------------end of function selectTypeChange-------------------------------------//


//**
//**
//**




//---------------------------------function showTabDialog-------------------//

$scope.showTabDialog=function(ev){

     $mdDialog.show({
          templateUrl: 'templates/popupNew.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
        })
      }


//---------------------------------end of function showTabDialog-------------------------------------//


//**
//**
//**


//---------------------------------function schedulemachine-------------------//
//Used schdule process's machine event based on start date ,Duration 


$scope.schedulemachine=function(scheduleDuration)
{
  $scope.showTab=false;

  normalmachine=[];
  machine=[];
  console.log(machineArray);
    for(var key in machineArray)
    {
     /* if(machineArray[key][0].details.type=="normal")
      {*/
        for(var i=0;i<machineArray[key].length;i++)
        {
          normalmachine.push(machineArray[key][i].date)
        }
        machine=machineArray[key][0].details;

      //}
    }

    $scope.processtartDate=startDate;
    $scope.processEndDate=endDate;

}

//---------------------------------end of function schedulemachine-------------------------------------//


//**
//**
//**

//---------------------------------function createTypeChange-------------------//



$scope.createTypeChange=function(createType)
    {
      $scope.sucessProcess=[];
      $scope.createType=createType;
      if(createType=="inbetween")
      {
             // JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                JWTTOKEN.requestFunction('GET','processtickets?filter[where][masterTicketID]='+$scope.masterTicketID+'&filter[order]=sequentialorParrallelOrderNo ASC&filter[include]=machine').then(function(processes_result){
                  $scope.processes=processes_result.data;
      
                  JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC&filter[where][parentProcessID]='+$scope.rightClickTask+'&filter[where][processType]=outwardlogistics').then(function(logistic_result){

                    //JWTTOKEN.requestFunction('GET','processtickets?filter[where][masterTicketID]='+$scope.masterTicketID+'&filter[order]=sequentialorParrallelOrderNo ASC&filter[where][parentProcessID]='+$scope.rightClickTask+'&filter[where][processType]=outwardlogistics&filter[include]=machine').then(function(logistic_result){

                    console.log('logistic_result...................');

                    console.log(logistic_result);
                    var seq=parseInt(logistic_result.data[0].sequentialorParrallelOrderNo);


                      var newprocess=[];
                      var fullprocess=processes_result.data;
                      console.log(fullprocess);

                      for(var i=0;i<fullprocess.length;i++)
                      {
                        if((parseInt(fullprocess[i].sequentialorParrallelOrderNo) >= seq) && (fullprocess[i].processType == "process"))
                        { 
                            if(fullprocess[i].id != $scope.rightClickTask)
                            {
                              newprocess.push(fullprocess[i]);
                            }
                            
                          
                            
                         
                          
                        }
                      }
                      console.log(newprocess);
                      $scope.sucessProcess=newprocess;

                      /*$scope.successorprocesses=logistic_result.data[0].successorID;
                      var newprocess=[];
                      var fullprocess=processes_result.data;
                      for(var i=0;i<fullprocess.length;i++)
                      {
                        for(var j=0;j<$scope.successorprocesses.length;j++)
                        {
                          if(fullprocess[i].id==$scope.successorprocesses[j].id)
                          {
                            newprocess.push(fullprocess[i]);
                          }
                        }
                      }
                      $scope.sucessProcess=newprocess;*/

                    });
                });
              
      }
    }

/* $scope.createTypeChange=function(createType)
    {
      $scope.createType=createType;
      if(createType=="inbetween")
      {
              JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                  $scope.processes=processes_result.data;
                  JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC&filter[where][parentProcessID]='+$scope.rightClickTask+'&filter[where][processType]=outwardlogistics').then(function(logistic_result){
                      $scope.successorprocesses=logistic_result.data[0].successorID;
                      var newprocess=[];
                      var fullprocess=processes_result.data;
                      for(var i=0;i<fullprocess.length;i++)
                      {
                        for(var j=0;j<$scope.successorprocesses.length;j++)
                        {
                          if(fullprocess[i].id==$scope.successorprocesses[j].id)
                          {
                            newprocess.push(fullprocess[i]);
                          }
                        }
                      }
                      $scope.sucessProcess=newprocess;
                    });
                });
              
      }
    }*/



//---------------------------------end of function createTypeChange-------------------------------------//


//**
//**
//**
  

//---------------------------------function closeDialog-------------------//

 $scope.closeDialog = function() 
 {
      $mdDialog.hide();
 }

//---------------------------------end of function closeDialog-------------------------------------//


//**
//**
//**


//---------------------------------function DyeingChange-------------------//


$scope.DyeingChange=function(meter)
{

  console.log('dyeingggggggggggggg');
    processQuantity=meter;
     getVendors();
    $scope.showTab=true;
}

//---------------------------------end of function DyeingChange-------------------------------------//


//**
//**
//**


//---------------------------------function selectChange-------------------//


   $scope.selectChange=function(workCenter)
  { 
    // if(!$scope.movemachine)   
    // {
      console.log($scope.role)
      if((!$scope.movemachine) && ($scope.role !="qcscheduler"))   
      {
          console.log('select change.............');         
          $scope.workCenterID=workCenter.id;
         getScheduleView(workCenter.id);
      
       //  alert("selectChange")    
   // alert(workCenter.id) 
        
    } 
   
  }

//---------------------------------end of function selectChange-------------------------------------//


//**
//**
//**

//---------------------------------function createBeforeTypeChange-------------------//


 $scope.createBeforeTypeChange=function(before)
  {
    $scope.createBeforeType=before.id;
  }


//---------------------------------end of function createBeforeTypeChange-------------------------------------//


//**
//**
//**


//---------------------------------function StoreAdd-------------------//
//Following functions are called inside this function
//1 . dateUpdateFun
//2 . updateProcessTicket
//3 .sortdateArray
 // $scope.StoreAdd=function(workCenter,processData)
  $scope.StoreAdd=function(processData)
 {

  console.log($scope.workCenter);
  var workCenter=$scope.workCenter;

        $scope.linkStatus="normal";
        info = JSON.parse(sessionStorage.getItem("info"));
        var previousProcessData;
        var nextProcessData;
        var newObj;
        var seq=parseInt($scope.maxSequential)+parseInt(10);

       var masterObj=[{ 
                     "processName": workCenter.name,
                    "salesorderNumber": info.salesorderNo,
                    "vendorname": "ab",
                    'lineItemNo': info.lineItemNo,
                    "customerPOorCOD": info.customerPOorCOD,
                    "designname": info.designName,
                    "ColourCode": info.colourcode,
                    "materialGroup1": info.materialGroup1,
                    "materialGroup2": info.materialGroup2,
                    "quantity": info.quantity,
                    'exFactoryDate': info.exFactoryDate,
                    "customerName":info.customerName,
                    "customerColourCode":info.customerColourCode,
                    "currentDelay":info.currentDelay,
                    "workcenterID":workCenter.id,
                    "masterTicketID":info.id,
                    "sequentialorParrallelOrderNo":seq,
                    "slacktime":"22222",
                    "parentProcessID":"",
                    "predecessorID":[],
                    "successorID":[],
                    "processType":"process"
                   // "workcenterID":
                  }];



                if(workCenter.name.toLowerCase()=="finalqc")  
                {

                          masterObj[0].processName="Final QC";
                          masterObj[0].processType="finalQC";
                          masterObj[0].actualstartdate=$scope.processtartDate;
                          masterObj[0].actualenddate=$scope.processtartDate;


                          JWTTOKEN.requestFunction('POST','processtickets',masterObj).then(function(result){

                              for(var i=0;i<normalmachine.length;i++)
                              {
                                var machineCalendarObj={
                                            "type":"machine",
                                            "machineID":machine.id,
                                            "date":normalmachine[i],
                                            "processTicketID":result.data[0].id,
                                            "workcenterVendorID":machine.workcenterVendorID,
                                            "status": "booked",
                                            "deletedStatus": false,
                                            "usedCapacity":machine.capacity,
                                            "statusUpdates": []
                                          };

                                JWTTOKEN.requestFunction('POST','machinecalendars',machineCalendarObj).then(function(calendarData){


                                          var putObj={
                                            "machineID":calendarData.data.machineID,
                                            "statusupdatePercentage" : "0",
                                            "lastStatusUpdateOn" : "No updates done",
                                            "justAddedByPlanner" : false
                                          }
                                       JWTTOKEN.requestFunction('PUT','processtickets/'+result.data[0].id,putObj).then(function(calendarData){
                                        updateProcessTicket(result.data[0].id,putObj);
                                      });
                                      });
                              }
                              $mdDialog.hide();
                            
                          });

                } 
                else if(workCenter.name.toLowerCase()=="invoice")  
                {

                          masterObj[0].processName="Invoice";
                          masterObj[0].processType="invoice";
                          masterObj[0].actualstartdate=$scope.processtartDate;
                          masterObj[0].actualenddate=$scope.processtartDate;

                          JWTTOKEN.requestFunction('POST','processtickets',masterObj).then(function(result){
                            
                            for(var i=0;i<normalmachine.length;i++)
                              {
                                var machineCalendarObj={
                                            "type":"machine",
                                            "machineID":machine.id,
                                            "date":normalmachine[i],
                                            "processTicketID":result.data[0].id,
                                            "workcenterVendorID":machine.workcenterVendorID,
                                            "status": "booked",
                                            "deletedStatus": false,
                                            "usedCapacity":machine.capacity,
                                            "statusUpdates": []
                                          };

                                      JWTTOKEN.requestFunction('POST','machinecalendars',machineCalendarObj).then(function(calendarData){

                                         var putObj={
                                              "machineID":calendarData.data.machineID,
                                              "statusupdatePercentage" : "0",
                                              "lastStatusUpdateOn" : "No updates done",
                                              "justAddedByPlanner" : false
                                            }
                                         JWTTOKEN.requestFunction('PUT','processtickets/'+result.data[0].id,putObj).then(function(calendarData){
                                          updateProcessTicket(result.data[0].id,putObj,"invoice");
                                        });
                                      });
                              }
                              $mdDialog.hide();
                          });

                }   
                else
                {
                       if(workCenter.name.toLowerCase()=="stores")
                       {
                            masterObj[0].yarn1=processData.yarn1;
                            masterObj[0].fabric=processData.fabric;
                            masterObj[0].embroidery=processData.embroidery;
                            masterObj[0].accessories=processData.accessories;
                            masterObj[0].goods=processData.goods;
                            masterObj[0].others=processData.others;
                            masterObj[0].actualstartdate=$scope.processtartDate;
                            masterObj[0].actualenddate=$scope.processEndDate;
                            masterObj[0].status="pending";
                       }                      
                       else if(workCenter.name.toLowerCase()=="dyeing")
                       {
                          $scope.type=processData.subType;
                          if($scope.type=="jigger") 
                          {
                                masterObj[0].processName="Jigger Dyeing";
                                masterObj[0].joborder=processData.joborder;
                                masterObj[0].creation=processData.creation;
                                masterObj[0].processahead=processData.processahead;
                                masterObj[0].daystogo=processData.daystogo;
                                masterObj[0].currentDelay=processData.currentDelay;
                                masterObj[0].firsttime=processData.firsttime;
                                masterObj[0].topping=processData.topping;
                                masterObj[0].fabric=processData.fabric;
                                masterObj[0].tape=processData.tape;
                                masterObj[0].basefabric=processData.basefabric;
                                masterObj[0].mtrs=processData.mtrs;
                                masterObj[0].po=processData.po;
                                masterObj[0].lineitem=processData.lineitem;
                                masterObj[0].duration=processData.duration;
                                masterObj[0].actualstartdate=$scope.processtartDate;
                                masterObj[0].actualenddate=$scope.processEndDate;
                                console.log(processData.typeofdying);
                          }
                          else if($scope.type=="vat")
                          {
                              masterObj[0].processName="Vat Dyeing";
                              masterObj[0].creation=processData.creation;
                              masterObj[0].jobOrder=processData.jobOrder;
                              masterObj[0].duration=processData.duration;
                              masterObj[0].processahead=processData.processahead;
                              masterObj[0].daystogo=processData.daystogo;
                              masterObj[0].currentDelay=processData.currentDelay;
                              masterObj[0].warp=processData.warp;
                              masterObj[0].lots=processData.lots;
                              masterObj[0].bundles=processData.bundles;
                              masterObj[0].bundletypes=processData.types;
                              masterObj[0].tiendyelots=processData.tiendyelots;
                              masterObj[0].tiendyebundles=processData.tiendyebundles;
                              masterObj[0].bundlepo=processData.po;
                              masterObj[0].bundlelineitem=processData.lineitem;
                              masterObj[0].weft=processData.weft;
                              masterObj[0].weftlots=processData.weftlots;
                              masterObj[0].weftbundles=processData.weftbundles;
                              masterObj[0].wefttype=processData.wefttype;
                              masterObj[0].wefttiendyelots=processData.wefttiendyelots;
                              masterObj[0].wefttiendyebundles=processData.wefttiendyebundles;
                              masterObj[0].weftpo=processData.weftpo;
                              masterObj[0].weftlineitem=processData.weftlineitem;
                              masterObj[0].embthread=processData.embthread;
                              masterObj[0].emblots=processData.emblots;
                              masterObj[0].embbundles=processData.embbundles;
                              masterObj[0].embtypes=processData.embtypes;
                              masterObj[0].embtiendyelots=processData.embtiendyelots;
                              masterObj[0].embtiendyebundles=processData.embtiendyebundles;
                              masterObj[0].embpo=processData.embpo;
                              masterObj[0].emblineitem=processData.emblineitem;
                              masterObj[0].backpanel=processData.backpanel;
                              masterObj[0].zipper=processData.zipper;
                              masterObj[0].piping=processData.piping;
                              masterObj[0].others=processData.others;
                              masterObj[0].actualstartdate=$scope.processtartDate;
                              masterObj[0].actualenddate=$scope.processEndDate;
                          }
                          else  if($scope.type=="cabinet")
                          {

                              masterObj[0].processName="Cabinet Dyeing";
                              masterObj[0].creation=processData.creation;
                              masterObj[0].jobOrder=processData.jobOrder;
                              masterObj[0].duration=processData.duration;
                              masterObj[0].processahead=processData.processahead;
                              masterObj[0].daystogo=processData.daystogo;
                              masterObj[0].currentDelay=processData.currentDelay;
                              masterObj[0].warp=processData.warp;
                              masterObj[0].lots=processData.lots;
                              masterObj[0].bundles=processData.bundles;
                              masterObj[0].bundletypes=processData.types;
                              masterObj[0].bundlepo=processData.po;
                              masterObj[0].bundlelineitem=processData.lineitem;
                              masterObj[0].weft=processData.weft;
                              masterObj[0].weftlots=processData.weftlots;
                              masterObj[0].weftbundles=processData.weftbundles;
                              masterObj[0].wefttype=processData.wefttype;
                              masterObj[0].weftpo=processData.weftpo;
                              masterObj[0].weftlineitem=processData.weftlineitem;
                              masterObj[0].embthread=processData.embthread;
                              masterObj[0].emblots=processData.emblots;
                              masterObj[0].embbundles=processData.embbundles;
                              masterObj[0].embtypes=processData.embtypes;
                              masterObj[0].embpo=processData.embpo;
                              masterObj[0].emblineitem=processData.emblineitem;
                              masterObj[0].actualstartdate=$scope.processtartDate;
                              masterObj[0].actualenddate=$scope.processEndDate;
                          }
                 }
                 else if(workCenter.name.toLowerCase()=="printing")
                 {
                        masterObj[0].order=processData.order;
                        masterObj[0].duration=processData.duration;
                        masterObj[0].creation=processData.creation;
                        masterObj[0].processahead=processData.processahead;
                        masterObj[0].daystogo=processData.daystogo;
                        masterObj[0].actualstartdate=$scope.processtartDate;
                        masterObj[0].actualenddate=$scope.processEndDate;
                        
                }
                else if(workCenter.name.toLowerCase()=="stiching")
                {

                        masterObj[0].ordercreation=processData.ordercreation;
                        masterObj[0].type=processData.type;
                        masterObj[0].fullqty=processData.fullqty;
                        masterObj[0].processahead=processData.processahead;
                        masterObj[0].daystogo=processData.daystogo;
                        masterObj[0].currentDelay=processData.currentDelay;
                        masterObj[0].actualstartdate=$scope.processtartDate;
                        masterObj[0].actualenddate=$scope.processEndDate;
                }
                else if(workCenter.name.toLowerCase()=="weaving")
                {
                        masterObj[0].creation=processData.creation;
                        masterObj[0].creation=processData.powerloom;
                        masterObj[0].handloom=processData.handloom;
                        masterObj[0].dobbyloom=processData.dobbyloom;
                        masterObj[0].checkloom=processData.checkloom;
                        masterObj[0].tapeloom=processData.tapeloom;
                        masterObj[0].netweaving=processData.netweaving;
                        masterObj[0].warpweaving=processData.warpweaving;
                        masterObj[0].fulqty=processData.fulqty;
                        masterObj[0].noofwarps=processData.noofwarps;
                        masterObj[0].po=processData.po;
                        masterObj[0].lineitem=processData.lineitem;
                        masterObj[0].processahead=processData.processahead;
                        masterObj[0].daystogo=processData.daystogo;
                        masterObj[0].currentDelay=processData.currentDelay;
                        masterObj[0].frontpanel=processData.frontpanel;
                        masterObj[0].ponumber=processData.ponumber;
                        masterObj[0].lineitem=processData.lineitem;
                        masterObj[0].backpanel=processData.backpanel;
                        masterObj[0].zipper=processData.zipper;
                        masterObj[0].piping=processData.piping;
                        masterObj[0].otheracessories=processData.otheracessories;
                        masterObj[0].actualstartdate=$scope.processtartDate;
                        masterObj[0].actualenddate=$scope.processEndDate;
                }
                else if(workCenter.name.toLowerCase()=="winding")
                {
                        masterObj[0].creation=processData.creation;
                        masterObj[0].windings=processData.windings;
                        masterObj[0].plying=processData.plying;
                        masterObj[0].twisting=processData.twisting;
                        masterObj[0].others=processData.others;
                        masterObj[0].jobOrder=processData.jobOrder;
                        masterObj[0].ponumber=processData.ponumber;
                        masterObj[0].processahead=processData.processahead;
                        masterObj[0].daystogo=processData.daystogo;
                        masterObj[0].currentDelay=processData.currentDelay;
                        masterObj[0].actualstartdate=$scope.processtartDate;
                        masterObj[0].actualenddate=$scope.processEndDate;
                }
                else if(workCenter.name.toLowerCase()=="accesories")
                {
                        masterObj[0].creation=processData.creation;
                        masterObj[0].joborder=processData.joborder;
                        masterObj[0].processahead=processData.processahead;
                        masterObj[0].daystogo=processData.daystogo;
                        masterObj[0].currentDelay=processData.currentDelay;
                        masterObj[0].beads=processData.beads;
                        masterObj[0].types=processData.types;
                        masterObj[0].colors=processData.colors;
                        masterObj[0].sizes=processData.sizes;
                        masterObj[0].quantity=processData.quantity;
                        masterObj[0].ponumber=processData.ponumber;
                        masterObj[0].threads=processData.threads;
                        masterObj[0].etypes=processData.etypes;
                        masterObj[0].ecolor=processData.ecolor;
                        masterObj[0].equantity=processData.equantity;
                        masterObj[0].eponumber=processData.eponumber;
                        masterObj[0].zipper=processData.zipper;
                        masterObj[0].ztypes=processData.ztypes;
                        masterObj[0].zcolors=processData.zcolors;
                        masterObj[0].zquantity=processData.zquantity;
                        masterObj[0].zponumber=processData.zponumber;
                        masterObj[0].buttons=processData.buttons;
                        masterObj[0].buttontypes=processData.buttontypes;
                        masterObj[0].buttoncolor=processData.buttoncolor;
                        masterObj[0].buttonsizes=processData.buttonsizes;
                        masterObj[0].buttonquantity=processData.buttonquantity;
                        masterObj[0].buttonponumber=processData.buttonponumber;
                        masterObj[0].Otheraccesories=processData.Otheraccesories;
                        masterObj[0].othertypes=processData.othertypes;
                        masterObj[0].othercolor=processData.othercolor;
                        masterObj[0].othersizes=processData.othersizes;
                        masterObj[0].otherquantity=processData.otherquantity;
                        masterObj[0].otherponumber=processData.otherponumber;

                        masterObj[0].actualstartdate=$scope.processtartDate;
                        masterObj[0].actualenddate=$scope.processEndDate;
                }
                else if(workCenter.name.toLowerCase()=="embroidary")
                {
                        masterObj[0].creation=processData.creation;
                        masterObj[0].handembroidary=processData.hanuttondembroidary;
                        masterObj[0].cadembroidary=processData.cadembroidary;
                        masterObj[0].jobOrder=processData.jobOrder;
                        masterObj[0].processahead=processData.processahead;
                        masterObj[0].daystogo=processData.daystogo;
                        masterObj[0].currentDelay=processData.currentDelay;
                        masterObj[0].fabric=processData.fabric;
                        masterObj[0].fabrictype=processData.fabrictype;
                        masterObj[0].fabricponumber=processData.fabricponumber;
                        masterObj[0].basefabric=processData.basefabric;
                        masterObj[0].mtrs=processData.mtrs;
                        masterObj[0].dyed=processData.dyed;
                        masterObj[0].noofscreens=processData.noofscreens;
                        masterObj[0].vendorapproved=processData.vendorapproved;
                        masterObj[0].vendorbulkpurchase=processData.vendorbulkpurchase;
                        masterObj[0].ambadiapproved=processData.ambadiapproved;
                        masterObj[0].ambadibulkpurchase=processData.ambadibulkpurchase;
                        masterObj[0].otheraccesories=processData.otheraccesories;

                        masterObj[0].actualstartdate=$scope.processtartDate;
                        masterObj[0].actualenddate=$scope.processEndDate;

                }
                else if(workCenter.name.toLowerCase()=="finishing")
                {
                          masterObj[0].creation=processData.creation;
                          masterObj[0].finishings=processData.finishings;
                          masterObj[0].ironing=processData.ironing;
                          masterObj[0].zero=processData.zero;
                          masterObj[0].stentering=processData.stentering;
                          masterObj[0].washing=processData.washing;
                          masterObj[0].others=processData.others;
                          masterObj[0].jobOrder=processData.jobOrder;
                          masterObj[0].processahead=processData.processahead;
                          masterObj[0].daystogo=processData.daystogo;
                          masterObj[0].currentDelay=processData.currentDelay;
                          masterObj[0].currentDuration=processData.currentDuration;

                          masterObj[0].actualstartdate=$scope.processtartDate;
                          masterObj[0].actualenddate=$scope.processEndDate;
                }
                else if(workCenter.name.toLowerCase()=="outright Purchase")
                {
                         masterObj[0].creation=processData.creation;
                         masterObj[0].jobOrder=processData.jobOrder;
                         masterObj[0].ponumber=processData.ponumber;
                         masterObj[0].processStartDate=processData.processStartDate;
                         masterObj[0].duration=processData.duration;
                         masterObj[0].processEndDate=processData.processEndDate;
                         masterObj[0].processahead=processData.processahead;
                         masterObj[0].daystogo=processData.daystogo;
                         masterObj[0].currentDelay=processData.currentDelay;
                }


                        if(workCenter.name=="Cabinet_Dyeing")
                        {
                          masterObj[0].creation=processData.creation;
                        }
                       /////for create new task in between/////////////

                       if($scope.taskClick=="task")
                       {
                            if($scope.createType=="start")
                            {
                              nextProcessData=$scope.rightClickTask;
                            }
                            else if($scope.createType=="end")
                            {
                              previousProcessData=$scope.rightClickTask;
                            }
                            else if($scope.createType=="inbetween")
                            {
                              previousProcessData=$scope.rightClickTask;
                              nextProcessData=$scope.createBeforeType;
                            }

                       }
                       masterObj[0].predecessorID=[];

                JWTTOKEN.requestFunction('POST','processtickets/insertAProcessTicket',{attributes:masterObj,previousProcessID:previousProcessData,nextProcessID:nextProcessData}).then(function(result){
                    console.log(result);
                    result.data =   result.data.process;
                           $scope.newobjID=result.data[0].id;


                           ///////////rinsha code for normal machine////////////////////
                                    ///////////////////////////////

                           /////////////CODE BY RINSHA////////////////////////////
                          
                            var machineCalendarObj=[];
                            var processticketId=result.data[0].id;
                            var normaldate=[];
                            var QCdate=[];
                            var inwarddate=[];
                            var outwarddate=[];
                            var arrayDate=[];
                            var qccontainerdate=[];

                            var machineDetailsLength = Object.keys(machineArray).length;
                            var iter=0;
                              var qccontaineraddedCount=0;

                              console.log(machineArray);
                            for(var key in machineArray)
                            {
                              iter++;
                              var machineType="machine";
                              var machineID=machineArray[key][0].details.id;
                              var workcenterVendorId=machineArray[key][0].details.workcenterVendorID;

                              if(machineArray[key][0].details.type=="normal")
                              {
                                processticketId=result.data[0].id;
                                machineType="machine";
                                for(var i=0;i<machineArray[key].length;i++)
                                {
                                  normaldate.push(machineArray[key][i].date);

                                }
                                sortdateArray(normaldate);
                                arrayDate.push({pID:processticketId,type:"normaldate",machineID:key,dateArray:normaldate});   
                              }
                              if(machineArray[key][0].details.type=="QCmachine")
                              {
                                processticketId=result.data[2].id;
                                machineType="machine";
                                for(var i=0;i<machineArray[key].length;i++)
                                {
                                  QCdate.push(machineArray[key][i].date);

                                }
                                sortdateArray(QCdate);
                                arrayDate.push({pID:processticketId,type:"QCdate",machineID:key,dateArray:QCdate});
                              }
                              else if(machineArray[key][0].details.type=="inward")
                              {
                                 processticketId=result.data[1].id;
                                 machineType="machine";
                                for(var i=0;i<machineArray[key].length;i++)
                                {
                                  inwarddate.push(machineArray[key][i].date)
                                }
                                sortdateArray(inwarddate);
                                arrayDate.push({pID:processticketId,type:"inwarddate",machineID:key,dateArray:inwarddate});
                              }
                              else if(machineArray[key][0].details.type=="outward")
                              {
                                 processticketId=result.data[3].id;
                                 machineType="machine";
                                for(var i=0;i<machineArray[key].length;i++)
                                {
                                  outwarddate.push(machineArray[key][i].date)
                                }
                                sortdateArray(outwarddate);
                                arrayDate.push({pID:processticketId,type:"outwarddate",machineID:key,dateArray:outwarddate});

                              }
                              else if(machineArray[key][0].details.type=="External")
                              {
                                 processticketId=result.data[0].id;
                                workcenterVendorId=machineArray[key][0].details.id;
                                machineID="";
                                machineType="External";
                              }
                              else if(machineArray[key][0].details.workCenterRelation!=undefined)
                             {
                              if(machineArray[key][0].details.workCenterRelation.name=="QC")
                              {
                                 processticketId=result.data[2].id;
                                 machineType="qccontainer";
                                for(var i=0;i<machineArray[key].length;i++)
                                {
                                  qccontainerdate.push(machineArray[key][i].date)
                                }
                                sortdateArray(qccontainerdate);
                                arrayDate.push({pID:processticketId,type:"qccontainerdate",machineID:key,dateArray:qccontainerdate});
                            
                              }
                            }

                                  for(var i=0;i<machineArray[key].length;i++)
                                  {
                                    //IF ITS A QC CONTAINER NO NEED TO CREATE MACHINE EVENTS ON EACH SELECTED DATES 
                                    //JUST CREATE EVENT ON MACHINECALENDAR WITH A DATE RANGE .BECAUSE ITS A TEMPORARY
                                    //CONTAINER CREATED BY PLANNER ON WORKCENTERVENDOR LEVEL
                                    //WHEN SCHEDULER COMES , HE WILL ALLOCATE IT TO MACHINE LEVEL AND CREATE NEW EVENTS 
                                    //UNDER THIS DATE RANGE .
                                    var workcentername="";
                                    if(machineArray[key][i].details.workCenterRelation!=undefined)
                                    {
                                      workcentername=machineArray[key][i].details.workCenterRelation.name;
                                    }


                                    if(workcentername!="QC")
                                    {
                                      machineCalendarObj={
                                            "type":machineType,
                                            "machineID":machineID,
                                            "date":machineArray[key][i].date,
                                            "processTicketID":processticketId,
                                            "workcenterVendorID":workcenterVendorId,
                                            "status": "booked",
                                            "deletedStatus": false,
                                            "usedCapacity":machineArray[key][0].details.capacity,
                                            "statusUpdates": [],
                                            "endDate":new Date(endDate),
                                            "durationData":durationData,
                                            "plannedDuration":durationData
                                          };

                                      JWTTOKEN.requestFunction('POST','machinecalendars',machineCalendarObj).then(function(calendarData){

                                      });
                                    }
                                    else
                                    {
                                      
                                      if(qccontaineraddedCount==0)
                                      {
                                       qccontaineraddedCount++;

                                       machineCalendarObj={
                                            "type":"qccontainer",
                                            "machineID":"",
                                            "startdate":machineArray[key][i].date,
                                            "enddate":machineArray[key][machineArray[key].length-1].date,
                                            "processTicketID":processticketId,
                                            "workcenterVendorID":machineArray[key][i].details.id,
                                            "status": "booked",
                                            "deletedStatus": false,
                                            "usedCapacity":"",
                                            "statusUpdates": []
                                          };

                                      JWTTOKEN.requestFunction('POST','machinecalendars',machineCalendarObj).then(function(calendarData){


                                      });
                                    }
                                    }

                                    }
                                      dateUpdateFun(machineDetailsLength,iter,arrayDate);
                                   
                                 
                                   
                               }//for loop
                               $mdDialog.hide();
                               $scope.processtartDate="";
                              $scope.processEndDate="";

                             })//post
                        }//else end final
                          
                          //  getGanttDataFromServer();
                            console.log('INSIDE getGanttDataFromServer')
                jobTreeObjOriginal={};
                jobTreeObjDraft={};
                jobTreeObjDraft= JSON.parse(localStorage['jobTreeDraft']);
                jobTreeObjOriginal= JSON.parse(localStorage['jobTreeOriginal']);
               
                JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID).then(function(masterticketresult){

                 
                   jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
                   jobTreeObjOriginal[masterticketresult.data.id]=masterticketresult.data;
                  JWTTOKEN.requestFunction('GET','mastertickets/'+$scope.masterTicketID+'/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(processes_result){
                   // JWTTOKEN.requestFunction('POST','mastertickets/getMasterTicket',{id:$scope.masterTicketID}).then(function(processes_result){

                     var processarray={};
                     for(var i=0;i<processes_result.data.length;i++)
                     {
                       processarray[processes_result.data[i].id]=processes_result.data[i];
                     }

                     jobTreeObjDraft[masterticketresult.data.id]["processes"]= processarray;
                     jobTreeObjOriginal[masterticketresult.data.id]["processes"]= processarray;

                     localStorage['jobTreeDraft'] = JSON.stringify(jobTreeObjDraft);
                     localStorage['jobTreeOriginal'] = JSON.stringify(jobTreeObjOriginal);

                      jobTreeOriginal = JSON.parse(localStorage['jobTreeOriginal']);
                   jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);

                   currentJoborderDetailsOriginal=jobTreeOriginal[$scope.masterTicketID];
                   currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
                   displayGantt(currentJoborderDetailsOriginal,currentJoborderDetailsDraft,"");


                   localStorage.removeItem('machineEventsDraft');
                 
                }); //end of GET','mastertickets/MASTERTICKET1/processes
              }); //end of 'GET','mastertickets/MASTERTICKET1'
       //////////////CODE BY RINSHA ENDSSS/////////////////////////                
                          
}///////ens

//---------------------------------end of function StoreAdd-------------------------------------//


//**
//**
//**

////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------------SCOPE FUNCTION DECLARATIONS ENDS HERE---------------------------------------------------//
///////////////////////////////////////////////////////////////////////////////////////////////////////





//**
//**
//**
//**
//**



////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------FUNCTION CALLS---------------------------------------------------------///
////////////////////////////////////////////////////////////////////////////////////////////////////////




//------------------------------FUNTION CALLS ON PAGE LOAD--------------------------------------------//

//following functions are invoked on page load

//TO DISPLAY GANTT
//1 . getGanttDisplayStuff
//2 . displayGantt
//3 . checkOwner
//4 . schedulerScopeLoad
//5 . displayScheduler 
//6 . checkProcessFactoryOutdateOnGanttLoad (ON gantt's "onGanttReady" event)

///-----------------------------------------------TO DISPLAY GANTT-------------------------------------------//

      getGanttDisplayStuff($scope.masterTicketID,"");
//---------------------------------------------------------------------------------------------------------//

      var dateData=dateDuartionFunction(new Date(JSON.parse(sessionStorage.getItem("info")).planstartdate),new Date(JSON.parse(sessionStorage.getItem("info")).planenddate));
      console.log(dateData);

      if(status=="exist")
      {
      }
      else
      {
           $scope.tasks = {
            data:[
                  /*{id:1, text:JSON.parse(sessionStorage.getItem("info")).salesorderNo, start_date:dateData[0], duration:dateData[1]+1,order:10,
                  progress:0.4, open: true}*/
            ],
            links:[
            ]};
      }
   

   //workcenter fetch

    JWTTOKEN.requestFunction('GET','workcenters?filter[where][deletedStatus]=false').then(function(result){
                  console.log(result);
                  $scope.workcenters=result.data;
    });





//----------------------------FUNCTION CALLS ON PAGEN LOAD ENDS HERE----------------------------------------///


////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------FUNCTION CALLS ENDS HERE---------------------------------------------------///
////////////////////////////////////////////////////////////////////////////////////////////////////////


//**
//**
//**
//**
//**


////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------DHTMLX GANTT CONFIGURATION SETTINGS  ----------------------------------///
////////////////////////////////////////////////////////////////////////////////////////////////////////

    gantt.config.autosize = "xy";


////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------DHTMLX GANTT CONFIGURATION SETTINGS  ENDS HERE -----------------------------------------------------///
////////////////////////////////////////////////////////////////////////////////////////////////////////

//**
//**
//**
//**
//**



////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------DHTMLX GANTT EVENTS -----------------------------------------------------///
////////////////////////////////////////////////////////////////////////////////////////////////////////

//following functions are invoked on "onGanttReady" event
//1 . checkProcessFactoryOutdateOnGanttLoad
gantt.attachEvent("onGanttReady", function(){

    //AFTER GANTT READY WE NEED TO COLOR OUTDATED PROCESSES IN RED COLOR. WHICH CAN BE DONE AS FOLLOWS
   setTimeout(function() {
   checkProcessFactoryOutdateOnGanttLoad(ganttDataDraft);
   },500);
    
});


//--
//--

gantt.attachEvent("onBeforeLinkAdd", function(id,link){

    linkArray.push({"processSource":link.source,"processTarget":link.target});
    return true;
});


//--
//--


/*gantt.attachEvent("onLinkClick", function(id,e){
    //any custom logic here
     $scope.linkStatus="delete";
    var link=gantt.getLink(id);
      var title='Do you want to delete this link?';
      var text='';
       dialogFactory.confirmAlert(e,title,text,function(status){
        if(status=="OK"){
           gantt.deleteLink(id);
           linkDeleteArray.push({"processSource":link.source,"processTarget":link.target});
        }
        else{
          console.log('Canceled');
        }
     });   
});*/

//--
//--
  

gantt.attachEvent("onTaskDblClick", function(id,e){

    $scope.ganttid=id;
    ganttId=id;
    $scope.gantData=gantt.getTask(id);
    if(status=="exist")
    {
      
    }

});//onTaskDblClick



function onTaskRowClickFun(id)
{
      console.log('-----Gantt Row click------');
          //  console.log(e);

            // alert('roww');

            //Here GET machines api is just called to reflect changes on ganttscheduler immediately .
            //api response data not used here 
            JWTTOKEN.requestFunction('GET', 'plants/DummyApi').then(function(dummyresult_not_used_here) {

                // alert(dummyresult_not_used_here)
                $scope.eventsReschedule = [];
                $scope.ganttid = id;
             //   console.log(e)
                    // $scope.masterTicketID=
                var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
                var machineEventsDraft = {};
                var currentJoborderDetailsDraft = jobTreeDraft[$scope.masterTicketID];
                var MACHINE_ID_TO_LOAD = currentJoborderDetailsDraft.processes[$scope.ganttid].machineID;
                if (currentJoborderDetailsDraft.processes[$scope.ganttid].status == "rework") {
                    alert('This process is not active');
                } else {

                    console.log(currentJoborderDetailsDraft.processes[$scope.ganttid]);

                    var workCenterID = currentJoborderDetailsDraft.processes[$scope.ganttid].workcenterID;
                    console.log($scope.ganttid);
                    console.log(workCenterID);
                    $scope.workCenterID = workCenterID;

                    console.log('workCenterID....................');

                    console.log(workCenterID);

                    var workcenterVendorID = undefined;
                    if (workCenterID == "QC" && currentJoborderDetailsDraft.processes[$scope.ganttid].justAddedByPlanner == true) {
                        workcenterVendorID = currentJoborderDetailsDraft.processes[$scope.ganttid].machineID;
                    }


                    machineEventsDraft_get = localStorage['machineEventsDraft'];
                    console.log(machineEventsDraft_get);
                    //1 . CHECK WHETHER  "machineEventsDraft" IS EXIST ON LOCALSTORAGE
                    //  IF YES 
                    //   {{
                    //       1 . CHECK WHETHER DATA CORRESPONDING TO WORKCENTER OF THE SELECTED PROCESTICKET IS THERE INSIDE LOCALSTORAGE "machineEventsDraft"
                    //            {{
                    //             IF YES
                    //                *) CHECK WHETHER DATA CORRESPONDING TO PROCESSTICKET'S MACHINEID is there inside machineEventsDraft[WORKCENTERUD]
                    //                      IF YES 
                    //                          *) LOAD SCHDULER USING THAT DATA (machineEventsDraft[WORKCENTERUD][MACHINEID])
                    //                      IF NO 
                    //                          *) LOAD DATA CORRESPONDING TO PROCESSTICKT'S MACHINEID FROM SERVER AND DISPLAY SCHDULER VIEW 
                    //            IF NO
                    //               * )LOAD DATA CORRESPONDING TO WORKCENTER , MACHINE ID FROM SERVER AND DISPLAY SCHDULER
                    //            }}
                    //   }}
                    //  IF NO 
                    //    1 . LOAD THE DATA CORRESPONDING TO PRCESSTICKET'S WORKCENTER AND PROCESSTICKET'S MACHINE INSIDE "machineEventsDraft" LOCALSTORAGE AND DISPLAY SCHDULER VIEW
                    if (machineEventsDraft_get != undefined) {
                        machineEventsDraft = JSON.parse(localStorage['machineEventsDraft']);
                        if (machineEventsDraft[workCenterID] == undefined) {
                          //alert('if machineEventsDraft[workCenterID] == undefined');
                            console.log(workCenterID);
                            //  if(machineEventsDraft[workCenterID])


                            getMachineEventsFromserver(workCenterID, "row", workcenterVendorID, function(machineevents) {
                                machineEventsDraft[workCenterID] = {}
                                var machineLength = machineevents.data.length - 1;
                                for (var j = 0; j < machineevents.data.length; j++) {
                                    //  machineevents.data[j.events="";        
                                    machineEventsDraft[workCenterID][machineevents.data[j].id] = machineevents.data[j];
                                    if (machineevents.data[j].machinecalendar.length > 0) {
                                        for (var i = 0; i < machineevents.data[j].machinecalendar.length; i++) {
                                            machineEventsDraft[workCenterID][machineevents.data[j].id][machineevents.data[j].machinecalendar[i].id] = machineevents.data[j].machinecalendar[i];
                                            if ((i == machineevents.data[j].machinecalendar.length - 1) && j == machineLength) {
                                                finalDisplay(machineEventsDraft, workCenterID)
                                            }
                                        }
                                    } else {
                                        finalDisplay(machineEventsDraft, workCenterID)
                                    } //if no machine calendar events 
                                }


                            });
                        } else // If selected machineevents are available in localstorage  
                        {
                          /*$scope.sections.length=0;
                          $scope.sections2.length=0;*/
                          //alert('elseeeee machineEventsDraft[workCenterID] == undefined');
                            if (machineEventsDraft[workCenterID][MACHINE_ID_TO_LOAD] == undefined) {
                             // alert('iff  machineEventsDraft[workCenterID][MACHINE_ID_TO_LOAD] == undefined');

                                getMachineEventsFromserver(workCenterID, "row", workcenterVendorID, function(machineevents) {

                                  console.log(machineevents);
                                    machineEventsDraft[workCenterID] = {}
                                    var machineLength = machineevents.data.length - 1;
                                    for (var j = 0; j < machineevents.data.length; j++) {
                                        //  machineevents.data[j.events="";        
                                        machineEventsDraft[workCenterID][machineevents.data[j].id] = machineevents.data[j];
                                        if (machineevents.data[j].machinecalendar.length > 0) {
                                            for (var i = 0; i < machineevents.data[j].machinecalendar.length; i++) {
                                                machineEventsDraft[workCenterID][machineevents.data[j].id][machineevents.data[j].machinecalendar[i].id] = machineevents.data[j].machinecalendar[i];
                                                if ((i == machineevents.data[j].machinecalendar.length - 1) && j == machineLength) {
                                                    finalDisplay(machineEventsDraft, workCenterID)
                                                }
                                            }
                                        } else {
                                            finalDisplay(machineEventsDraft, workCenterID)
                                        } //if no machine calendar events 
                                    }


                                });
                            } else {
                               //alert('elseeeee machineEventsDraft[workCenterID][MACHINE_ID_TO_LOAD] == undefined');
                               console.log(machineEventsDraft);
                               console.log(machineEventsDraft_get);
                                finalDisplay(machineEventsDraft, workCenterID);

                            }
                        }
                    } else //if initially local storage not set 
                    {

                      //alert('else machineEventsDraft_get != undefined');
                        getMachineEventsFromserver(workCenterID, "row", workcenterVendorID, function(machineevents) {
                            machineEventsDraft[workCenterID] = {}
                            var machineLength = machineevents.data.length - 1;
                            for (var j = 0; j < machineevents.data.length; j++) {

                                machineEventsDraft[workCenterID][machineevents.data[j].id] = machineevents.data[j];
                                if (machineevents.data[j].machinecalendar.length > 0) {
                                    for (var i = 0; i < machineevents.data[j].machinecalendar.length; i++) {
                                        machineEventsDraft[workCenterID][machineevents.data[j].id][machineevents.data[j].machinecalendar[i].id] = machineevents.data[j].machinecalendar[i];
                                        if ((i == machineevents.data[j].machinecalendar.length - 1) && j == machineLength) {
                                            finalDisplay(machineEventsDraft, workCenterID)
                                        }
                                    }
                                } else {
                                    finalDisplay(machineEventsDraft, workCenterID)
                                } //if no machine calendar events 
                            }

                        });
                    }
                }
            });

}
//--
//--
var taskrow = gantt.attachEvent("onTaskRowClick", function(id, e) {
              onTaskRowClickFun(id);
           
        }); //onTaskRowClick ends

        //--
        //--

        /*function filterSingleMachineData(machineEventsDraft,workCenterID,machineID)
        {
          //var obj=
          for(var key in machineEventsDraft)
          {
            if(key==workCenterID)
            {
                var count=0;
                var size= Object.keys(machineEventsDraft[key]).length;
                for(var machineIDs in machineEventsDraft[key])
                {
                    if(machineIDs!=machineID)
                    {
                      count++;
                      delete machineEventsDraft[key][machineIDs];
                      if(count==size-1)
                      {
                        return machineEventsDraft;
                      }
                    }
                }
                
            }
          }
        }*/


        function finalDisplay(machineEventsDraft, workCenterID) {
            localStorage['machineEventsDraft'] = JSON.stringify(machineEventsDraft);
            console.log(workCenterID);
            displayScheduler(workCenterID).then(function(result) {

                console.log('call back for scheduler');
                console.log(result);
                $scope.eventsReschedule = result;
//                 $scope.eventsData = result;

                //$scope.$apply();//Prasad
                angular.copy($scope.eventsReschedule, eventsForHistory);
            })
        }

//--
//--


//CODE FOR GANTT NEW PROCESS INSERT , SPLIT A PROCESS
//** author : Rinsha
//home/sikha/1rinsha/Gantt_project/DHTMLX/Gantt/samples/04_customization/10_context_menu.html
//following functions are invoked on "onContextMenu" event
//1 . processFetch


var splitDependency =function(taskId, linkId, event){
console.log(taskId);
    $scope.splitDate=false;
     $scope.showTab=false;
     
    console.log(gantt.getTask(taskId));

    $scope.processType=gantt.getTask(taskId).processType;
    $scope.rightClickTask=taskId;
    $scope.taskClick="task";

    $scope.name='rinsha';
    processFetch();
    if((($scope.processType=="inlineQC") && ($scope.role=='qcscheduler')) || ($scope.role!='planner'))
    {
      $mdDialog.show({
          
             templateUrl: 'templates/Processes/ProcessDialog.html',
              parent: angular.element(document.body),
              targetEvent: event,
              scope: $scope,
              preserveScope: true,  // do not forget this if use parent scope
              clickOutsideToClose:true
    });
    }  
}

if($scope.role!='planner')
{
  gantt.attachEvent("onContextMenu", function(taskId, linkId, event){
// getProcessTktForRead is required to get process dilaog opened
//Don't change this format of call- Prasad    
   getProcessTktForRead(taskId, linkId, event,splitDependency)  
    return true; 
  });
}




//---------------------------------function radiotypeChange------------------------------------------//


$scope.radiotypeChange=function(type,e)
{
  console.log(type);
  if(type=="delete")
  {
  //  alert('delete');

  }
  else if(type=="splitSchedule")
  {
    /////////////////schedule of splited task on right click
    var id=$scope.rightClickTask;
     
    console.log(gantt.getTask(id));
    localStorage.removeItem('machineEventsDraft');
        markedArray=[];
         //processFetch();

                 $scope.splitDate=true;
                  $scope.taskClick="double";


             var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
            //var machineEventsDraft={};
            var  currentJoborderDetailsDraft=jobTreeDraft[$scope.masterTicketID];
            console.log(currentJoborderDetailsDraft);

            console.log(currentJoborderDetailsDraft.processes[id]);
            var processDetails=currentJoborderDetailsDraft.processes[id];
            $scope.processticket=processDetails;
          var workCenterID=processDetails.workcenterID;
          processName=processDetails.processName; 
           $scope.workCenterID=workCenterID;

           $scope.ganttid=id;

           $scope.eventsData=[];
           console.log(workCenterID);

            getVendors();

          getScheduleView(workCenterID);

           





          $mdDialog.show({
              //templateUrl: 'templates/processDialog.html',
              templateUrl: 'templates/Processes/ProcessDialog.html',
              parent: angular.element(document.body),
              targetEvent: e,
              scope: $scope,
              preserveScope: true,  // do not forget this if use parent scope
              clickOutsideToClose:false
            }) //md-dialog
  }
}
//---------------------------------end of function radiotypeChange-------------------------------------//


$scope.cancelAfterSplit=function()
{
  $mdDialog.hide();
  $scope.splitDate=false;
  $scope.movemachine=false;
  localStorage.removeItem('machineEventsDraft');
}

//**
//**
//**

$scope.SaveAfterSplit=function(processticket)
{
    console.log(processticket);
    processticket.actualstartdate=$scope.processtartDate;
    processticket.actualenddate=$scope.processEndDate;
    processticket.machineID=machine.id;
    console.log(processticket);

    console.log(machine);

     JWTTOKEN.requestFunction('PUT','processtickets/'+processticket.id,processticket).then(function(res){
      console.log(res);

                                      var machineCalendarObj={
                                            "type":"machine",
                                            "machineID":machine.id,
                                            "date":$scope.processtartDate,
                                            "processTicketID":res.data.id,
                                            "workcenterVendorID":machine.workcenterVendorID,
                                            "status": "booked",
                                            "deletedStatus": false,
                                            "usedCapacity":machine.capacity,
                                            "statusUpdates": [],
                                            "endDate":$scope.processEndDate,
                                            "durationData":durationData,
                                            "plannedDuration":durationData
                                          };

                                JWTTOKEN.requestFunction('POST','machinecalendars',machineCalendarObj).then(function(calendarData){
                                  console.log(calendarData);
                                  $mdDialog.hide();
                                  $scope.splitDate=false;

                                  gantt.getTask(res.data.id).start_date= new Date(res.data.actualstartdate);  
                                  gantt.getTask(res.data.id).end_date=new Date(res.data.actualenddate);
                                //  console
                                  gantt.updateTask(res.data.id);
                                  
                                    $scope.processtartDate="";
                                    $scope.processEndDate="";
                                    localStorage.removeItem('machineEventsDraft');
                                  //displithappen=true;
                                  
                                });

     });



   // var updateObj={}
}


///duration Save click

$scope.DurationChangeClcik=function(durationData)
{
  console.log('DurationChangeClcik.........');

  var machineEventsDraft_fresh=JSON.parse(localStorage['machineEventsDraft']);
  machineEventsDraft_WC =machineEventsDraft_fresh[schedulerDetails.workcenterID];
  var currentEvent=machineEventsDraft_WC[schedulerDetails.machineid][schedulerDetails.machinecalendarID];

  var currentDuration=currentEvent.durationData;

  if(durationData.DurationIncDec=="increment")
  {
      currentDuration=parseInt(currentDuration)+parseInt(durationData.DurationChange);
  }
  else if(durationData.DurationIncDec=="decrement")
  {
      currentDuration=parseInt(currentDuration)-parseInt(durationData.DurationChange);
  }
  console.log(currentDuration);
 var currentendDate=calcualteEndDate(currentEvent.date,currentDuration,schedulerDetails.machineid);

  currentEvent.durationData=currentDuration;
  currentEvent.endDate=currentendDate;

  console.log(currentEvent);

  machineCalendar_TrackChanges_Obj.push({"id" : currentEvent.id ,"date" :currentEvent.date,"processTicketID" :currentEvent.processTicketID,"masterTicketID":$scope.masterTicketID,"endDate":currentEvent.endDate,"durationData":currentDuration});
  //processTicket_TrackChanges_Obj.push({})
  processTicket_TrackChanges_Obj.push({"id" : currentEvent.processTicketID });
  masterTicket_TrackChanges_Obj.push({"id" : currentEvent.processticketRelation.masterTicketID });
  
  //incrementEndDate(schedulerDetails,currentendDate);
  $mdDialog.hide();

}//ends

//**
//**
//**

/*printing Addmore*/
 $scope.processticket.fromStores = [ { 
        "meter": "", 
        "fromstorestext": "",
        "dyed": "",
        "screen": ""
      }];
$scope.counterfromstores=2;
$scope.AddMoreFromStores = function(){
  console.log('more yarn');
  var counterfromstores = $scope.counterfromstores;
   $scope.processticket.fromStores.push(   { 
        "meter": "", 
        "fromstorestext": "",
        "dyed": "",
        "screen": ""
      });
   console.log( $scope.processticket.fromStores);
        //counter = counter++
        $scope.counterfromstores = $scope.counterfromstores +1;
}



//---------------------------------function calcuDiffInDays-------------------------------------------//

//called from procesDialog.html

 $scope.calcuDiffInDays=function(date1,date2)
   {
    if(date2=="today")
    {
      date2=new Date();
    }
    else
    {
      date2=new Date(date2);
    }
    //  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds    
      var ndays;
      var tv1 = new Date(date1).getTime();// msec since 1970
      var tv2 = date2.getTime();

      ndays = (tv1 - tv2) / 1000 / 86400;
      ndays = Math.round(ndays - 0.5);
     if(ndays<0)
     {
        return 0;
     }
     else
     {
        return ndays;
     }
   }

//---------------------------------end of function calcuDiffInDays-------------------//

//**
//**
//**





  }]);