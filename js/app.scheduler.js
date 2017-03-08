angular.module('app')
.directive('dhxScheduler', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template:'<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

    

    link:function ($scope, $element, $attrs, $controller){
   
      scheduler.config.dblclick_create = false;

      //default state of the scheduler
      if (!$scope.scheduler)
        $scope.scheduler = {};
      $scope.scheduler.mode = $scope.scheduler.mode || "month";
      $scope.scheduler.date = $scope.scheduler.date || new Date();

      //watch data collection, reload on changes
      $scope.$watch($attrs.data, function(collection){
        scheduler.clearAll();
        scheduler.parse(collection, "json");
      }, true);

      //mode or date
      $scope.$watch(function(){
        return $scope.scheduler.mode + $scope.scheduler.date.toString();
      }, function(nv, ov) {
        var mode = scheduler.getState();
        if (nv.date != mode.date || nv.mode != mode.mode)
          scheduler.setCurrentView($scope.scheduler.date, $scope.scheduler.mode);
      }, true);

      //size of scheduler
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        scheduler.setCurrentView();
      });

      //styling for dhtmlx scheduler
      $element.addClass("dhx_cal_container");

      //init scheduler
      scheduler.init($element[0], $scope.scheduler.date, $scope.scheduler.mode);
      // scheduler height/////////////////////////

      scheduler.xy.bar_height = 50;//200
        scheduler.templates.event_bar_date = function(start,end,ev){
         // console.log('event_bar_date');
             return "";
        };

        scheduler.templates.event_bar_text = function(start,end,event){
          console.log(event);
          if(event.details != undefined)
          {
            var aHtml = "<p>"+event.details.salesorderNo+"</p><p>"+event.details.lineItemNo+"</p><p>"+event.details.exFactoryDate+"</p><p>"+event.details.customerPOorCOD+"</p>"
          }

            if (event.details.currentExFactoryDate == undefined)
                      var currentExfactoryDate = new Date(event.details.exFactoryDate);
            else
                      var currentExfactoryDate = new Date(event.details.currentExFactoryDate);

                 var exFactoryDate = new Date(event.details.exFactoryDate);




                      if(event.status=="statusUpdate")
                      {
                        if(event.details.status=="completed")
                        {
                          aHtml = "<md-icon style='margin-left:1%;cursor:pointer'><i class='material-icons'>done</i></md-icon><p>"+event.text
                          +"</p><p>"+event.details.processticketRelation.salesorderNumber+"</p><p>"+event.details.processticketRelation.lineItemNo+"</p><p>"+event.details.processticketRelation.customerPOorCOD+"</p>"
                        }
                        
                        else
                        {
                          aHtml = "<p>"+event.text+"</p><p>"+event.details.processticketRelation.salesorderNumber+"</p><p>"+event.details.processticketRelation.lineItemNo+"</p><p>"+event.details.processticketRelation.customerPOorCOD+"</p>"
                        }

                        //aHtml = "<md-icon style="margin-left:1%;cursor:pointer" ng-click="ViewMaster(master)"><i class="material-icons">pageview</i></md-icon><p>"+event.text+"</p><p>"+event.details.processticketRelation.salesorderNumber+"</p><p>"+event.details.processticketRelation.lineItemNo+"</p><p>"+event.details.processticketRelation.customerPOorCOD+"</p>"
                        
                      }
                      else if (currentExfactoryDate > exFactoryDate ){

                         aHtml = "<p><md-icon style='margin-left:1%;cursor:pointer'><i class='material-icons'>alarm</i></md-icon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+event.text+"</p>"
                        }
                        return aHtml;
          
          

          /*var aHtml = "<p>"+event.text+"</p><p>"+event.start_date+"</p><p>"+event.end_date+"</p>"*/
              
        };
        ///////////scheduler tooltip////////
        scheduler.templates.tooltip_text = function(start,end,event) {
          //var tooltipStyle="<b>Event:</b> "+event.text;
         // var tooltipStyle="<b>Sales order No : "+event.details.salesorderNo+"</b><br><b>Line ItemNo : "+event.details.lineItemNo+"</b><br><b>Plant : "+event.details.plant+"</b><br><b>Customer POorCOD : "+event.details.customerPOorCOD+"</b><br><b>Quantity : "+event.details.quantity+"</b><br><b>Design Name : "+event.details.designname+"</b><br><b>Material Group1 : "+event.details.materialGroup1+"</b><br><b>Material Group2 : "+event.details.materialGroup2+"</b><br><b>Ex-Factory Date : "+event.details.exFactoryDate+"</b><br><b>Current Process : "+event.details.currentProcess+"</b>"
           var tooltipStyle="<b>Sales order No : "+event.details.salesorderNo+"</b><br><b>Line ItemNo : "+event.details.lineItemNo+"</b><br><b>Plant : "+event.details.plant+"</b><br><b>Customer POorCOD : "+event.details.customerPOorCOD+"</b><br><b>Quantity : "+event.details.quantity+"</b><br><b>Design Name : "+event.details.designname+"</b><br><b>Material Group1 : "+event.details.materialGroup1+"</b><br><b>Material Group2 : "+event.details.materialGroup2+"</b><br><b>Ex-Factory Date : "+event.details.exFactoryDate+"</b><br><b>Current Ex-Factory Date : "+event.details.currentExFactoryDate+"</b><br><b>Current Process : "+event.details.currentProcess+"</b>"
          if(event.status=="statusUpdate")
          {
            var tooltipStyle="<b>Sales order No : "+event.details.processticketRelation.salesorderNo+"</b><br><b>Line ItemNo : "+event.details.processticketRelation.lineItemNo+"</b><br><b>Plant : AX01</b><br><b>Customer POorCOD : "+event.details.processticketRelation.customerPOorCOD+"</b><br><b>Quantity : "+event.details.processticketRelation.quantity+"</b><br><b>Design Name : "+event.details.processticketRelation.designname+"</b><br><b>Material Group1 : "+event.details.processticketRelation.materialGroup1+"</b><br><b>Material Group2 : "+event.details.processticketRelation.materialGroup2+"</b><br><b>Ex-Factory Date : "+event.details.processticketRelation.exFactoryDate+"</b><br><b>Job OrderID : "+event.details.processticketRelation.masterTicketID+"</b>"
          }
          
            
            return tooltipStyle;
        };
        ////////////////////////////////

        scheduler.templates.event_text = function(start,end,event){
          var aHtml = "<p>"+event.details.salesorderNo+"</p><p>"+event.details.lineItemNo+"</p><p>"+event.details.exFactoryDate+"</p><p>"+event.details.customerPOorCOD+"</p>"
          if(event.status=="statusUpdate")
          {
            aHtml = "<p>"+event.text+"</p><p>"+event.details.processticketRelation.salesorderNumber+"</p><p>"+event.details.processticketRelation.lineItemNo+"</p><p>"+event.details.processticketRelation.customerPOorCOD+"</p>"
          }
         // var aHtml = "<p>"+event.details.salesorderNo+"</p><p>"+event.details.lineItemNo+"</p><p>"+event.details.exFactoryDate+"</p><p>"+event.details.customerPOorCOD+"</p>"
              //var aHtml = "<p>"+event.text+"</p><p>"+event.start_date+"</p><p>"+event.end_date+"</p>"
              return aHtml;
        };

    }
  }
})

.directive('dhxSchedulerReschedule', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template:'<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

    

    link:function ($scope, $element, $attrs, $controller){

      console.log($scope.sections);

       schedulerreschedule  = Scheduler.getSchedulerInstance();
      //default state of the scheduler

      //$scope.scheduler = { date : new Date(2017,00,16),mode:"timeline" };

      //schedulerreschedule.config.server_utc = true;

      schedulerreschedule.locale.labels.timeline_tab = "Timeline";
      schedulerreschedule.locale.labels.section_custom="Section";
     //schedulerreschedule.config.details_on_create=true;
      //schedulerreschedule.config.details_on_dblclick=true;
   //  schedulerreschedule.config.xml_date="%Y-%m-%d %H:%i";
        schedulerreschedule.config.start_date="%D-%M-%d-%Y %H:%i";
        schedulerreschedule.config.end_date="%D-%M-%d-%Y %H:%i";
      //schedulerreschedule.config.limit_time_select = true;

      schedulerreschedule.config.drag_resize= false;

      // scheduler height///////////
       schedulerreschedule.xy.bar_height =120;

      schedulerreschedule.templates.event_bar_text = function(start,end,event){
          console.log('event_bar_text');
          var aHtml = "<p>"+event.text+"</p><p>"+event.start_date.toLocaleDateString()+"</p><p>"+event.end_date.toLocaleDateString()+"</p>"
              return aHtml;
        };

      //schedulerreschedule.addMarkedTimespan({ start_date: new Date(2017,0,30,00,00), end_date: new Date(2017,0,30,23,00), css: "holiday_timespan" });
      

      //var format=schedulerreschedule.date.date_to_str("%Y-%m-%d %H:%i"); 
      // schedulerreschedule.templates.tooltip_text = function(start,end,event) {
      //   console.log('tooo');
      //     // return "<b>Event:</b> "+event.text+"<br/><b>Start date:</b> "+
      //     // format(start)+"<br/><b>End date:</b> "+format(end);
      //     return "aaa";
      // };
    

      //===============
      /*$scope.sections=[
        {key:1, label:"M-1"},
        {key:2, label:"M-2"},
        {key:3, label:"M-3"},
        {key:4, label:"M-4"},
        {key:5, label:"M-5"},
        {key:6, label:"M-6"},
        {key:7, label:"M-7"},
        {key:8, label:"M-8"},
        {key:9, label:"M-9"}
      ];*/
      
schedulerreschedule.createTimelineView({
        name: "timeline",
        x_unit: "day",
        x_date: "%d",
        x_step: 1,
        x_size: 7,
        y_unit: $scope.sections,
        y_property: "section_id",
        render:"bar"
      });

schedulerreschedule.attachEvent("onEventLoading", function(ev){
  //EVENT triggerred after each event load on scheduler . So we need to color overloaded events in red . 
 // console.log(ev);
 /* var machineEventsDraft_get=JSON.parse(localStorage['machineEventsDraft']);
 //  console.log(ev.workcenterID);
  var machineEventsDraft=machineEventsDraft_get[ev.workcenterID];
 // console.log(machineEventsDraft);
  var machineeventLength=0;
  console.log(machineEventsDraft)
      for (var key in machineEventsDraft) 
      {
            if (key.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i))
               {
                    machineeventLength++;
               }

      }
    onEventLoadingCount++;
  console.log(machineeventLength);
    if(onEventLoadingCount==machineeventLength*2)
    {
      console.log('ELENGTH EQAUL')
     setTimeout(checkoverloadOnSchedulerEventLoad,500);
    }*/
    //alert('onEventLoading')
        return true;
});

test=function()
{
  alert('called test')
  schedulerreschedule.updateView();
}


/*scheduler.attachEvent("onBeforeEventDragOut", function (id, ev, e){
    //any custom logic here
    alert('onBeforeEventDragOut');
    return true;
});*/

/*schedulerreschedule.attachEvent("onAfterSchedulerResize", function(){
          //any custom logic here
          console.log('onAfterSchedulerResize0');
          return false;
    });

schedulerreschedule.attachEvent("onBeforeExpand",function(){
    //any custom logic here
    console.log('onBeforeExpand')
    return false;
});

schedulerreschedule.attachEvent("onBeforeCollapse",function(){
    //any custom logic here
    console.log('onBeforeCollapse');
    alert('onBeforeCollapse')
    return true;
});

schedulerreschedule.attachEvent("onEventCollision", function (ev, evs){
    //any custom logic here
    alert('onEventCollision');
    console.log('onEventCollision');
    return false;
});


schedulerreschedule.attachEvent("onBeforeDrag", function (id, mode, e){
    //any custom logic here
    alert('onBeforeDrag');
    console.log(id);
    return true;
});*/


////////////////////////////CREATE NEW EVENTS IN SCHEDULER///////////////////////////////////////////////////////
/*schedulerreschedule.attachEvent("onEmptyClick", function (date, e){
  alert(date);
 // schedulerreschedule.addEvent();

//  schedulerreschedule.addEventNow({
//     start_date: new Date(2017,1,16,8,30),
//     end_date:   new Date(2017,1,16,10,30),
//     text:   "Meeting",
//     holder: "John", //userdata
//     room:   "5"     //userdata
// });

  //schedulerreschedule.addEventNow();
       //any custom logic here
});*/

/*schedulerreschedule.attachEvent("onCellDblClick", function (x_ind, y_ind, x_val, y_val, e){
    //any custom logic here
    alert(x_ind)
});*/


/*schedulerreschedule.config.lightbox.sections=[
    {name:"description", height:200, map_to:"text", type:"textarea" , focus:true},
    {name:"time", height:72, type:"time"}
];*/
////////////////////////////////////////////////////////////////////////////


schedulerreschedule.attachEvent("onClick", function(id,e){

  console.log(schedulerreschedule.getEvent(id));

     //alert('HAIII')
       //console.log($scope.eventsReschedule);  
     var events_temp=[];
     angular.copy(eventsForHistory,events_temp);
     HistoryObj.push({"workcenterID" :$scope.eventsReschedule[0].workcenterID,"events" :events_temp });
     console.log(HistoryObj);

      var eventdetails=schedulerreschedule.getEvent(id);
      console.log(eventdetails);
       var masterTicketID=  schedulerreschedule.getEvent(id).masterTicketID;
       var type= schedulerreschedule.getEvent(id).type;
        if(masterTicketID!=$scope.masterTicketID)
        {
          alert('different JOborder')
            $scope.masterTicketID=masterTicketID;
         //   $scope.tasks =[];
            
            getGanttDisplayStuff(masterTicketID,schedulerreschedule.getEvent(id).processTicketID);

            //schedulerScopeLoad(schedulerreschedule.getEvent(id).processTicketID);
              // $scope.sections.length=0;
               //schedulerreschedule.clearAll();
        }
        else
        {
          alert('same joborder');

        }

 });

/*schedulerreschedule.attachEvent("onBeforeEventCreated", function (e){
  alert('createdd');
    //any custom logic here
    return true;
});*/


/*schedulerreschedule.attachEvent("onBeforeEventChanged", function(ev, e, is_new, original){
return true;
});*/
schedulerreschedule.attachEvent("onEventSave",function(id,ev,is_new){
  //alert('evvvv');

  endDate=calcualteEndDate(ev.start_date,parseInt(durationData),machineDetails.id);
          startDate=ev.start_date;
          ev.end_date=endDate;

  createmachineCalendar(id,ev,is_new);
  return true;
});


////////////////////////////////////
schedulerreschedule.attachEvent("onContextMenu", function (id, e){
    //PROCESS MOVE TO ANOTHER MACHINE CODE DONE HERE B
    if(id!=null  )
    {
      schedulerDetails=schedulerreschedule.getEvent(id);
      console.log(schedulerDetails)
      console.log(id)
      if(!schedulerDetails.readonly)
      {
         localStorage.removeItem('machineEventsDraft');
         MoveToNewMachineDialogOpen(e)
      }
     
    }
     


    // schedulerreschedule.getEvent(id).text="endDateData";
     // schedulerreschedule.updateEvent(id);

    // newFunction=function()
    /*function newFunction()
    {
      alert('aaa');
      schedulerreschedule.getEvent(id).text="endDateData";
      schedulerreschedule.updateEvent(id);
    }*/
});

/*incrementEndDate=function(incrementEventData,currentendDate)
{
  console.log(incrementEventData);
  console.log(schedulerreschedule.getEvent(incrementEventData.id));
  console.log(schedulerreschedule.getEvent(incrementEventData.id).end_date);
  console.log(currentendDate);
  console.log(new Date(currentendDate));
  var datevar=new Date(currentendDate);
  var eventId=incrementEventData.id;
  endDateData=currentendDate;

  //newFunction();
  //schedulerreschedule.getEvent(incrementEventData.id).end_date="Tue Mar 08 2017 00:00:00 GMT+0530 (India Standard Time)";
 // schedulerreschedule.getEvent(incrementEventData.id).end_date=datevar;
  // schedulerreschedule.getEvent(eventId).text="aa";
  // schedulerreschedule.updateEvent(eventId);
  //schedulerreschedule.updateTask(ev.processTicketID);

}*/





durationData=1;
var eventData;


schedulerreschedule.form_blocks["my_editor"] = {
        render:function(sns) {
          return "<div class='dhx_cal_ltext' style='height:60px;'>Text&nbsp;<input type='text'><br/>Duration&nbsp;<input type='text'></div>";
        },
        set_value:function(node, value, ev) {
          console.log(node);
          console.log(ev);
          console.log(value);
          node.childNodes[1].value = value || "";
          // node.childNodes[4].value = ev.details || "";
          node.childNodes[4].value = durationData || "";
          eventData=ev;
        },
        get_value:function(node, ev) {
          durationData=node.childNodes[4].value

          return node.childNodes[1].value;
        },
        focus:function(node) {
          var a = node.childNodes[1];
          a.select();
          a.focus();
        }
      };
      

      schedulerreschedule.config.lightbox.sections = [
        //{ name:"description", height:200, map_to:"text", type:"my_editor" , focus:true,default_value:"abc"},
         //{ name:"time", height:72, type:"time", map_to:"auto", type:"editor" }
         { name:"description", height:200, type:"my_editor" , focus:true,default_value:"abc"}
        //{ name:"time", height:72, type:"time", map_to:"auto"}
      ];

       /*schedulerreschedule.attachEvent("onBeforeLightbox", function (id){
          //any custom logic here
          alert(id);
          console.log(id);
          //scheduler1.resetLightbox();
         console.log( schedulerreschedule.getEvent(id));

         // scheduler1.resetLightbox();
          console.log( schedulerreschedule.getEvent(id));

          var ev = schedulerreschedule.getEvent(id);

          console.log(durationData);
          console.log('durationData');

          endDate=calcualteEndDate(ev.start_date,parseInt(durationData),machineDetails.id);
          console.log(endDate);

          startDate=ev.start_date;

          //var time1= new Date(2017,01,23);
          ev.end_date=endDate;
          //console.log(time1);

           //var time = scheduler1.formSection('time');
           //time.setValue(null,{start_date:new Date(2017,01,17),end_date:new Date(2017,01,19)});

           // var descr = scheduler1.formSection('description');
           //  descr.setValue('abc');

          return true;
      });*/








schedulerreschedule.attachEvent("onBeforeEventChanged", function(ev, e, is_new, original){
//schedulerreschedule.attachEvent("onBeforeEventChanged", function(ev, e, is_new, original){
  console.log('onBeforeEventChanged');

 // alert('onBeforeEventChanged');
  console.log(ev);
  console.log(e);
  console.log(original)
 // alert(ev.type)
  //alert($scope.masterTicketID)
   if(e.type=="dblclick")
  {
    //var sectionKey=schedulerreschedule.matrix[schedulerreschedule._mode].y_unit[ev.section_id].key; 
    machineDetails=schedulerreschedule.matrix[schedulerreschedule._mode].y_unit[ev.section_id-1].details;
    console.log(machineDetails);
    return true;
  }
  else
  {
    var fromDate=new Date(original.start_date);
        var toDate=ev.start_date;
        var startDateTemp=ev.startdate_temp;
        startDateTemp.setHours(0,0,0,0);
        ev.end_date.setHours(0,0,0,0);
        console.log(toDate)
        toDate.setHours(0,0,0,0);
          console.log(toDate)
          console.log(fromDate)
          //IF MOVE FROM WEEKEND to DAYS IN NEXT WEEK , WE CANNOT MOVE IT PROPERLY . SO WE JUST
          //EDITING TO DATE AS ITS NEXT DATE(WEEKEND DAY+1).THEN EVENT WILL AUTOMATICALLY
          //GO TO NEXT PAGE
          var state=schedulerreschedule.getState();
          console.log(state)
          if(fromDate.getDate()+1==state.max_date.getDate() && toDate.getDate()==fromDate.getDate())
          {
            alert("yes")
             toDate.setDate(toDate.getDate()+1)
          }
       
          console.log(toDate)
          var forblackout=new Date(ev.end_date);

         if(ev.blackout==true)
          {
            alert('You cant Move a BlackOut Day or Holiday event!!!');
            return false;
          }
          else
          {
          //PREVENT DRAGING AN EVENT TO PREVIOUS DATE THAN TODAY(DATES LESS THAN TODAY)
          if(toDate <new Date())
          {
             alert('You cant Move to a Previous Date!!!');
            return false;
          }
          else if(ev.readonly==true)
          {
          //  alert('HEREE');
           // $scope.masterTicketID=ev.masterTicketID;
            //schedule();
           // $scope.masterTicketID
           // alert("You Can only Reschedule events corressponding to the Selected ProcessTicket from current!!!");
            return false;
          }
          else if(ev.masterTicketID!=$scope.masterTicketID)
          {
          //  alert('HEREE');
           // $scope.masterTicketID=ev.masterTicketID;
            //schedule();
           // $scope.masterTicketID
            alert("You Can only Reschedule events corressponding to the Selected ProcessTicket from current!!!");
            return false;
          }
          else
          {
             console.log('elseeeee');
              var machineEventsDraft_frmlocals=JSON.parse(localStorage['machineEventsDraft']);
                   machineEventsDraft_samples =machineEventsDraft_frmlocals[$scope.eventsReschedule[0].workcenterID];

             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              /////////CHECK WHETHER DRAGGED TO DATE IS BLACK OUT OR HOLIDAY FOR THAT MACHINE/////
              /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         
                ////rinsha

                /*console.log(machineEventsDraft_samples);
                console.log(machineEventsDraft_samples[ev.machineid]);
                console.log(machineEventsDraft_samples[ev.machineid][ev.machinecalendarID]);
                var eventData=machineEventsDraft_samples[ev.machineid][ev.machinecalendarID];

                console.log(ev);
                console.log(toDate);

                endDate=calcualteEndDate(ev.start_date,eventData.durationData,ev.machineid);
                console.log(endDate);
                 ev.end_date=endDate;*/

                 //rinsha



              var statusblackoutholiday =checkblackoutorholiday(toDate,machineEventsDraft_samples,ev.machineid);
              console.log(statusblackoutholiday);

          //checkblackoutorholiday(toDate,ev.machineid,function(status)
          //{
            if(!statusblackoutholiday)
            {


                  console.log(machineEventsDraft_samples[ev.machineid][ev.machinecalendarID]);
                  var eventData=machineEventsDraft_samples[ev.machineid][ev.machinecalendarID];

                  endDate=calcualteEndDate(ev.start_date,eventData.durationData,ev.machineid);
                  console.log(endDate);
                 // endDate.setHours(24,0,0,0);
                   ev.end_date=endDate;


             var checkPredecessorCompletedStatus=checkPredecessorStatus(new Date(toDate),new Date(startDateTemp));
          //  checkPredecessorCompletedStatus=true;
             if(checkPredecessorCompletedStatus)
             {



               console.log(checkPredecessorCompletedStatus);
              //PROCEED
                //var ev_date= new Date(ev.start_date);
                console.log(ev);
                var ev_date= new Date(ev.start_date);
                var ev_end= new Date(ev.end_date);
                console.log(ev_end);
               //var ev_end= ev.end_date;
                var machineEventsDraft=JSON.parse(localStorage['machineEventsDraft']);
                if(machineEventsDraft[$scope.eventsReschedule[0].workcenterID]!=undefined)
                {
                  console.log(ev);
                  //updating machine calendar event date inside machine calendar draft copy and setting the localstorage data with latest value
                  //machineEventsDraft[$scope.eventsReschedule[0].workcenterID][ev.machineid][ev.machinecalendarID].date= ev_date+"T00:00:00.000Z";
                  machineEventsDraft[$scope.eventsReschedule[0].workcenterID][ev.machineid][ev.machinecalendarID].date= ev.start_date;

                  console.log(machineEventsDraft[$scope.eventsReschedule[0].workcenterID]);
                  localStorage['machineEventsDraft']=JSON.stringify(machineEventsDraft);
                  /////////////////////////////////////////////////////////////////////////
                  var eventdetails=schedulerreschedule.getEvent(ev.id);
                     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                   ////////////////////////////////////////////////////////////////////////////////////////////////////
                   //pushing machine calendar id ,chnaged date in to another array to track chnages done only
                   //UPDATED EVENTS CHNAGES ONLY//////////////////////////
                   console.log('TRACKED CHANGES ONLY//////////////////////////')

                  // var mctrackobj = setAnAttributeValueOnObject_FromFilter_ByKeyValuePair(machineCalendar_TrackChanges_Obj,"id",eventdetails.machinecalendarID,"date",ev_date+"T00:00:00.000Z")
                   var mctrackobj = setAnAttributeValueOnObject_FromFilter_ByKeyValuePair(machineCalendar_TrackChanges_Obj,"id",eventdetails.machinecalendarID,"date",ev_date,"endDate",ev_end)
                   if(mctrackobj==false)
                   {
                     //machineCalendar_TrackChanges_Obj.push({"id" : eventdetails.machinecalendarID ,"date" :ev_date+"T00:00:00.000Z","processTicketID" :eventdetails.processTicketID,"masterTicketID":eventdetails.masterTicketID  });
                      machineCalendar_TrackChanges_Obj.push({"id" : eventdetails.machinecalendarID ,"date" :ev_date,"processTicketID" :eventdetails.processTicketID,"masterTicketID":eventdetails.masterTicketID,"endDate":ev_end  });
                   }
                   else
                   {
                    machineCalendar_TrackChanges_Obj=mctrackobj;
                   }
                   console.log(machineCalendar_TrackChanges_Obj);
                   //push processticket id into processTicket_TrackChanges_Obj .processtickets should be unique(never repeat processTicketID)
                   var processTickettrackObj=setAnAttributeValueOnObject_FromFilter_ByKeyValuePair(processTicket_TrackChanges_Obj,"id",eventdetails.processTicketID,"id",eventdetails.processTicketID)
                   if(processTickettrackObj==false)
                   {
                     processTicket_TrackChanges_Obj.push({"id" : eventdetails.processTicketID });
                   }
                   else
                   {
                     processTicket_TrackChanges_Obj=processTickettrackObj;
                   }
                   console.log(processTicket_TrackChanges_Obj);
                   //push masterticket id into masterTicket_TrackChanges_Obj .masterticket should be unique(never repeat masterTicketID)
                   
                   var masterTickettrackObj=setAnAttributeValueOnObject_FromFilter_ByKeyValuePair(masterTicket_TrackChanges_Obj,"id",eventdetails.masterTicketID,"id",eventdetails.masterTicketID)
                   if(masterTickettrackObj==false)
                   {
                     masterTicket_TrackChanges_Obj.push({"id" : eventdetails.masterTicketID });
                   }
                   else
                   {
                     masterTicket_TrackChanges_Obj=masterTickettrackObj;
                   }
                   console.log(masterTicket_TrackChanges_Obj);
                   console.log(machineEventsDraft);
                   /////////////////////////////////////////////////////////////////////////////////////////////////
                   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                 //////////////////////////////////////////////////////////////////////////////////////////////////
                 //CHECK MACHINE OVERLOAD ON MACHINE EVENTS DRAGGING & CHNAGE THE EVENT COLOR TO RED
                 console.log('before checkoverloadOnEventDrag');
                 checkoverloadOnEventDrag($scope.eventsReschedule[0].workcenterID,ev_date,ev,fromDate);
                 /////////////////////////////////////////////////////////////////////////////////////////////////

                  ///////////////////////////////////////////////////////////////////////////////////////////////
                  //GETTING PROCESS START,END DATED AS PER LATEST CHANGES BY SORTING MACHINE CALENDAR ARRAY
                  //var machineCalendarToSort=[];
                 // angular.copy(machinecalendarObj_copy.data[machineIndex].machinecalendar, machineCalendarToSort);
                  //var dateObj= getProcessStartEndDate(machineCalendarToSort);
                   var machineEventsDraft_frmlocal=JSON.parse(localStorage['machineEventsDraft']);
                   machineEventsDraft_sample =machineEventsDraft_frmlocal[$scope.eventsReschedule[0].workcenterID];
                   var dateObj= getProcessStartEndDate(machineEventsDraft_sample[ev.machineid],ev.processTicketID);
                   console.log(dateObj)

              


                  ////////////////////////////////////////////////////////////////////////////////////////////////

                  ///////////////////////////////////////////////////////////////////////////////////////////////
                  //UPADTING PROCESS START,END DATES AS PER LATEST CHANGES DONE (LATEST START DATE,END DATE )
                  //UPDATING INTO LOCALSTORAGE
                  //UPDATED IN DRAFT GANTT
                    var jobTreeDraft = JSON.parse(localStorage['jobTreeDraft']);
                    console.log(jobTreeDraft);
                    console.log($scope.masterTicketID)
                    console.log(ev.processTicketID)
                    var masterticketid=ev.masterTicketID;
                    
                    jobTreeDraft[masterticketid].processes[ev.processTicketID].actualstartdate=dateObj[0];
                    jobTreeDraft[masterticketid].processes[ev.processTicketID].actualenddate=dateObj[1];
                    localStorage['jobTreeDraft']=JSON.stringify(jobTreeDraft);


                  if(masterticketid==$scope.masterTicketID)
                  {
                    gantt.getTask(ev.processTicketID).start_date= ev_date;  
                    gantt.getTask(ev.processTicketID).end_date=ev_end;

                    /*gantt.getTask(ev.processTicketID).start_date= new Date(jobTreeDraft[$scope.masterTicketID].processes[ev.processTicketID].actualstartdate);  
                    gantt.getTask(ev.processTicketID).end_date=new Date(jobTreeDraft[$scope.masterTicketID].processes[ev.processTicketID].actualenddate);*/
                    console.log(gantt.getTask(ev.processTicketID));
                    gantt.updateTask(ev.processTicketID);
                  }

                  ////////////////////////////////////////////////////////////////////////////////////////////////
                  

                  ///////////////////////////////////////////////////////////////////////////////////////////////
                  //UPDATING FACTORY OUTDATE MISSSED PROCESS TICKETS COLOR INTO RED
                  //
                      
                    var obj= CheckProcessFactoryOutdatedOnDrag(ev.processTicketID);
                    console.log(obj);
                            //  for(var i=0;i<obj.length;i++)
                            //  {
                            //  // console.log(processIndex_array);
                            //    // var index_=processIndex_array[obj[i].id];
                            //     //console.log('index_');
                            //   //  console.log(index_);
                            //     if(obj[i].status==true)
                            //     {
                            //        gantt.getTask(obj[i].id).color= errorColor;  
                            //        gantt.updateTask(obj[i].id);
                            //     }
                            //     else
                            //     {
                            //        gantt.getTask(obj[i].id).color=ganttErrorFreeColor;  
                            //        gantt.updateTask(obj[i].id);
                            //     }
                            // }     
                  ////////////////////////////////////////////////////////////////////////////////////////////////
                  

                  return true;

                }

             }////////////////////////sik
             else
             {
               alert('You cant move to previous date!! predecessor process not completed yet!!!')
               return false;
             }//else
           }
           else
           {
             alert('cannot move to a holiday or blackout day')
              return false;
           }  
         //});//callback end

        }//else

      }//blackout else
  }
    


});







      if (!$scope.schedulerreschedule)
        $scope.schedulerreschedule = {};
      $scope.schedulerreschedule.mode = "timeline";
      //$scope.schedulerreschedule.mode = $scope.schedulerreschedule.mode || "month";
      $scope.schedulerreschedule.date = $scope.schedulerreschedule.date || new Date();

      //watch data collection, reload on changes
      $scope.$watch($attrs.data, function(collection){
        schedulerreschedule.clearAll();
        schedulerreschedule.parse(collection, "json");
      }, true);

      //mode or date
      $scope.$watch(function(){
        return $scope.schedulerreschedule.mode + $scope.schedulerreschedule.date.toString();
      }, function(nv, ov) {
        var mode = schedulerreschedule.getState();
        if (nv.date != mode.date || nv.mode != mode.mode)
          schedulerreschedule.setCurrentView($scope.schedulerreschedule.date, $scope.schedulerreschedule.mode);
      }, true);

      //size of scheduler
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        schedulerreschedule.setCurrentView();
      });

      //prasad
       $scope.$watch(function() {
                 return $scope.eventsReschedule;
               }, function() {
                 console.log('About to change view')
                 schedulerreschedule.updateView();
               });


      //styling for dhtmlx scheduler
      $element.addClass("dhx_cal_container");

      //init scheduler
      schedulerreschedule.init($element[0], $scope.schedulerreschedule.date, $scope.schedulerreschedule.mode);
    }
  }
})



//.directive('dhxScheduler2', function($mdDialog) {
.directive('dhxSchedulerSchedule', function(sharedProperties) {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template:'<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

    

    link:function ($scope, $element, $attrs, $controller){
      //default state of the scheduler
      var scheduler1  = Scheduler.getSchedulerInstance();


///////////////////////////////////////////////////////////////////////////////
      scheduler1.locale.labels.timeline_tab = "Timeline";
      scheduler1.locale.labels.section_custom="Section";
      scheduler1.config.details_on_create=true;
      scheduler1.config.details_on_dblclick=true;
      
      ///scheduler1.config.xml_date="%Y-%m-%d %H:%i";
       /*scheduler1.config.start_date="%Y-%m-%d %H:%i";
        scheduler1.config.end_date="%Y-%m-%d %H:%i";*/

        scheduler1.config.start_date="%D-%M-%d-%Y %H:%i";
        scheduler1.config.end_date="%D-%M-%d-%Y %H:%i";

      //scheduler1.config.limit_time_select = true;

      scheduler1.config.drag_resize= false;

      // scheduler1.config.server_utc = true;

      //scheduler1.config.collision_limit = 5;  


      // scheduler heightt

      scheduler1.xy.bar_height =120;

      scheduler1.templates.event_bar_text = function(start,end,event){
          console.log('event_bar_text');
          var aHtml = "<p>"+event.text+"</p><p>"+event.start_date.toLocaleDateString()+"</p><p>"+event.end_date.toLocaleDateString()+"</p>"
              return aHtml;
        };

      /*scheduler1.TimeSpans.Add(new DHXBlockTime()
      {
            Day = DayOfWeek.Sunday //blocks each Sunday
      });*/

      //===============
      /*$scope.sections2=[
        {key:1, label:"M-1"},
        {key:2, label:"M-2"},
        {key:3, label:"M-3"},
        {key:4, label:"M-4"},
        {key:5, label:"M-5"},
        {key:6, label:"M-6"},
        {key:7, label:"M-7"},
        {key:8, label:"M-8"},
        {key:9, label:"M-9"}
      ];*/

      console.log('$scope.sections  appppppppppppppppp');
      console.log($scope.sections);


   scheduler1.createTimelineView({
        name: "timeline",
        x_unit: "day",
        x_date: "%d",
        x_step: 1,
        x_size: 7,
        y_unit: $scope.sections2,
        y_property: "section_id",
        render:"bar"
      });


   //marks and blocks dates
    /*scheduler1.addMarkedTimespan({  
        days:  0,
        zones: "fullday",
        css:   "holiday_timespan",
        type:  "dhx_time_block" //the hardcoded value
    });*/



   /* scheduler1.markTimespan({
      start_date: new Date(yyyy,mm,dd),
      end_date:new Date(yyyy,mm,parseInt(dd)+1) ,
      css: "highlighted_timespan",
      sections: {
             timeline: sectionKey
        }
    });//markTimespan*/


   /*scheduler1.addMarkedTimespan({  
        days:  0,               // marks each sunday
        zones: "fullday",       // marks the entire day
        css:   "holiday_timespan"   // the name of applied CSS class
    });*/


  /* scheduler1.attachEvent("onEventCollision", function (ev, evs){
        //any custom logic here
        return false;
    });*/

/*scheduler1.attachEvent("onAfterSchedulerResize", function(){
          //any custom logic here
          console.log('onAfterSchedulerResize0');
          return false;
    });*/

/*scheduler1.attachEvent("onBeforeExpand",function(){
    //any custom logic here
    console.log('onBeforeExpand')
    return false;
});*/

scheduler1.attachEvent("onBeforeEventChanged", function(ev, e, is_new, original){
    console.log(ev);
    if(ev.machinecalendarID != undefined)
    {
      alert('ppp');
      return false;
    }
    return true;
    
});


scheduler1.attachEvent("onEventSave",function(id,ev,is_new){
  //alert('evvvv');
  console.log(ev);
  endDate=sharedProperties.calcualteEndDate(ev.start_date,parseInt(durationData),machineDetails.id);
          startDate=ev.start_date;
          ev.end_date=endDate;

          var r = confirm("are you sure you want to save??");
                        if (r == true) {
                            //createmachineCalendar(id,ev,is_new); calendarevent is created on Save Click.
                            return true;
                        } else {
                            console.log("You pressed Cancel!");
                            return false;
                        }

  
  
});


durationData=1;
var eventData;


scheduler1.form_blocks["my_editor"] = {
        render:function(sns) {
          return "<div class='dhx_cal_ltext' style='height:60px;'>ProcessName&nbsp;<input type='text'><br/>Duration&nbsp;<input type='text'></div>";
        },
        set_value:function(node, value, ev) {
          console.log(node);
          console.log(ev);
          console.log(value);
          node.childNodes[1].value = value || "";
          // node.childNodes[4].value = ev.details || "";
          node.childNodes[4].value = durationData || "";
          eventData=ev;
        },
        get_value:function(node, ev) {
          durationData=node.childNodes[4].value;
          return node.childNodes[1].value;
        /*  console.log(ev);
          console.log(node);
          */
        },
        focus:function(node) {
          var a = node.childNodes[1];
          a.select();
          a.focus();
        }
      };

      // var time = scheduler1.formSection('time');
      //     time.setValue(null,{start_date:new Date(2017,01,17),end_date:new Date(2017,01,19)}); 


      /*scheduler1.form_blocks["editor"] = {
        render:function(sns) {
          return "<div class='dhx_cal_ltext' style='height:60px;'>Start Date&nbsp;<input type='text'><br/>End Date&nbsp;<input type='text'></div>";
        },
        set_value:function(node, value, ev) {
          console.log(node);
          console.log(ev);
          console.log(value);
          node.childNodes[1].value = value || "";
          // node.childNodes[4].value = ev.details || "";
          node.childNodes[4].value = durationData || "";
          eventData=ev;
        },
        get_value:function(node, ev) {
          console.log('get_value edddddd');
          console.log(ev);
          console.log(node);
         // ev.details = node.childNodes[4].value;
          // console.log(ev);
          // console.log(node);
          // console.log(eventData);

          // console.log(sectionDetails);

          // endDate=calcualteEndDate(eventData.start_date,durationData,sectionDetails.id);
          // console.log(endDate);
          // console.log(scheduler1.getEvent(eventData.id));

          // scheduler1.getEvent(eventData.id).text = "Conference"; //changes event's data
          // //renders the updated event

          // eventData.end_date=endDate;
          // ev.end_date=endDate;
          // console.log(scheduler1.getEvent(eventData.id));
          //  scheduler1.updateEvent(eventData.id);
          //  scheduler1.updateView();

           console.log(node.childNodes);

         


          return node.childNodes[1].value;
        },
        focus:function(node) {
          var a = node.childNodes[1];
          a.select();
          a.focus();
        }
      };*/

      scheduler1.config.buttons_right=[];

     /* scheduler1.form_blocks.my_editor.set_value=function(node,value,ev){
        node.firstChild.value=value||"";
        var style = ev.some_property?"":"none";
        node.style.display=style; // editor area
        node.previousSibling.style.display=style; //section header
        scheduler1.setLightboxSize(); //correct size of lightbox

    }*/

      

      

      scheduler1.config.lightbox.sections = [
       { name:"description", height:200, type:"my_editor" , focus:true,default_value:processName}
        //{ name:"description", height:200, map_to:"text", type:"my_editor" , focus:true,default_value:"abc"},
         //{ name:"time", height:72, type:"time", map_to:"auto", type:"editor" }
        /* { name:"description", height:200, type:"my_editor" , focus:true,default_value:"abc"},
         { name:"time", height:72, type:"time", map_to:"auto"}*/
      ];

       scheduler1.attachEvent("onBeforeLightbox", function (id){
          //any custom logic here
          alert(id);
          console.log(id);
          //scheduler1.resetLightbox();
         console.log( scheduler1.getEvent(id));

         // scheduler1.resetLightbox();
          console.log( scheduler1.getEvent(id));

          var ev = scheduler1.getEvent(id);

          console.log(ev);

          endDate=sharedProperties.calcualteEndDate(ev.start_date,parseInt(durationData),sectionDetails.id);
          console.log(endDate);

          startDate=ev.start_date;

          //var time1= new Date(2017,01,23);
          ev.end_date=endDate;

          console.log(ev)
          //console.log(time1);

           //var time = scheduler1.formSection('time');
           //time.setValue(null,{start_date:new Date(2017,01,17),end_date:new Date(2017,01,19)});

           // var descr = scheduler1.formSection('description');
           //  descr.setValue('abc');

          return true;
      });



var html = function(id) { return document.getElementById(id); }; //just a helper

/*scheduler1.showLightbox = function(id) {

  //console.log(html.style);

      var ev = scheduler1.getEvent(id);
      scheduler1.startLightbox(id, html("my_form"));

      html("description").focus();
      html("description").value = ev.text;
      console.log(durationData);
       html("duration").value = durationData;
      //html("custom1").value = ev.custom1 || "";
      //html("custom2").value = ev.custom2 || "";
    };

    // function save_form() {
    save_form=function(){
      var ev = scheduler1.getEvent(scheduler1.getState().lightbox_id);
      console.log(ev);
      console.log(durationData);
      console.log(sectionDetails);

       endDate=calcualteEndDate(ev.start_date,durationData,sectionDetails.id);
      console.log(endDate);
      startDate=ev.start_date;
      ev.text = html("description").value;
      ev.end_date=endDate;



      //ev.custom1 = html("custom1").value;
      //ev.custom2 = html("custom2").value;

      scheduler1.endLightbox(true, html("my_form"));
    }
    // function close_form() {

      close_form=function(){
      scheduler1.endLightbox(false, html("my_form"));
    }*/



  /* scheduler1.attachEvent("onEventSave",function(id,ev,is_new){
     // alert('evvvv');
      //createmachineCalendar(id,ev,is_new);
      alert(id)
      console.log(ev);
      console.log(is_new);

      // scheduler1.getEvent(eventID).text = "Conference"; //changes event's data
      // scheduler1.updateEvent(eventID);
      
      return true;
    });*/


   /*createScheduler=function(startDate,endDate)
   {
    console.log('createScheduler');
    alert('createScheduler');

    //scheduler1.addEventNow();

   

      

   var idd= scheduler1.addEvent({
        start_date: new Date(2017,1,10,8,30),
        end_date:   new Date(2017,1,18,10,30),
        text:   "Meeting"
        //holder: "John", //userdata
        //room:   "5"     //userdata
    });
   console.log(idd);
   console.log(scheduler1.getEvent(idd))

    // scheduler1.addEvent({
    //       start_date: "16-01-2017 00:00",
    //       end_date:   "16-01-2017 20:00",
    //       text:   "Meeting",
    //       holder: "John", //userdata
    //       room:   "5"     //userdata
    //   });
   }
*/
    //marked = null;
      markedArray=[];
       arrayCheck=[];
       sectionDetails=null;

       machineDetails=[];
       markedMachine=[];
       machineDetailsArray=[];




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*******************************MARK ,UNMARK CELLS TO SCHEDULE JOBORDER BY THE PLANNER************************************
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      markedArrayNew=[];
        dateMarkArray=[];
        machineArray=[];

       markFunction=function(date,sectionKey,sectionLabel,sectionDetails)
       {
          var item=new Date(date);
          var today = new Date(date);
          var dd = today.getDate();
          var mm = today.getMonth(); //January is 0!
          var yyyy = today.getFullYear();

          var marked = scheduler1.markTimespan({
                      start_date: new Date(yyyy,mm,dd),
                      end_date:new Date(yyyy,mm,parseInt(dd)+1) ,
                      css: "highlighted_timespan",
                      sections: {
                             timeline: sectionKey
                        }
                    });//markTimespan
           dateMarkArray= [{date : item , marked : marked ,details :sectionDetails}];


             var markedDetails=machineArray[sectionDetails.id];
                      if(markedDetails!=undefined)
                       {
                        markedDetails=markedDetails.concat(dateMarkArray);
                       }
                       else
                       {
                        markedDetails=dateMarkArray;
                       }
                       machineArray[sectionDetails.id]=markedDetails;
                       console.log(machineArray);
                       console.log(machineArray[sectionDetails.id]);


           return marked;
       }
       unmarkFunction=function(marked)
       {
          scheduler1.unmarkTimespan(marked)
       }


       checkClikedCellMachineAccessebility=function(machineID,type)
       {
          var size = Object.keys(machineArray).length;
          var count=0;
          for(var key in machineArray)
          {
            console.log(key);
            count++;
            if(machineID!=key && machineArray[key][0].details.type==type)
            {
              return key;
            }
            else if(machineID!=key && machineArray[key][0].details.type=="normal" && type=="External")
            {
              return key;
            }
            else if(machineID!=key && machineArray[key][0].details.type=="External" && type=="normal")
            {
              return key;
            }
            if(size==count)
            {
              return false;
            }
          }
          if(size==0)
          {
            return false;
          }

       }

    

       checkdateAlreadyChecked=function(date,machineID)
       {
          var data =machineArray[machineID];
          if(data==undefined)
          {
            return {"status":true , "date" :"" , "marked" : ""};
          }
          else if(data.length==0)
          {
            return {"status":true , "date" :"" , "marked" : ""};
          }
          else
          {
            var size = Object.keys(data).length;
            for(var i=0;i<size;i++)
            {
              var date_=new Date(date);
              if(data[i].date==date_)
              {
                var marked=data[i].marked;
                var datenew="";
                machineArray[machineID].splice(i,1);
                return  {"status":false , "date" :datenew , "marked" : marked};
              }
              if(i==size-1)
              {
                return {"status":true , "date" :"" , "marked" : ""};
              }
            }
          }
       }


       unmarkMultiples=function(key)
       {
            var arr=machineArray[key];
            for(var i=0;i<arr.length;i++)
            {
               scheduler1.unmarkTimespan(arr[i].marked);
               if(arr.length-1==i)
               {                
                  delete machineArray[key];
               }
            }
            
       }


      //processQuantity=null;

 scheduler1.attachEvent("onCellClick", function (x_ind, y_ind, x_val, y_val, e){

      if($scope.movemachine)
      {
      //  alert('here')
        return false;
      }
      else
      {
      console.log(x_val);

   /*scheduler1.dblclick_dhx_matrix_cell(e);*/
   sectionDetails=scheduler1.matrix[scheduler1._mode].y_unit[y_ind].details;
   console.log(sectionDetails);
   console.log(sectionDetails.capacity);
   console.log(processQuantity);

   if(sectionDetails.type=="stores")
   {
      durationData=1;
   }
   else
   {
     durationData=(parseInt(processQuantity))/(parseInt(sectionDetails.capacity));
     console.log(durationData);
   }

   scheduler1.dblclick_dhx_matrix_cell(e);


  ////////////////////////////////
     

     console.log(e)
            var sectionKey=scheduler1.matrix[scheduler1._mode].y_unit[y_ind].key; 
            var sectionLabel=scheduler1.matrix[scheduler1._mode].y_unit[y_ind].label;
            sectionDetails=scheduler1.matrix[scheduler1._mode].y_unit[y_ind].details;
            
            x_val=new Date(x_val);
           x_val=x_val.toISOString();

           var date=x_val;

            console.log(x_val);


           sharedProperties.checkblackoutorholidayforCellClick(date,sectionDetails.id,function(status)
            {
              console.log(status)
              if(!status)
              {

                console.log('date///////////////////');
                console.log(date);

               /* var item=new Date(date);
                item=item.toISOString();*/
                var item=x_val;

                //console.log(item.toISOString());

               // console.log(item.getUTCDate());

                //console.log(new Date(item.getUTCFullYear(), item.getUTCMonth(), item.getUTCDate(),  item.getUTCHours(), item.getUTCMinutes(), item.getUTCSeconds()))

                console.log('item////////////////////');
                console.log(item);

                 var key= checkClikedCellMachineAccessebility(sectionDetails.id,sectionDetails.type);
                 if(key==false)
                 {

                     var result= checkdateAlreadyChecked(x_val,sectionDetails.id);
                     if(result.status)
                     {
                       markFunction(x_val,sectionKey,sectionLabel,sectionDetails);             
                     }
                     else
                     {
                        unmarkFunction(result.marked);
                        var data=machineArray[sectionDetails.id];
                        var size = Object.keys(data).length;
                        if(size==0)
                        {
                          delete machineArray[sectionDetails.id];
                        }
                     }
                  }
                  else
                  {
                     unmarkMultiples(key);
                     markFunction(x_val,sectionKey,sectionLabel,sectionDetails);
                  }
                  console.log('finish');
                  //return true;
                }
                else
                {
                  alert('Cannot pick this Day.Its a Holiday/Blackout for this Machine');
                }
            })
          }
        });


 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//*******************************END OF MARK ,UNMARK CELLS TO SCHEDULE JOBORDER BY THE PLANNER************************************
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




     scheduler1.attachEvent("onCellClick1", function (x_ind, y_ind, x_val, y_val, e){
      console.log('onCellClick');

    //  var ar= [M1 : dates:[1,2,3]];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

       var cellflag=true;
       var checkFlag=true;

        var date=x_val;
        var sectionKey=scheduler1.matrix[scheduler1._mode].y_unit[y_ind].key; 
        var sectionLabel=scheduler1.matrix[scheduler1._mode].y_unit[y_ind].label;
         sectionDetails=scheduler1.matrix[scheduler1._mode].y_unit[y_ind].details;
         console.log(sectionDetails);

        //var item=x_val;
        var item=new Date(x_val);
        x_val=new Date(x_val);

        /////////////////unmark the field/////////////////////////////////////

        var idx = markedArray.indexOf(item);
        console.log(idx);

        console.log(markedMachine);


                console.log(machineDetailsArray);
                var idxmachine = machineDetailsArray.indexOf(sectionDetails);
                console.log('idxmachine');
                console.log(idxmachine);
                if(idxmachine > -1)
                {
                    console.log('same machine');
                    machineDetailsArray.splice( idxmachine , 1 );
                    console.log(sectionDetails);
                      for(var j=0;j<machineDetails.length;j++)
                      {
                        if((machineDetails[j].item==item) && (machineDetails[j].machine==sectionDetails))
                        {
                          console.log('unmark');
                          checkFlag=false;
                          scheduler1.unmarkTimespan(machineDetails[j].marked);
                          var dateinx=markedArray.indexOf(machineDetails[j].item);
                          markedArray.splice(dateinx, 1);
                          machineDetails.splice(j, 1);
                          
                        }
                      }
                }
                else
                {
                  console.log('diff ');
                  console.log(machineDetails);
                  for(var i=0;i<machineDetails.length;i++)
                  {
                      if(machineDetails[i].machine.type==sectionDetails.type)
                      {
                        console.log('same machine type');
                        var r = confirm("cant select 2 machine for a process !! Do you want to select??");
                        if (r == true) {
                            console.log("You pressed OK!");
                            cellflag=true;
                            console.log(sectionDetails);
                            console.log(arrayCheck);
                            for(var j=0;j<arrayCheck.length;j++)
                            {
                              if(arrayCheck[j].machine.type==sectionDetails.type)
                              {
                                console.log('unmarkcheck')
                                console.log(arrayCheck[j]);
                                scheduler1.unmarkTimespan(arrayCheck[j].marked)
                                machineDetailsArray.splice( idxmachine , 1 );
                                var dateinx=markedArray.indexOf(arrayCheck[j].item);
                                markedArray.splice(dateinx, 1);
                                machineDetails.splice(i, 1); 

                              }
                            }
                        } else {
                            console.log("You pressed Cancel!");
                            //cellflag=false;
                        }
                      }
                      else if(machineDetails[i].machine.type!=sectionDetails.type)
                      {
                          console.log('diff type');
                          console.log(machineDetails[i]);
                          console.log(sectionDetails)
                      }
                  }
                }

                                  var today = new Date(date);
                                  var dd = today.getDate();
                                  var mm = today.getMonth(); //January is 0!

                                  var yyyy = today.getFullYear();

                  console.log(x_val);
                  //var dateData=getBlackoutDaysOnDate(x_val);
                  var dateData=undefined;
                  console.log(dateData);
                  if((dateData==undefined) && (cellflag==true) && (checkFlag==true))
                  {
                    console.log('uuuuuu');
                    markedArray.push(item);
                    markedMachine.push({machine:sectionDetails,item:item});

                       marked = scheduler1.markTimespan({
                          start_date: new Date(yyyy,mm,dd),
                          end_date:new Date(yyyy,mm,parseInt(dd)+1) ,
                          css: "highlighted_timespan",
                          sections: {
                                 timeline: sectionKey
                            }
                        });//markTimespan
                       

                       arrayCheck.push({item:item,marked:marked,machine:sectionDetails});
                       machineDetails.push({machine:sectionDetails,item:item,marked:marked});
                       machineDetailsArray.push(sectionDetails);
                    //return true;
                  }//if undefined ends
                  else if(cellflag==false)
                  {
                    console.log('cellflag false');
                  }
                  else if(checkFlag==false)
                  {

                  }
                  else if((dateData.status=="blackout") || (dateData.status=="holiday"))
                  {
                    console.log('blackoutllllllllllllll');
                  }
           
                      console.log(markedArray);
                      console.log(arrayCheck);

                      //return false;
      });///empty cell click
//////////////////////////ends scheduler cell click/////////////////////////////
//scheduler.detachEvent(myEvent);


/////////////////////////////////////////////////////////////////////////////


      if (!$scope.scheduler1)
        $scope.scheduler1 = {};
     // $scope.scheduler1.mode = $scope.scheduler1.mode || "month";
     $scope.scheduler1.mode="timeline";
      $scope.scheduler1.date = $scope.scheduler1.date || new Date();

      //watch data collection, reload on changes
      $scope.$watch($attrs.data, function(collection){
        scheduler1.clearAll();
        scheduler1.parse(collection, "json");
      }, true);

      //mode or date
      $scope.$watch(function(){
        return $scope.scheduler1.mode + $scope.scheduler1.date.toString();
      }, function(nv, ov) {
        var mode = scheduler1.getState();
        if (nv.date != mode.date || nv.mode != mode.mode)
          scheduler1.setCurrentView($scope.scheduler1.date, $scope.scheduler1.mode);
      }, true);

      //size of scheduler
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        scheduler1.setCurrentView();
      });

      //Update View when row clicked from gantt,Prasad
               $scope.$watch(function() {

                 return $scope.eventsData;
               }, function() {
                alert("here")
                 console.log('About to change view')
                 scheduler1.updateView();
               });
               

      //styling for dhtmlx scheduler
      $element.addClass("dhx_cal_container");

      //init scheduler
      scheduler1.init($element[0], $scope.scheduler1.date, $scope.scheduler1.mode);
     // scheduler1.init($element[0], new Date(2017,00,16), "timeline");

      //$scope.scheduler = { date : new Date(2017,00,16),mode:"timeline" };

    }
  }
})


/////calendar view

.directive('dhxScheduler3', function() {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    template:'<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

    

    link:function ($scope, $element, $attrs, $controller){
      //default state of the scheduler
      var scheduler3  = Scheduler.getSchedulerInstance();

        scheduler3.config.xml_date="%Y-%m-%d %H:%i";
      scheduler3.config.container_autoresize = false;

      scheduler3.attachEvent("onBeforeDrag", function (id, mode, e){
            //any custom logic here
            return false;
        });

        scheduler3.attachEvent("onDblClick", function (id, e){
          console.log(id);
          window.location.href = '#/panelView/'+id;
           //any custom logic here
           return false;
        });




      if (!$scope.scheduler3)
        $scope.scheduler3 = {};
      $scope.scheduler3.mode = $scope.scheduler3.mode || "month";
      $scope.scheduler3.date = $scope.scheduler3.date || new Date();

      //watch data collection, reload on changes
      $scope.$watch($attrs.data, function(collection){
        scheduler3.clearAll();
        scheduler3.parse(collection, "json");
      }, true);

      //mode or date
      $scope.$watch(function(){
        return $scope.scheduler3.mode + $scope.scheduler3.date.toString();
      }, function(nv, ov) {
        var mode = scheduler3.getState();
        if (nv.date != mode.date || nv.mode != mode.mode)
          scheduler3.setCurrentView($scope.scheduler3.date, $scope.scheduler3.mode);
      }, true);

      //size of scheduler
      $scope.$watch(function() {
        return $element[0].offsetWidth + "." + $element[0].offsetHeight;
      }, function() {
        scheduler3.setCurrentView();
      });

      //styling for dhtmlx scheduler
      $element.addClass("dhx_cal_container");

      //init scheduler
      scheduler3.init($element[0], $scope.scheduler3.date, $scope.scheduler3.mode);
    }
  }
})



.directive('dhxTemplate', ['$filter', function($filter){
  scheduler.aFilter = $filter;

  return {
    restrict: 'AE',
    terminal:true,
   
    link:function($scope, $element, $attrs, $controller){
      $element[0].style.display = 'none';
     // $element[0].style.height = '1000px';

      var template = $element[0].innerHTML;
      template = template.replace(/[\r\n]/g,"").replace(/"/g, "\\\"").replace(/\{\{event\.([^\}]+)\}\}/g, function(match, prop){
        if (prop.indexOf("|") != -1){
          var parts = prop.split("|");
          return "\"+scheduler.aFilter('"+(parts[1]).trim()+"')(event."+(parts[0]).trim()+")+\"";
        }
        return '"+event.'+prop+'+"';
      });
      var templateFunc = Function('sd','ed','event', 'return "'+template+'"');
      scheduler.templates[$attrs.dhxTemplate] = templateFunc;
    }
  };
}]);
