angular.module('app')
    .controller('monthViewController', ['$location', '$filter', '$scope', '$state', '$stateParams', '$mdDialog', '$window', 'JWTTOKEN', 'dialogFactory', function($location, $filter, $scope,
        $state, $stateParams, $mdDialog, $window, JWTTOKEN, dialogFactory) {

        //REMOVING LOCALSTORAGE 
        localStorage.removeItem('jobTreeDraft');
        localStorage.removeItem('jobTreeOriginal');
        localStorage.removeItem('machineEventsDraft');


        //REMOVING LOCALSTORAGE 

        abortedJobOrderColor = "#B07B21";
        imbalanceColor = "#33FFD6";
        /*factoryOutdateColor="#8EB021";*/
        factoryOutdateColor = "red";

        var userID = sessionStorage.getItem("userId");
        var role = sessionStorage.getItem("role");
        $scope.roleName = role;
        var dataObj = [];
        var machineEventArray = [];
        $scope.todayUpdate={};


        //---------------------------------
        /*Author:PK
        To Filter Job tickets based on plant*/
        $scope.FilterMasterTickets = function(selctedPlant) {
            //called from calendar  
            console.log(selctedPlant);
            console.log($scope.events2);
            if (selctedPlant == 'All')
                $scope.events2 = $scope.masterTickets;
            else
                $scope.events2 = $filter('filter')($scope.masterTickets, { plant: selctedPlant });

        }

         $scope.searchMasterTickets = function(attribute) {
            //called from calendar  
           console.log(attribute);
            console.log($scope.events2);
           
                $scope.events2 = $filter('filter')($scope.masterTickets, attribute);

        }

        /*Author:PK
        To search job order based on attributes*/
        $scope.showSearch = function(ev) {

            $mdDialog.show({
                    locals: { dataToPass: $scope.MasterJobTickets },
                    templateUrl: 'templates/search.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    controller: function DialogController($scope, $mdDialog, dataToPass) {

                            var dialogData = {};
                            dialogData.test = "twomot";
                            dialogData.tickets = dataToPass;
                            $scope.dialogData = dialogData;
                            console.log($scope.dialogData);

                            $scope.navigateToJobTrain = function(ticket) {
                                console.log(ticket);
                                window.location.href = '#/panelView/' + ticket.id;
                                $mdDialog.hide();
                            }
                        } // controlelr passed to dialog ends
                }) //Dialog Ends
        }

        /*Author:PK
        To fit day and week view of scheduler*/
        function fitDataForDHTMLX(dataWithoutTime) {
            console.log(dataWithoutTime);
            var dayCount = 0;
            var data = angular.copy(dataWithoutTime);
            angular.forEach(data, function(value, key, obj) {

                var startDate = new Date(value.start_date); //string to date obj
                //var d = new Date(Date.UTC(data.getFullYear(), d1.getMonth(), d1.getDate(),ist));
                var d = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), -5.3));
                var min = d.getMinutes();
                d.setMinutes((30 * (dayCount)))
                value.start_date = d;
                var endDate = new Date(value.end_date); //string to date obj
                //var d = new Date(Date.UTC(data.getFullYear(), d1.getMonth(), d1.getDate(),ist));
                var d = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), -5.3));
                var min = d.getMinutes();
                d.setMinutes((30 * (dayCount)))
                value.end_date = d;

                dayCount++;
            });
            console.log(data);
            if (data.length < 24)
                scheduler.config.hour_size_px = 300;
            else
                scheduler.config.hour_size_px = 350;

            return data;
        }



        /*
        1.Display ALL Master Job Tickets 
        2.Display icons for DRAFT 
        */
        function getCalendarForPlanner() {
            JWTTOKEN.requestFunction('GET', 'mastertickets').then(function(result) {
                //console.log(result);
                var dataForDhtmlx = [];
                //console.log(result.data);

                angular.forEach(result.data, function(value, key, obj) {

                    //format required for dhtmlx scheduler

                   // console.log(value.exFactoryDate);
                    var dhtmlxObj = {}
                    dhtmlxObj.id = value.id;
                    dhtmlxObj.details = value;
                    var startDate = new Date(value.exFactoryDate);
                    //dhtmlxObj.start_date =new Date(startDate.toDateString())

                    dhtmlxObj.start_date = startDate.toDateString();
                    var endDate = new Date(value.exFactoryDate);
                    //dhtmlxObj.end_date = new Date(endDate.toDateString());
                    dhtmlxObj.end_date = endDate.toDateString();
                    value.exFactoryDate = startDate.toDateString();
                    dhtmlxObj.text = value.salesorderNo;
                    dhtmlxObj.plant = value.plant;
                    if (value.plant == "AX01")
                        dhtmlxObj.color = "yellow";
                    else if (value.plant == "AX03")
                        dhtmlxObj.color = "blue";
                    else if (value.plant == "AX04")
                        dhtmlxObj.color = "purple";
                    dhtmlxObj.textColor = "black";

                    this.push(dhtmlxObj);
                }, dataForDhtmlx);
                //console.log(dataForDhtmlx);
                $scope.MasterJobTickets = result.data;
               // console.log(fitDataForDHTMLX(dataForDhtmlx));
                var fitData = fitDataForDHTMLX(dataForDhtmlx);
                $scope.masterTickets = fitData;
                $scope.events2 = fitData;

            });

        }
        //---------------------------------








        //for correct date format
        dateFormating = function(date) {
                var today = new Date(date);
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                //var today = dd+'-'+mm+'-'+yyyy;
                var today = yyyy + '-' + mm + '-' + dd;
                return today;
            }
            //scheduler event load function

        function dateRangeWithoutHoliday(data) {

            console.log(data);
            var start = new Date(data.date),
                end = new Date(data.endDate),
                year = start.getFullYear(),
                month = start.getMonth()
            day = start.getDate(),
                dates = [start];

            holiday = [];

            console.log(end);

            while (dates[dates.length - 1] < end) {
                //dates.push(new Date(year, month, ++day));
                dates.push(new Date(year, month, ++day));
                //dates.push(start)
            }

            console.log(dates);
           dates.splice(-1,1)
            var machineID = data.machineID;

            //remove holiday and blackout days from calender same code from processview.js
            //make common function for it .in factory.js

            if (localStorage['holidayBlackOutDays'] != undefined) {
                var holidayBlackOutDaysFromLocalstorage = JSON.parse(localStorage['holidayBlackOutDays']);
                if (holidayBlackOutDaysFromLocalstorage[machineID] != undefined) {
                    if (holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar.length > 0) {
                        for (var i = 0; i < holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar.length; i++) {
                            console.log(holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar[i].date);
                            var holidayDate = new Date(holidayBlackOutDaysFromLocalstorage[machineID].machinecalendar[i].date);
                            var datecom = new Date(holidayDate.getFullYear(), holidayDate.getMonth(), holidayDate.getDate());
                            console.log(datecom);

                            console.log(dates);

                            for (var k = 0; k < dates.length; k++) {
                                if (dates[k].valueOf() == datecom.valueOf()) {
                                    console.log('equalllll');
                                    dates.splice(k, 1);
                                }
                            }

                        }
                    }

                }
            }

            console.log(dates);




            return dates;
        }
        eventPushFunction = function(data) {
                console.log(data);
                if (data.length != 0) {
                    var myDate = new Date(data[0].date)
                    var month = myDate.getMonth() + 1;
                    machineEventArray[month] = data;
                    dataObj = [];
                    for (var i = 0; i < data.length; i++) {
                        var ticketcolor = data[i].processticketRelation.ColourCode;
                        // var today=dateFormating(data[i].date);
                         var readyToInstallColor="#24FCA1"
                        console.log('data[i]...........................................');
                        console.log(data[i]);
                        dates = dateRangeWithoutHoliday(data[i]);
                        console.log(dates);
                        if(data[i].processticketRelation.readyToUpdate==true || (data[i].processticketRelation.predecessorID.length==0 && data[i].processticketRelation.status!="completed"))
                        {
                            ticketcolor=readyToInstallColor;
                        }
                        for (var j = 0; j < dates.length; j++) {
                            console.log(dates[j]);
                            var today = dateFormating(dates[j]);

                            console.log(today);

                            //dataObj.push({ id: data[i].id + "-" + dates[j], start_date: today+"T00:00:00.000Z", end_date: "2017-03-15T00:00:00.000Z", text: data[i].processticketRelation.processName, details: data[i], status: "statusUpdate", color: ticketcolor, textColor: "black" });


                           dataObj.push({ id: data[i].id + "-" + dates[j], start_date: today, end_date: today, text: data[i].processticketRelation.processName, details: data[i], status: "statusUpdate", color: ticketcolor, textColor: "black" });
                        }


                        /*var start=new Date(data[i].date),
                          end=new Date(data[i].endDate),
                          year = start.getFullYear(),
                          month = start.getMonth()
                          day = start.getDate(),
                          dates = [start];

                      while(dates[dates.length-1] < end) {
                        dates.push(new Date(year, month, ++day));
                      }

                      console.log(dates);*/



                        // dataObj.push({id:data[i].id,start_date:today,end_date: today, text:data[i].processticketRelation.processName,details:data[i],status:"statusUpdate",color:ticketcolor,textColor:"black"});
                        // dataObj.push({id:data[i].id,start_date:today,end_date: today, text:data[i].processticketRelation.processName,details:data[i]});

                    }
                    console.log(dataObj);

                    eventObj = dataObj;
                    fitDataForDHTMLX_calendar();
                    //$scope.events21 = dataObj;
                }
            }

            //for fieldofficer


    function fitDataForDHTMLX_calendar(){
        var weekDayCounter=[];
        var objLength = eventObj.length;
        var count = 0;
        var newobj;
        while ( count < objLength) {
          

            var d1 = new Date(eventObj[count].end_date);
            var ist = -5.3 ; // Mountain Daylight Time
          var currProperty = eventObj[count].end_date;
          console.log(currProperty);
          console.log(weekDayCounter[currProperty]);
          dayCount = weekDayCounter[currProperty];
            if ( weekDayCounter[currProperty] == undefined){
              var dayCount = 0;}
            var d = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(),ist));
            var min =d.getMinutes() ;
             d.setMinutes((30 * (dayCount )))
              newobj = {start_date: d } ;

          
            var d2 = new Date(Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate(),ist));
               d2.setMinutes( (30 * (dayCount+1)))

               newobj=eventObj[count];
               newobj.end_date= d2;
               newobj.text = eventObj[count].text;

             eventObjNew.push(newobj);
          
             count++;
             dayCount++ 
             weekDayCounter[currProperty] = dayCount ;

        }

        $scope.events2=eventObjNew;
    }



            //api call for machine event on perticular date period
        getmachineEventsByDate = function(date) {
            console.log('getmachineEventsByDate');
            console.log( 'machinecalendars/getmachineEventsByDateForaWorkcenterVendor/'+userID+'/'+date );
            JWTTOKEN.requestFunction('POST', 'machinecalendars/getmachineEventsByDateForaWorkcenterVendor', { "fieldofficerID": userID, "date": date }).then(function(data) {
                console.log(data);

                eventPushFunction(data.data);
            });
        }

        if (role == "fieldofficer") {
            alert('fieldofficer')
            getmachineEventsByDate(new Date());
        } else {

            getCalendarForPlanner();

            /*// schedulerrr
            JWTTOKEN.requestFunction('GET', 'mastertickets?filter[include]=processes').then(function(result) {
                //console.log(result);
                var dataObj = [];
                for (var i = 0; i < result.data.length; i++) {
                    // var today=dateFormating(result.data[i].planenddate);
                    var today = dateFormating(result.data[i].exFactoryDate);
                    var jobcolor = result.data[i].colourcode;
                    // var jobcolor='default color';
                    
                   
                    dataObj.push({ id: result.data[i].id, start_date: today, end_date: today, text: result.data[i].salesorderNo, color: jobcolor, details: result.data[i], textColor: "black" });

                }
                //console.log(dataObj);
                eventObj = dataObj;
                fitDataForDHTMLX();
                //var dataObj1=[{ start_date: today+" 00:00", end_date: today+" 24:00", text:"45637", color:"#7f345a"}];
                // $scope.events2=eventObjNew;
                //$scope.events2 = dataObj;


            });*/
        }
        /*$scope.events2=
              [{ start_date: "2017-01-30 01:00", end_date: "2017-01-30 2:00", text:"JO-1234" },
              { start_date: "2017-01-30 2:00", end_date: "2017-01-30 3:00", text:"JO-43567" },
              { start_date: "2017-01-30 3:00", end_date: "2017-01-30 4:00", text:"JO-9878" },
              { start_date: "2017-01-30 4:00", end_date: "2017-01-30 5:00", text:"JO-878798" },
              { start_date: "2017-01-30 5:00", end_date: "2017-01-30 6:00", text:"JO-67644" }]*/

        /*[{ start_date: "2017-01-30 01:00", end_date: "2017-01-30 2:00", text:"JO-1234" },
        { start_date: "2017-01-30 2:00", end_date: "2017-01-30 3:00", text:"JO-43567" },
        { start_date: "2017-01-30 3:00", end_date: "2017-01-30 4:00", text:"JO-9878" },
        { start_date: "2017-01-30 4:00", end_date: "2017-01-30 5:00", text:"JO-878798" },
        { start_date: "2017-01-30 5:00", end_date: "2017-01-30 6:00", text:"JO-67644" }]*/

        var eventObj1 = [
            { start_date: "2017-01-30", end_date: "2017-01-30", text: "JO-1234" },

            { start_date: "2017-02-1", end_date: "2017-02-2", text: "JO-1236" },
            { start_date: "2017-01-30", end_date: "2017-01-30", text: "JO-1235" },
            { start_date: "2017-02-2", end_date: "2017-02-2", text: "JO-1238" },

            { start_date: "2017-02-1", end_date: "2017-02-2", text: "JO-1236" },
            { start_date: "2017-01-30", end_date: "2017-01-30", text: "JO-1235" },
            { start_date: "2017-02-2", end_date: "2017-02-2", text: "JO-1238" }
        ];
        var eventObj = [];
        var eventObjNew = []
            //fitDataForDHTMLX();



        /*$scope.events2=eventObjNew;*/
        /////////////////////////////////////////////////////////////////
        $scope.scheduler = { date: new Date(), mode: "month" };
        scheduler.config.xml_date = "%Y-%m-%d %H:%i";
        //------------------------------------------------------------------------------------------------

        scheduler.attachEvent("onBeforeDrag", function(id, mode, e) {
            //any custom logic here
            return false;
        });

        checkWhetherEventCompleted = function(id) {
            JWTTOKEN.requestFunction('GET', 'machinecalendars/' + id).then(function(eventdata) {
                if (eventdata.status == "completed") {
                    return false;
                } else {
                    return true;
                }
            });
        }

        var PredecessorDetailsObj = [];
        var completedCount = 0;
        var clickedeventID;
        scheduler.attachEvent("onClick", function(id, e) {
            clickedeventID=id;
            if (role == "fieldofficer") {
                //alert(id)
                var event = scheduler.getEvent(id);
               // alert(event)
                $scope.eventDate = event.start_date;
                console.log(event);
                var predecessors = event.details.processticketRelation.predecessorID;
                console.log(predecessors);
                PredecessorDetailsObj.length = 0;
                completedCount = 0;
                findPredecessorDetailsLoop(predecessors, function(obj) {
                    console.log(obj)
                    $scope.predecessorProcesses = obj;
                    /*$scope.machinecalendarData = scheduler.getEvent(id).details;
                    console.log(scheduler.getEvent(id).details)*/

                     var evntDetails=scheduler.getEvent(id).details;
                    var gmtStartDate=new Date(evntDetails.processticketRelation.actualstartdate);
                    var gmtEndDate=new Date(evntDetails.processticketRelation.actualenddate);
                     $scope.gmtEndDate = gmtEndDate.toDateString();
                    $scope.gmtStartDate = gmtStartDate.toDateString(); 
                    $scope.machinecalendarData =evntDetails ;
                    //if all predecessors are completed 


                    if (new Date(event.start_date) > new Date()) {
                        $scope.predcompleted = false;
                    } else {
                        $scope.predcompleted = true;
                    }
                    if (obj.length > 0) {
                        $scope.predcompleted = obj[0].completedStatus;
                    } else {
                        $scope.predcompleted = true;
                    }

                    if (event.details.status == "completed") {
                        if (event.details.processticketRelation.status != "completed") {
                            var title = 'This Ticket already set as Completed!!!But its process is not marked as Complete.Do you want mark process as completed?';
                            var text = '';
                            dialogFactory.confirmAlert(null, title, text, function(status) {
                                if (status == "OK") {

                                    $scope.setProcessCompleted();
                                } else {
                                    $mdDialog.hide();
                                }
                            });

                        } else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#popupContainer')))
                                .clickOutsideToClose(true)
                                .title('Ticket Completed')
                                .textContent('This Ticket already set as Completed!!!')
                                .ok('Ok!')
                            );
                        }

                    } else {
                        var selectedprocessName=scheduler.getEvent(id).details.processticketRelation.processName;

                        if(selectedprocessName=="stores")
                        {
                            $scope.statuses=[{"name":"completed","value":100},
                            {"name":"Incompleted","value":10}];
                        }
                        else if(selectedprocessName=="winding")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"In Progress","value":10},
                            {"name":"Waiting for approval","value":15},
                            {"name":"completed","value":100}];
                        }
                        else if(selectedprocessName=="jigger_dyeing")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"In Jigger","value":10},
                            {"name":"Waiting for approval","value":15},
                            {"name":"In correction","value":20},
                            {"name":"completed","value":100}];
                        }
                        else if(selectedprocessName=="vat_dyeing")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"In Bath","value":10},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"In Correction","value":20},
                            {"name":"Gone for Tyeing","value":25},
                            {"name":"Swatch","value":30},
                            {"name":"completed","value":100}];
                        }
                         else if(selectedprocessName=="cabinet_dyeing")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"In Bath","value":10},
                            {"name":"Gone for Tyeing","value":25},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"Swatch","value":30},
                            {"name":"In Correction","value":20},
                            {"name":"completed","value":100}];
                        }
                        else if(selectedprocessName=="weaving")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"In Progress","value":10},
                            {"name":"In Warping","value":11},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"Weft Correction","value":20},
                            {"name":"In Mending","value":21},
                            {"name":"completed","value":100}
                             ];
                        }
                         else if(selectedprocessName=="finishing")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"In Warping","value":11},
                            {"name":"In Progress","value":10},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"completed","value":100}
                            ];
                        }
                         else if(selectedprocessName=="printing")
                        {
                            $scope.statuses=[
                          {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"Colour Mixing","value":11},
                            {"name":"On Table","value":12},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"In Correction","value":20},
                            {"name":"In curing","value":21},
                            {"name":"completed","value":100}
                            ];
                        }
                         else if(selectedprocessName=="outright_purchase")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"In Progress","value":10},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"completed","value":100}
                            ];
                        }
                           else if(selectedprocessName=="stiching")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"Waiting for front/back panel","value":6},
                            {"name":"Waiting for accessories","value":7},
                            {"name":"In Stitching","value":10},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"completed","value":100}
                            ];
                        }
                           else if(selectedprocessName=="embroidery")
                        {
                            $scope.statuses=[
                            {"name":"In Que","value":0},
                            {"name":"In Plan","value":5},
                            {"name":"Waiting for Thread","value":6},
                            {"name":"In Progress","value":10},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"In Correction","value":20},
                            {"name":"completed","value":100}
                            ];
                        }
                             else if(selectedprocessName=="accessories")
                        {
                            $scope.statuses=[
                            {"name":"Order Placed","value":0},
                            {"name":"Expected","value":5},
                            {"name":"Waiting for Approval","value":15},
                            {"name":"Sample approval done, Bulk awaited","value":16},
                            {"name":"Ready at vendor","value":17},
                            {"name":"Arrived at store","value":100}
                            ];
                        }
                        else
                        {
                            $scope.statuses=[{"name":"completed","value":100},{"name":"Incompleted","value":10},{"name":"partial","value":11}];
                        }


                        $mdDialog.show({
                            contentElement: '#statusUpdate',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true
                        });
                    }
                });
            } else {
                window.location.href = '#/panelView/' + id;
            }

            return false;
        });

        function findPredecessorDetailsLoop(predecessors, cb) {

            for (var i = 0; i < predecessors.length; i++) {
                findPredecessorDetails(predecessors[i].id, predecessors.length - 1, i, cb)
            }
            if (predecessors.length == 0) {
                cb(PredecessorDetailsObj);
            }
        }

        function findPredecessorDetails(id, length, iteration, cb) {
            JWTTOKEN.requestFunction('GET', 'processtickets/' + id).then(function(predecessorData) {
                console.log(predecessorData);
                console.log(predecessorData.data.lastStatusUpdateOn);
                console.log(predecessorData.data.statusupdatePercentage);
                if (predecessorData.data.status == "completed") {
                    completedCount++;
                }

                PredecessorDetailsObj.push({ "processName": predecessorData.data.processName, "lastStatusUpdateOn": predecessorData.data.lastStatusUpdateOn, "currentStatus": predecessorData.data.lastUpdatedStatus, "completedStatus": false })
                if (length == iteration) {
                    if (completedCount == length + 1) {
                        PredecessorDetailsObj[0].completedStatus = true;
                    }

                    cb(PredecessorDetailsObj);
                }

            });

        }

        //*************************SET AS PROCESS COMPLETED********************************************//
        ///////////////////////////////////////////////////////////////////////////////////////////////

        $scope.setProcessCompleted = function() {
            // console.log($scope.machinecalendarData.processticketRelation.id)

            JWTTOKEN.requestFunction('PUT', 'processtickets/' + $scope.machinecalendarData.processticketRelation.id, { "status": "completed" }).then(function(putdata) {
                // $mdDialog.hide();
                getmachineEventsByDate(new Date($scope.machinecalendarData.date));
            })
        }

        ///////////////////////////////////////////////////////////////////////
        function statusUpdatePercentageForAProcess(processTicketID, status) {
            JWTTOKEN.requestFunction('GET', 'processtickets?filter[where][id]=' + processTicketID + '&filter[include][machinecalendar]').then(function(processticket) {

                console.log(processticket)
                console.log(processticket.data[0].statusupdatePercentage)

                var currentstatusupdatePercentage = processticket.data[0].statusupdatePercentage.split('/');
                var addresult = parseInt(currentstatusupdatePercentage[0]) + 1;

                var machineeventsCount = processticket.data[0].machinecalendar.length;

                var newstatusupdatepercentage = addresult + "/" + currentstatusupdatePercentage[1];
                var obj = { "statusupdatePercentage": newstatusupdatepercentage, "lastStatusUpdateOn": dateFormating(new Date()) + "T00:00:00.000Z", "lastUpdatedStatus": status };
                JWTTOKEN.requestFunction('PUT', 'processtickets/' + processTicketID, obj).then(function(processticket) {

                    console.log('updated')
                    getmachineEventsByDate(new Date($scope.machinecalendarData.date));
                });

            });

        }

        scheduler.attachEvent("onClick1", function(id, e) {

            console.log(id);
            console.log(e);
            if (role == "fieldofficer") {
                console.log(scheduler.getEvent(id));

                JWTTOKEN.requestFunction('GET', 'machinecalendars?filter[where][id]=' + id + '&filter[include][processticketRelation]').then(function(eventdata) {
                    console.log(eventdata);
                    if (eventdata.data[0].status == "completed") {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Ticket Completed')
                            .textContent('This Ticket already set as Completed!!!')
                            .ok('Ok!')
                        );
                    } else {
                        $scope.machinecalendarData = scheduler.getEvent(id).details;
                        $mdDialog.show({
                            contentElement: '#statusUpdate',
                            parent: angular.element(document.body),
                            clickOutsideToClose: true
                        });
                    }
                });


                /* else if()
                     {
                      // get its process ticket ID , get that process's previous process id 
                      //check that previous process is completed or not 
                      // if not show alert

                     }*/
            } else {
                window.location.href = '#/panelView/' + id;
            }

            return false;
        });



        ///////////////////////////////////////////////////////////////////////
        /*$scope.showTabDialog = function(ev) {
                console.log('showTabDialog');
                $mdDialog.show({
                        locals: { dataToPass: {} },
                        templateUrl: 'templates/job_order.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        controller: function DialogController($scope, $mdDialog, dataToPass) {
                            // $scope.colorArray=["#ee59c2","#E9967A","#9763fd","#b2755c"];

                            
                            dataToPass.salesOrderCreationDate = new Date();

                            console.log($scope.salesOrderCreationDate);
                            $scope.plant = [
                                { id: 1, value: 'AX01', name: 'AX01', color: "yellow" },
                                { id: 2, value: 'AX03', name: 'AX03', color: "blue" },
                                { id: 3, value: 'AX04', name: 'AX04', color: "purple" }
                            ];
                            $scope.master = dataToPass;
                            /////////////////////////////////////////////////
                            $scope.closeDialog = function() {
                                $mdDialog.hide();
                            }


                            // Save of Master Ticket 
                            $scope.navigation = function(master) {
                                master.lastUpdate = new Date();
                                 // Following fields must be computed 
                                 // master.planstartdate = master.lastUpdate;
                                 // master.planenddate = master.lastUpdate;
                                master.currentDelay = 12;
                                master.noofplanneddaystogo = 23;
                                master.noOfProcessTogo = 3;
                                master.currentProcess = "Weaving";
                                 // Following fields must be computed 
                                console.log(master);
                                master.status = "draft";
                                master.justcreated = true;
                                master.colourcode = master.plant.color;

                                master.plant = master.plant.value;
                                // master.office=master.office.name;
                                master.planstartdate = dateFormating(master.salesOrderCreationDate) + "T00:00:00.000Z";
                                master.actualstartdate = dateFormating(master.salesOrderCreationDate) + "T00:00:00.000Z";
                          //       master.actualenddate=dateFormating(master.exFactoryDate)+"T00:00:00.000Z";
                          // master.planenddate=dateFormating(master.exFactoryDate)+"T00:00:00.000Z";

                                // master.actualenddate=dateFormating(new Date())+"T00:00:00.000Z";
                                // master.planenddate=dateFormating(new Date())+"T00:00:00.000Z";


                                master.actualenddate = dateFormating(master.salesOrderCreationDate) + "T00:00:00.000Z";
                                master.planenddate = dateFormating(master.salesOrderCreationDate) + "T00:00:00.000Z";
                                master.exFactoryDate = dateFormating(master.salesOrderCreationDate) + "T00:00:00.000Z";


                                master.exFactoryDate = dateFormating(master.exFactoryDate) + "T00:00:00.000Z";
                                console.log(master);
                                JWTTOKEN.requestFunction('POST', 'mastertickets', master).then(function(result) {
                                    $mdDialog.hide();
                                    sessionStorage.setItem("info", JSON.stringify(result.data));
                                    window.location = '#/processView/start';
                                })

                            }

                        }
                    }) //md-dialog ends
            }*/
            //--------------------------------------------------------
           
        $scope.addStatus = function(todayUpdate, valid) {

            console.log(todayUpdate);

            console.log('$scope.machinecalendarData');
            console.log($scope.machinecalendarData);

            console.log($scope.eventDate);
            var updates = [];
            if ($scope.machinecalendarData.statusUpdates != undefined) {
                updates = $scope.machinecalendarData.statusUpdates;

            }
            updates.push({ "remark": todayUpdate.statusUpdates, "status": todayUpdate.status, "userID": userID, "date": new Date(), "eventDate": $scope.eventDate ,"percentageofcompletion":todayUpdate.percentageofcompletion });
            todayUpdate.statusUpdates = updates;
            console.log(todayUpdate);

         
            if(todayUpdate.percentageofcompletion==100)
            {
                 todayUpdate.status = "completed";
                            scheduler.getEvent(clickedeventID).status = "completed";
                            scheduler.updateEvent(clickedeventID); // renders the updated event
            }
            else
            {   
                 todayUpdate.status = "incomplete";
                            scheduler.getEvent(clickedeventID).status = "incomplete";
                            scheduler.updateEvent(clickedeventID); // renders the updated event
            }   

            JWTTOKEN.requestFunction('PUT', 'machinecalendars/' + $scope.machinecalendarData.id, { "statusUpdates": todayUpdate.statusUpdates, "status": todayUpdate.status, "lastStatusUpdateDate": new Date() }).then(function(putdata) {


                            if(todayUpdate.percentageofcompletion=="100")
                            {
                                todayUpdate.status = "completed";
                                var obj={"status" :"completed" , "readyToUpdate":false,"lastStatusUpdateOn" :new Date()}
                                JWTTOKEN.requestFunction('PUT', 'processtickets/' + $scope.machinecalendarData.processTicketID, obj).then(function(processticket) {
                                                
                                      //get SUUCCESSORS OF THIS PROCESSTICKET
                                      //THEN UPDATE EACH SUCCESORS "readytoupdate" attribute to true
                                      var successors=processticket.data.successorID;
                                      console.log(successors)
                                      updateSuccessorAttributeLoop(successors,function(status)
                                      {
                                        //no of process to Go ,current process 
                                        updateMaterticketAttributes($scope.machinecalendarData.processTicketID,function(status)
                                        {
                                                 scheduler.getEvent(clickedeventID).status = "completed";
                                                 scheduler.updateEvent(clickedeventID); //renders the updated event
                                                 $mdDialog.hide();
                                                 $scope.todayUpdate = null;
                                                 getmachineEventsByDate(new Date($scope.machinecalendarData.date));
                                        });
                                        
                                     });
                                });
                            }
                            else
                            {
                                 var obj={"lastStatusUpdateOn" :new Date()}
                                  JWTTOKEN.requestFunction('PUT', 'processtickets/' + $scope.machinecalendarData.processTicketID, obj).then(function(processticket) {                                
                                        updateMaterticketAttributes($scope.machinecalendarData.processTicketID,function(status)
                                        {
                                                $mdDialog.hide();
                                                $scope.todayUpdate = null;
                                                getmachineEventsByDate(new Date($scope.machinecalendarData.date));
                                         });
                                });
                            }
            });
        }


        function updateMaterticketAttributes(processTicketID,cb)
        {
             //**************************************************************************************?/
                 //For each status update, update MASTER TICKET for field 
                 //1 . CurrentProcess . It should be an object array like folowing 
                            //[{date:Mar-06-17, process:"weaving01", Process:Weaving }
                            //{date:Mar-06-17, process:"weaving01", Process:Weaving }
                            //{date:Mar-06-17, process:"weaving01", Process:Weaving }]
                 //2 .  No of processes to G0 =Total Main Processes  - Processes that started status update.
                //**************************************************************************************?/ 
                    var obj_={"id": processTicketID}
                   JWTTOKEN.requestFunction('POST', 'mastertickets/updateMasterAfterStatusUpdate',obj_).then(function(_masterticketupdated) {
                                cb("success")
                     });
        }


        function updateSuccessorAttributeLoop(successors,cb)
        {
            if(successors.length==0)
            {
                cb("success");
            }
            else
            {
                for(var i=0;i<successors.length;i++)
                {
                    updateReadyToUpdate(successors[i].id,successors.length-1,i,cb);
                }
            }          
        }

        function updateReadyToUpdate(successorID,length,iteration,cb)
        {
             var obj={"readyToUpdate" :true}
             JWTTOKEN.requestFunction('PUT', 'processtickets/' +successorID, obj).then(function(processticket) {
                if(length==iteration)
                {
                    cb("success");
                }
             });
        }


        $scope.addStatus1 = function(todayUpdate, valid) {
            var updates = []
            if ($scope.machinecalendarData.statusUpdates != undefined) {
                updates = $scope.machinecalendarData.statusUpdates;
            }
            updates.push({ "remark": todayUpdate.statusUpdates, "percentageofcompletion": todayUpdate.percentageofcompletion, "status": todayUpdate.status, "userID": userID, "date": new Date() });
            todayUpdate.statusUpdates = updates;
            JWTTOKEN.requestFunction('PUT', 'machinecalendars/' + $scope.machinecalendarData.id, { "statusUpdates": todayUpdate.statusUpdates, "status": todayUpdate.status, "percentageofcompletion": todayUpdate.percentageofcompletion }).then(function(putdata) {
                console.log(putdata);
                $mdDialog.hide();
                $scope.todayUpdate = null;

                //////////////////////////
                JWTTOKEN.requestFunction('GET', 'processtickets?filter[where][id]=' + $scope.machinecalendarData.processTicketID + '&filter[include][machinecalendar]').then(function(processticket) {

                    if (processticket.data[0].machinecalendar.length > 0) {
                        var count = 0;
                        for (var i = 0; i < processticket.data[0].machinecalendar.length; i++) {
                            if (processticket.data[0].machinecalendar[i].status == "completed") {

                                count++;
                                console.log(count)
                            }
                            if (i == processticket.data[0].machinecalendar.length - 1) {
                                console.log('last iteration')
                                console.log(count)
                                if (count == processticket.data[0].machinecalendar.length) {
                                    var obj = { "status": "completed" };
                                    JWTTOKEN.requestFunction('PUT', 'processtickets/' + $scope.machinecalendarData.processTicketID, obj).then(function(processticket) {
                                        console.log('updated')
                                    });
                                }
                            }
                        }

                    } else {
                        console.log('no events')
                    }
                    /*  JWTTOKEN.requestFunction('GET','processtickets/'+$scope.machinecalendarData.processTicketID).then(function(processticket){*/
                });
                ///////////////////////
            });
        }
        $scope.cancel = function() {
            $mdDialog.hide();
        }

        $scope.nextClick = function() {
            console.log('nextClick');
            if (role == "fieldofficer") {
                var myDate = new Date(scheduler.getState().max_date)
                if (scheduler.getState().mode == "week") {
                    myDate.setDate(myDate.getDate() + 7);
                }
                var month = myDate.getMonth() + 1;
                if (machineEventArray[month] == undefined) {
                    getmachineEventsByDate(new Date(myDate));
                } else {
                    eventPushFunction(machineEventArray[month]);
                }
            }

        }
        $scope.prevClick = function() {
            console.log('prevClick');
            if (role == "fieldofficer") {
                var myDate = new Date(scheduler.getState().min_date)
                if (scheduler.getState().mode == "week") {
                    myDate.setDate(myDate.getDate() - 7);
                }
                var month = myDate.getMonth() + 1;
                if (machineEventArray[month] == undefined) {
                    getmachineEventsByDate(new Date(myDate));
                } else {
                    eventPushFunction(machineEventArray[month]);
                }
            }

        }


        //////////////////////////////////////////////////
        /* load during controller initialization */
        // getCalendarForPlanner();
        //////////////////////////////////////////////////
    }]);