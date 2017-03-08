angular.module('app')
  .component('tableComponent', {
          templateUrl: 'js/component/table/table.html',
      bindings: {
         tabledatas:'=',
         headings:'=',
         addtableevent:'&',
         deletetableevent:'&',
         deletetableclick:'&',
          harthaltableevent:'&',
         toggletablelist:'&',
         tableclick:'&',
         selectedlist:'=',
         toggletable2:'&',
         tableclick2:'&',
         deletetableclick2:'&',
         blackouttableevent:'&'
      },
      controller: function() {
        var self = this;
        self.toggletablelist = function(item,list) {
          var idx = list.indexOf(item);
          if (idx > -1) {
            list.splice(idx, 1);
          }
          else {
            list.push(item);
          }
          self.selectedlist=list;
          self.toggletable2();
        }

        self.tableclick=function(item,list)
        {
          list.splice(0,1,item);
          self.selectedlist=list;
          self.tableclick2();

        }
        self.deletetableclick=function(item,list)
        {
          list.splice(0,1,item);
          self.selectedlist=list;
          self.deletetableclick2();

        }
      }
     })