'use strict';

/* App Module */

var app = angular.module('ganttApp', [ ]);

app.controller('MainGanttCtrl', function($scope,$http,$window) {

  
    gantt.config.auto_scheduling = true;
   

    gantt.attachEvent("onTaskClick", function (id, e){
       //any custom logic here
      //alert(e.path[0].innerText);
     // alert(id);
     console.log(id);
      console.log(e);
      console.log(e.path[0].innerText);
      console.log(gantt.getTask(id));
      var clickData=gantt.getTask(id);
      localStorage.setItem('mydata',JSON.stringify(clickData) );
      console.log(localStorage.getItem('mydata'));
      //window.location.href = 'sample_1st.html';
      window.open('scheduleView.html?id='+id,'_blank');

     /* gantt.getTask(id).id = "4"; //changes task's data
      gantt.getTask(id).text = gantt.getTask("4").text;*/

      //gantt.getTask(id).start_date = gantt.getTask("4").start_date;
      //gantt.getTask(id).duartion ="5";

     //gantt.updateTask(id); //renders the updated task

       return true;
  });

gantt.config.lightbox.sections=[
      {name:"description", height:30, map_to:"text", type:"textarea" , focus:true},
     {name:"vendor", height:30, type:"textarea" , focus:true, default_value:"1"},
     {name:"vendor_details", height:30, type:"textarea" , focus:true,default_value:"2"},
     {name:"order", height:30, type:"textarea" , focus:true,map_to:"order"},
     {name:"sales_order", height:30, type:"textarea" , focus:true,default_value:"3"},
     {name:"design", height:30, type:"textarea" , focus:true,default_value:"4"},
     {name:"quantity", height:30, type:"textarea" , focus:true,default_value:"5"},
     {name:"exFactoryDate", height:30, type:"textarea" , focus:true,default_value:"6"},

     {name:"processor", height:30, type:"textarea" , focus:true,default_value:"7"},
     {name:"processStartDate", height:30, type:"textarea" , focus:true,default_value:"1"},
     {name:"processEndDate", height:30, type:"textarea" , focus:true,default_value:"1"},
     {name:"noofJobsahead", height:30, type:"textarea" , focus:true,default_value:"1"},
     {name:"noofDaysahead", height:30, type:"textarea" , focus:true,default_value:"1"},
     {name:"currentDelay", height:30, type:"textarea" , focus:true,default_value:"1"},
     {name:"estimatedEndDate", height:30, type:"textarea" , focus:true,default_value:"1"},
     {name:"currentQuantity", height:30, type:"textarea" , focus:true,default_value:"1"},

    {name:"time", height:72, type:"time", map_to:"auto"}
];

gantt.config.tooltip_hide_timeout = 1;
gantt.templates.tooltip_text = function(start,end,task){
  //gantt.hideLightbox();
 //return gantt.showLightbox(task.id);
 // gantt.hideLightbox();
  //return true;

var myStyle="<b>Task:</b> "+task.text+"<br/><b>Type:</b> " + task.dataType+"<br/><b>Period:</b> " + task.start_date+"<br/><b>Order: 1</b><br/><b>Vendor: 2</b> <br/><b>Vendor Details: 1</b> <br/><b>Sales Order: 1</b> <br/><b>Design/Colour: 1</b> <br/><b>Quantity: 1</b><br/><b>Ex-Factory Date: 1</b><br/><b>Processor: 1</b><br/><b>Process Start Date: 1</b><br/><b>Process End Date: 1</b><br/><b>No of jobs ahead: 1</b><br/><b>No of days ahead: 1</b><br/><b>Current Delay : 1</b><br/><b>Estimated End Date: 1</b><br/><b>Current Quantity: 1</b><br/><b>workcenterID: 1</b>";
var myStyle1="<b>Task:</b> "+task.text+"<br/><b>Type:</b> " + task.dataType+"<br/><b>Period:</b> " + task.start_date+"<br/><b>Order: 1</b><br/><b>Vendor: 2</b> <br/><b>Vendor Details: 1</b> <br/><b>Sales Order: 1</b> <br/><b>Design/Colour: 1</b> <br/><b>Quantity: 1</b><br/><b>Ex-Factory Date: 1</b><br/><b>Processor: 1</b><br/><b>Process Start Date: 1</b><br/><b>Process End Date: 1</b>";

  return myStyle;
  //return "<h1>aaaa</h1>"
    //return "<b>Task:</b> "+task.text+"<br/><b>Type:</b> " + task.dataType+"<br/><b>Period:</b> " + task.start_date;
};

    $scope.tasks=null;
    /*/////////////////////////////*/   
    return $http({
          method :'GET',
          url:'http://localhost:3000/api/calendars',
         
          'Content-Type':'application/x-www-form-urlencodded'
         }).success(function(result){
          console.log(result);
                  var newData=[{id:1, text:"Project #2", start_date:"20-12-2016", duration:18,order:10,
                        progress:0.4, open: true}];
                  for(var i=0;i<result.length;i++)
                  {
                    console.log(result[i].date);
                    
                     var today = new Date(result[i].date);
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
                      console.log(today);

                   
                    newData.push({id:i+2,start_date:today,duartion:1,text:'M1',dataType:result[i].dayType,open: true,order:10,parent:1});
                  }
                  console.log(newData);




                //var myDetails="Order : \nVendor : \nPO# : \nVendor Details : \nSales Order# : \nDesign/Colour : \nQuantity : \nEx-Factory Date : \nProcessor : \nProcess Start Date : \nProcess End Date : \nNo of jobs ahead ( reporting only) : \nNo of days ahead (reporting only ) : \nCurrent Delay (reporting only) : \nEstimated End Date Current Quantity :";


                  var myData=[
                    {id:1, text:"SO#45637", start_date:"20-12-2016", duration:18, order:10, progress:0.4, open: true},
                    {id:2, text:"Stores", start_date:"20-12-2016", duration:"3", parent:"1", progress: 1, open: true,ticket:"SO#45637",ticketno:"45637"},
                    {id:3, text:"Dyeing", start_date:"23-12-2016", duration:"2", parent:"1", progress: 0.8, open: true,ticket:"SO#45637",ticketno:"45637"},
                    {id:4, text:"Weaving", start_date:"27-12-2016", duration:"4", parent:"1", progress: 0.2, open: true,ticket:"SO#45637",ticketno:"45637",color:"red"},
                    {id:5, text:"Printing", start_date:"31-12-2016", duration:"4", parent:"1", progress: 0.1, open: true,ticket:"SO#45637",ticketno:"45637"},
                    {id:6, text:"Stiching", start_date:"05-01-2017", duration:"4", parent:"1", progress: 0.2, open: true,ticket:"SO#45637",ticketno:"45637"},
                    {id:7, text:"Invoice", start_date:"10-01-2017", duration:"4", parent:"1", progress: 0.3, open: true,ticket:"SO#45637",ticketno:"45637"},

                    {id:11, text:"SO#12345", start_date:"22-12-2016", duration:18, order:10, progress:0.4, open: true},
                    {id:12, text:"Stores", start_date:"25-12-2016", duration:"2", parent:"11", progress: 1, open: true,ticket:"SO#12345",ticketno:"12345"},
                    {id:13, text:"Dyeing", start_date:"27-12-2016", duration:"1", parent:"11", progress: 0.8, open: true,ticket:"SO#12345",ticketno:"12345",color:"red"},
                    {id:14, text:"Weaving", start_date:"28-12-2016", duration:"3", parent:"11", progress: 0.2, open: true,ticket:"SO#12345",ticketno:"12345"},
                    {id:15, text:"Printing", start_date:"31-12-2016", duration:"3", parent:"11", progress: 0.1, open: true,ticket:"SO#12345",ticketno:"12345"},
                    {id:16, text:"Stiching", start_date:"03-01-2017", duration:"6", parent:"11", progress: 0.2, open: true,ticket:"SO#12345",ticketno:"12345"},
                    {id:17, text:"Invoice", start_date:"09-01-2017", duration:"4", parent:"11", progress: 0.3, open: true,ticket:"SO#12345",ticketno:"12345"}
                  ];
                  console.log(myData);
            $scope.tasks = {
                  data:myData,
                  links:[
                    { id:1, source:2, target:3, type:"1"},
                    { id:2, source:3, target:4, type:"0"},
                    { id:3, source:4, target:5, type:"0"},
                    { id:4, source:5, target:6, type:"0"},
                    { id:5, source:6, target:7, type:"0"},
                    { id:6, source:7, target:8, type:"0"},

                    { id:11, source:12, target:13, type:"1"},
                    { id:12, source:13, target:14, type:"0"},
                    { id:13, source:14, target:15, type:"0"},
                    { id:14, source:15, target:16, type:"0"},
                    { id:15, source:16, target:17, type:"0"},
                    { id:16, source:17, target:18, type:"0"}
                  ]};
         });
    /*////////////////////////////*/        
//gantt.moveTask("1", 1); 
    

    
});