angular.module('app')
  .controller('homeController', ['$rootScope','$location','$filter','$scope', '$state','$stateParams','$mdDialog','$window',
  				'JWTTOKEN','commonFactory','dialogFactory','Workcenter','Masterticket','sharedProperties','Processticket',
  				'Machinecalendar', 'Plant', 'Appuser', function($rootScope,$location,$filter,$scope,$state,$stateParams,
  					$mdDialog,$window,JWTTOKEN,commonFactory,dialogFactory,Workcenter,Masterticket,sharedProperties,
  					Processticket,Machinecalendar, Plant, Appuser) {

  localStorage.removeItem('jobTreeDraft');
        localStorage.removeItem('jobTreeOriginal');
        localStorage.removeItem('machineEventsDraft');
         localStorage.removeItem('holidayBlackOutDays');

         processName="new Process";

         $scope.role=sessionStorage.getItem('role');
          //for scheduler Diaplay

          $scope.sections2=[{key:1, label:""}];
          $scope.sections=[{key:1, label:""}];

    //***********COLORS USED TO DRAW GANTT,SCHDULER***********************************************//

    $scope.blackOutColor="grey";
    $scope.holidayColor="#E64F22";
    $scope.selfColor="#98DEE9";
    $scope.OthersColor="#7f345a";
    $scope.errorColor="#EC966D";
    $scope.ganttErrorFreeColor="#22E6B9";
    $scope.previousEventsColor="yellow";
    $scope.readonlycolor="#B7BBB7";

    //****************************************************************************************************//
   
        
    $rootScope.login = false;
    console.log($location.url());
    if($location.url()=="/landingPage")
    {
    	$rootScope.login = true;
    }
    console.log('home');
  	/*function dialogController ($scope, $mdDialog) {
            $scope.status = '';
         $scope.items = [1,2,3,4,5];*/
                  
         $scope.showTabDialog=function(ev){
         	console.log('showTabDialog');
         console.log('showTabDialog');
         $mdDialog.show({
              templateUrl: 'templates/loginPopUp.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              scope: this,
              preserveScope: true

            })             
         }         
         //}  

         /*$scope.loginpopUpClick=function(loginData)
         {

          localStorage.clear();
          sessionStorage.clear();
          $rootScope.login=false;
          //$window.location.href = '#/calendarView';

          console.log('loginClick');
            console.log(loginData);
            //loginFactory.login(loginData).then(function(result){
              JWTTOKEN.requestFunction('POST','userLogin',loginData,'withoutAPI').then(function(result){
                //$scope.activated=false;
              console.log(result);
              JWTTOKEN.requestFunction('POST','getUserData',{token:result.data.token},'withoutAPI').then(function(resultrole){
                  //function for getHoliday 

                  commonFactory.getHolidaysBlackOutDays();

                  /////////////////////

                console.log(resultrole);
                    sessionStorage.setItem("token",result.data.token);
                    sessionStorage.setItem("userId",resultrole.data.userId);
                  
                  var splitteddata=resultrole.data.role.split(',');
                  if(splitteddata.length>1)
                  {
                     var confirm = $mdDialog.confirm()
                          .title('Please Choose your Role?')
                          .textContent('Here we found that, you are alloted to more than 1 roles.Please choose your role to continue!!!.')
                          .ariaLabel('Lucky day')
                          .ok(splitteddata[0])
                          .cancel(splitteddata[1]);

                    $mdDialog.show(confirm).then(function() {
                        sessionStorage.setItem("role",splitteddata[0]);
                         $window.location.href = '#/calendarView';
                    
                    }, function() {
                        sessionStorage.setItem("role",splitteddata[1]);
                         $window.location.href = '#/calendarView';
                     
                    });
                  }
                  else
                  {
                      sessionStorage.setItem("role",resultrole.data.role);
                     $window.location.href = '#/calendarView';
                  }

              });
            })
           
         }*/



         //---------------------------------Create Job Order-------------------------------
//Author : PK
 function getWorkcenters() {
            Workcenter
                .find()
                .$promise
                .then(function(results) {
                    console.log(results);
                    $scope.workcenters = results;


                });
        }
       
        getWorkcenters(); //To populate in process dialog 



     $scope.SaveMasterTicket = function(master){
      console.log(master); 
      master.plant = master.plant.name; // Added by Ramesh
      master.exFactoryDate=new Date();
      master.status="DRAFT";
      // Added by Ramesh
      Masterticket
    .create(master) // Get Details from form
    .$promise
    .then(function(res) {
      //>>>>>> Added by Ramesh
      alert("Master ticket created Successfully");
      $scope.masterData = res;
      //$scope.masterticketID = res.id;  
      $scope.masterTicketID= res.id;

       var jobTreeObjDraft={};
       jobTreeObjDraft[res.id]=res;
        localStorage['jobTreeDraft'] = JSON.stringify(jobTreeObjDraft);
         localStorage['jobTreeOriginal'] = JSON.stringify(jobTreeObjDraft);

      //<<<<<<
      $mdDialog.hide();
            $mdDialog.show({
            templateUrl: 'templates/Processes/ProcessDialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope,
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
        });
    })
    .catch(function(req) { console.log("error saving process obj"); });
   
   };


   $scope.UpdateMasterTicket = function(master){
      console.log(master); 
      master.status="DRAFT";
      // Save master using services.Save status as DRAFT
      console.log(Masterticket);
         Masterticket
        .$save()
        .then(function(res)  { 
          console.log("Saved");
           $mdDialog.hide();
                    $mdDialog.show({
                    templateUrl: 'templates/Processes/ProcessDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    scope: $scope,
                    preserveScope: true, // do not forget this if use parent scope
                    clickOutsideToClose: true
                });
          })
    .catch(function(req) { console.log("error saving process obj"); });
   
   };

/*var jobOrderDialogController=function ($scope, $mdDialog,dataToPass) {
         
              dataToPass.salesOrderCreationDate = new Date();*/
         var jobOrderDialogController=function () {
       
             // console.log( $scope.salesOrderCreationDate);
             $scope.master={salesOrderCreationDate: new Date()};
              /*$scope.plant = [
                { id: 1, value: 'AX01',name:'AX01' ,color: "yellow" },
                { id: 2, value: 'AX03',name:'AX03', color: "blue"},
                { id: 3, value: 'AX04',name:'AX04', color: "purple"}
              ];*/ //<<<<<< Commented by Ramessh

             // >>>>>> Added By Ramesh
             Plant
             .find({filter:{where: {'plannerID.plannerID': sessionStorage.userId}}})
             .$promise
             .then(function(results) {
            	 $scope.plant = results
//               $scope.plant = $filter('filter')(results, { plannerID: sessionStorage.userId });
               $scope.master.plant = $scope.plant.length > 0? $scope.plant[0]:undefined;
             });
             //<<<<<<
         
            /*  $scope.master = dataToPass;
              console.log(dataToPass);*/
                     $scope.closeDialog = function() {
                        $mdDialog.hide();
                      }
                    //  $scope.SaveMasterTicket = SaveMasterTicket;
}

 $scope.CreateJobOrder=function(ev){
  $scope.selectedProcessTicket={newInstance:true};//To hide actions tab from process dialog
      jobOrderDialogController();
      $mdDialog.show({
         // locals:{dataToPass: {'name':'prasad test'}},  
          templateUrl: 'templates/job_order.html',
       
         /* clickOutsideToClose:true,
          controller: jobOrderDialogController*/
            parent: angular.element(document.body),
            targetEvent: event,
            scope: $scope,
            preserveScope: true, // do not forget this if use parent scope
            clickOutsideToClose: true
});
}
//-------------------------------------------------------




         $scope.loginpopUpClick=function(loginData)
         {

          localStorage.clear();
          sessionStorage.clear();
          $rootScope.login=false;

              JWTTOKEN.requestFunction('POST','userLogin',loginData,'withoutAPI').then(function(result){

              JWTTOKEN.requestFunction('POST','getUserData',{token:result.data.token},'withoutAPI').then(function(resultrole){
                  //function for getHoliday 

                  commonFactory.getHolidaysBlackOutDays();



                    sessionStorage.setItem("token",result.data.token);
                    sessionStorage.setItem("userId",resultrole.data.userId);
                  
                  var splitteddata=resultrole.data.role.split(',');
                  if(splitteddata.length>1)
                  {
                  	$rootScope.availableRoles = splitteddata;
                     var confirm = $mdDialog.confirm()
                          .title('Please Choose your Role?')
                          .textContent('Here we found that, you are alloted to more than 1 roles.Please choose your role to continue!!!.')
                          .ariaLabel('Lucky day')
                          .ok(splitteddata[0])
                          .cancel(splitteddata[1]);

                    $mdDialog.show(confirm).then(function() {
                        sessionStorage.setItem("role",splitteddata[0]);
                        $rootScope.currentRole =sessionStorage.getItem("role");
                         $window.location.href = '#/calendarView';
                    
                    }, function() {
                        sessionStorage.setItem("role",splitteddata[1]);
                        $rootScope.currentRole =sessionStorage.getItem("role");
                         $window.location.href = '#/calendarView';
                     
                    });

                  }
                  else
                  {
                  	$rootScope.availableRoles = [resultrole.data.role];
                    if(resultrole.data.role=="root")
                    {
                         sessionStorage.setItem("role",resultrole.data.role);
                         $rootScope.currentRole =sessionStorage.getItem("role");
                     $window.location.href = '#/user';
                    }
                    else if(resultrole.data.role=="admin")
                    {
                       sessionStorage.setItem("role",resultrole.data.role);
                       $rootScope.currentRole =sessionStorage.getItem("role");
                     $window.location.href = '#/UoMList';
                    }
                    else
                    {
                   //   $scope.planner=true;
                       sessionStorage.setItem("role",resultrole.data.role);
                       $rootScope.currentRole =sessionStorage.getItem("role");
                     $window.location.href = '#/calendarView';
                    }
                     
                  }
                  
                  Appuser
		          .find({filter:{where: {id:sessionStorage.userId}}})
		          .$promise
		          .then(function(results) {
			          	$rootScope.currentUsername = results?results[0].name:'';
			          	sessionStorage.setItem("currentUsername",$rootScope.currentUsername);
			          	
		          });

              });
            })
           
         }

  $scope.logoutClick=function(ev)
  {
    var title='Do you want to logout?';
          var text='';
           dialogFactory.confirmAlert(ev,title,text,function(status){
            if(status=="OK"){
                localStorage.clear();
                sessionStorage.clear();
                $window.location.href = '#/landingPage';

            }
            else{
              console.log('Canceled');
            }
         });


    
  }



         ///////////function for get holiday/////////////////////////////

         /*function getHolidaysBlackOutDays()
         {
             JWTTOKEN.requestFunction('GET','machinecalendars/getALLMachineWithBlackoutHolidayEvents').then(function(result){
                    console.log(result);
                    var holidayBlackOutDays={};
                    for(var i=0;i<result.data.length;i++)
                     {
                       holidayBlackOutDays[result.data[i].id]=result.data[i];
                     }

                     console.log(holidayBlackOutDays);
                      localStorage['holidayBlackOutDays'] = JSON.stringify(holidayBlackOutDays);
                    // jobTreeObjDraft[masterticketresult.data.id]=masterticketresult.data;
             });
         }*/

   //code by rinsha
   

   $scope.addProcessTicket = function(processTicket, callback) {

    console.log($scope.prefinal);
    if($scope.prefinal==true)
    {
      processTicket.prefinal = true; 
    }

              workCenter=$scope.ProcessQR;
                    var info=$scope.masterData;
                    processTicket.masterTicketID = $scope.masterTicketID; 
                    processTicket.machineID = $scope.machine.id;
                    processTicket.processName = workCenter.name;
                    processTicket.salesorderNumber = info.salesorderNo;
                    processTicket.vendorname = "ab";
                    processTicket.lineItemNo = info.lineItemNo;
                    processTicket.customerPOorCOD = info.customerPOorCOD;
                    processTicket.designname = info.designName;
                    processTicket.ColourCode = info.colourcode;
                    processTicket.materialGroup1 = info.materialGroup1;
                    processTicket.materialGroup2 =  info.materialGroup2;
                    processTicket.quantity =  info.quantity;
                    processTicket.exFactoryDate =  info.exFactoryDate;
                    processTicket.customerName = info.customerName;
                    processTicket.customerColourCode = info.customerColourCode;
                    processTicket.currentDelay = info.currentDelay;
                    processTicket.workcenterID = workCenter.id;
                    processTicket.sequentialorParrallelOrderNo = "10";
                    processTicket.slacktime = "22222";
                    processTicket.parentProcessID = "";
                    processTicket.predecessorID = [];
                    processTicket.successorID = [];
                    processTicket.processType = "process";
                    processTicket.actualstartdate=$scope.processtartDate;
                    processTicket.actualenddate=$scope.processEndDate;
      attributesData=[processTicket];

      var previousProcessData=$scope.afterProcess;
      var nextProcessData;
      Processticket.insertAProcessTicket({previousProcessID:previousProcessData,nextProcessID:nextProcessData,attributes:attributesData},function(res){
          console.log(res);
          res=res.process;
          console.log($scope.machine);
          console.log(startDate);
          console.log(endDate)
          machineCalendarObj={
                "type":"machine",
                "machineID":$scope.machine.id,
                "date":new Date(startDate),
                "processTicketID":res[0].id,
                "workcenterVendorID":$scope.machine.workcenterVendorID,
                "status": "booked",
                "deletedStatus": false,
                "usedCapacity":$scope.machine.capacity,
                "statusUpdates": [],
                "endDate":new Date(endDate),
                "durationData":durationData,
                "plannedDuration":durationData
              };

              Machinecalendar.create(machineCalendarObj)
                 .$promise
                .then(function(res) {
                  alert("Process Added Successfully");
                });

      })
        
   };

   // Added by Ramesh
   $scope.saveProcessTicket = function(processTicket, callback) {
     processTicket
      .$save()
      .then(function(res)  { 
        alert("Process Updated Successfully");
        console.log("Process Ticket Updated"); 
        callback(res);
      })
      .catch(function(req) { console.log("error while updating process ticket"); });
   };

   freshProcessCreate="no";
   $scope.DyeingChange=function(meter)
   {
    //alert('sss');
    //freshProcessCreate variable used in app.schedule.js -- freshProcessCreate==yes means not create event for it
    freshProcessCreate="yes";
    console.log($scope.ProcessQR);
    processQuantity=meter;
    $scope.workCenterID=$scope.ProcessQR.id;
     //getVendors();
     //sharedProperties.getScheduleView($scope.workCenterID,$scope);
    $scope.showTab=true;
    sharedProperties.getVendors($scope);
    console.log($scope.machines);
    console.log($scope.vendors);
   }

   $scope.selectChange=function(workCenter)
   {
      console.log('select change.............');  
      console.log(workCenter); 
       $scope.workCenterID=workCenter.id;
      // getScheduleView(workCenter.id);
      sharedProperties.getScheduleView(workCenter.id,$scope);

      //show process on after drop down rinsha

       
      Masterticket
        .find({
           filter:{ 
           include: ['processes'],
           where:{id:$scope.masterTicketID}
          }})
        .$promise
        .then(function(masterResult) {
          console.log(masterResult);
          console.log(masterResult[0].processes);
          
            console.log(masterResult[0].processes.length)
            var processDetails=masterResult[0].processes;
            var onlyProcess=[];

            for(var i=0;i<processDetails.length;i++)
            {
              console.log(processDetails[i]);
              if(processDetails[i].processType=="process")
              {
                onlyProcess.push(processDetails[i]);
              }
            }
            console.log(onlyProcess);
            $scope.afterprocesses =onlyProcess;
         

        });
   }
   //---------------------------------function schedulemachine-------------------//
//Used schdule process's machine event based on start date ,Duration 


$scope.schedulemachine=function(scheduleDuration)
{
  $scope.normalmachine=[];
  $scope.machine=[];
  sharedProperties.schedulemachine($scope);
  console.log($scope.normalmachine)
  console.log($scope.machine);



  /*$scope.showTab=false;

  normalmachine=[];
  machine=[];
  console.log(machineArray);
    for(var key in machineArray)
    {
        for(var i=0;i<machineArray[key].length;i++)
        {
          normalmachine.push(machineArray[key][i].date)
        }
        machine=machineArray[key][0].details;

      
    }

    $scope.processtartDate=startDate;
    $scope.processEndDate=endDate;*/

}

//---------------------------------end of function schedulemachine-------------------------------------//


    //------------------------------



}]);