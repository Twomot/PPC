angular.module('app')
    .controller('panelViewController', ['$rootScope','$location', '$filter', '$scope', '$state', '$stateParams', '$mdDialog', '$window', 'JWTTOKEN', function($rootScope,$location, $filter, $scope,
        $state, $stateParams, $mdDialog, $window, JWTTOKEN) {


        //-----------Open Master-------------------------------------------------
        /* Author:PK
         Version:1.0
         Date:Feb-20
         Used to read master ticket details by clicking on the 
         search icon on master ticket block
         */
        $scope.ViewMaster = function(master) {
            console.log(master);
            master.currentProcess = 1;
            //master.salesOrderCreationDate = new Date();
            master.exFactoryDate = new Date(master.exFactoryDate);
            $mdDialog.show({
                locals: { dataToPass: master },
                templateUrl: 'templates/job_order.html',
                parent: angular.element(document.body),
                scope: this,
                preserveScope: true, // do not forget this if use parent scope
                clickOutsideToClose: true,
                controller: function($scope, dataToPass) {
                    $scope.plant = [
                        { id: 1, value: 'AX01', name: 'AX01', color: "yellow" },
                        { id: 2, value: 'AX03', name: 'AX03', color: "blue" },
                        { id: 3, value: 'AX04', name: 'AX04', color: "purple" }
                    ];
                    $scope.master = dataToPass;
                    $scope.ReadMode = true;
                }
            });
        }

        //------------------------Draw Job Train------------------------------------
        /* Author:
        Version:1.0
        Date:Feb-20
        Function that draws job train on panel view
        */
        function drawJobTrain(masterID) {
            JWTTOKEN.requestFunction('GET', 'mastertickets/' + masterID + '/processes?filter[order]=sequentialorParrallelOrderNo ASC').then(function(result) {
                console.log(result);
                $scope.activated = false;
if( result.data[0]){
                result.data[0].rtl = "rtl";
                result.data[0].ltr = "ltr";}
                $scope.processLength = result.data.length;

                var process = result.data;
                for (var j = 0; j < process.length; j++) {


                    if (process[j].processType == "process") {
                        process[j].mystyle = {
                            "width": "85px",
                            "height": "130px"
                        }
                        process[j].processNameData = process[j].processName;
                    } else if (process[j].processType == "inwardlogistics") {
                        process[j].mystyle = {
                            "width": "30px",
                            "height": "130px",
                            "background-color": "#D3D3D3"


                        }
                        process[j].processNameData = process[j].processType;
                    } else if (process[j].processType == "inlineQC") {
                        process[j].mystyle = {
                            "width": "30px",
                            "height": "130px",
                            "background-color": "#DEB887"

                        }

                        process[j].processNameData = process[j].processType;
                    } else if (process[j].processType == "outwardlogistics") {
                        process[j].mystyle = {
                            "width": "30px",
                            "height": "130px",
                            "background-color": "#C0C0C0"

                        }
                        process[j].processNameData = process[j].processType;
                    } else if (process[j].processType == "finalQC") {
                        process[j].mystyle = {
                            "width": "30px",
                            "height": "130px",
                            "background-color": "#B22222"

                        }
                        process[j].processNameData = process[j].processType;
                    } else if (process[j].processType == "invoice") {
                        process[j].mystyle = {
                            "width": "30px",
                            "height": "130px",
                            "background-color": "#800000"

                        }
                        process[j].processNameData = process[j].processType;
                    }

                }

                //-----------To get Master Ticket Details --------------------------
                JWTTOKEN.requestFunction('GET', 'mastertickets/' + masterID).then(function(result) {
                    $scope.jsondata.masterDetails = result.data;
                })

                $scope.jsondata = result.data;
                console.log($scope.jsondata);
                var length = result.data.length;

                $scope.limit = 5;
                $scope.begin = 0;


                /*//////////////////////////////////////////////////*/
                $scope.currentPage = 0;

                console.log(length);
                $scope.total = Math.round(length / $scope.limit);
                $scope.current = 1;

            });
        }

        //--------------------------Canvas graphics for train----------------------------------------
       
          /* Author:Rinsha
        Version:1.0
        Date:Feb-20
        arrow draw by canvas
        */
        var can = document.getElementById('canvas1');
        var ctx = can.getContext('2d');

        function drawArrowhead(locx, locy, angle, sizex, sizey) {
            var hx = sizex / 2;
            var hy = sizey / 2;
            ctx.translate((locx), (locy));
            ctx.rotate(angle);
            ctx.translate(-hx, -hy);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 1 * sizey);
            ctx.lineTo(1 * sizex, 1 * hy);
            ctx.closePath();
            ctx.fill();
        }


        // returns radians
        function findAngle(sx, sy, ex, ey) {
            // make sx and sy at the zero point
            return Math.atan2((ey - sy), (ex - sx));
        }


        var sx = 50;
        var sy = 190;
        var ex = 100;
        var ey = 10;



        ctx.beginPath();
        ctx.arc(100, 70, 65, .5 * Math.PI, 1.5 * Math.PI, false);
        ctx.stroke();
        //------------------------Click on coach--------------------------------------
        /* Author:
         Version:1.0
         Date:Feb-20
         function bound to click event on coaches of train.
         */
        $scope.clickFun = function(master) {

            sessionStorage.setItem("info", JSON.stringify(master));
            console.log(master)
            $rootScope.masterData = master;
            window.location.href = '#/processView/exist';
        }


        //------------------------Functions To Load on controller invoke-------------------------------
        var masterID=$stateParams.id;
        drawJobTrain(masterID);

    }]); //end of controller