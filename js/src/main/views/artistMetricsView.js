
define(['jquery','underscore','backbone',
    'text!main/views/artistMetricsTemplate.html'],

    function($,_,Backbone,artistMetricsTemplate){

    return Backbone.View.extend({
        tag:'div',
        id:'artistMetrics',
        template: _.template(artistMetricsTemplate),
        events:{

        },
        initialize:function(){

        },
        render:function(){
            this.$el.html(this.template({}));
            this.$vidChart = this.$('#video-chart');
            return this;
        },
        showLoadingAnimation:function(){
            //this.$loaderDiv.show();
        },
        hideLoadAnimation:function(){
            //this.$loaderDiv.fadeOut();
        },
        capitaliseFirstLetter:function(string)
        {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        cleanTitle:function(title){
            var maxChar = 12;
            var regx = new RegExp(this.artist,'g');
            title = $.trim(title.replace(regx,''));

            title = title.indexOf('-')==0 ? title.slice(1) : title;
            //title = title.length > maxChar ? title.substr(0,maxChar) + '' : title;
            return title;
            /*var match = this.artist;
            match = match.toLowerCase();

            title = title.toLowerCase();
            title = $.trim(title.replace(match,''));

            if(title.indexOf('-')==0){
                title = $.trim(title.substr(1,title.length));
            }
            console.log(match + ' vs. ' + title);

            var maxChar = 20;
            if(title.length > maxChar){
                title = title.substring(0,maxChar) + '...';
            }

            return this.capitaliseFirstLetter(title);*/

        },
        calculateVideoMetrics:function(){

            var viewsArr = [];
            var titlesArr = [];
            var totalCount = 0;
            var self = this;
            var vidLimit = 12;
            this.videoCollection.each(function(iVid,index){

                var viewCount = parseFloat(iVid.get('views'));
                var title = iVid.get('title');          //TODO - clean up artist name from title

                title = self.cleanTitle(title);

                //if(iVid.get('category').toLowerCase()==='music'){
                    totalCount += viewCount;
                //}

                if(index < vidLimit){
                    viewsArr.push(viewCount);
                    titlesArr.push(title);
                }

            });

            //this.renderVideoChart(viewsArr,titlesArr,totalCount);
            //this.renderHotnessChart();

        },
        renderVideoChart:function(viewsArr,titlesArr,totalCount){
            //console.log(viewsArr.toString());


            var dataArr =  [62753975,207154861,357351743,299313132,645110 ];

            var self = this;
            $('#video-chart').highcharts({
                title: {
                    text: 'Video Views: ' +  self.numberWithCommas(totalCount),
                    x: -20, //center
                    style: {
                        color: '#FFF'
                        //font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                },
                /*subtitle: {
                    text: 'Source: WorldClimate.com',
                    x: -20
                },*/
                colors: ['#FF9326',"#66B5DE", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
                    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                chart: {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#315273'],
                            [1, '#2C3640']
                        ]
                    },
                    borderWidth: 0,
                    borderRadius: 5,
                    plotBackgroundColor: null,
                    plotShadow: false,
                    plotBorderWidth: 0
                },
                xAxis: {
                    categories: titlesArr, //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    style: {
                        color: '#FFF'
                        //font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    },
                    labels: {
                        rotation:-45,
                        style: {
                            color: '#7798BF'//'#BBB',
                            //fontWeight: 'bold'
                        },
                        formatter:function(){
                            return this.value.slice(0,8) + '..';
                        }
                    },
                    gridLineWidth: 0,
                    lineColor: 'rgba(255, 255, 255, .1)',//'#576F89',
                    gridLineColor: 'rgba(255, 255, 255, .1)',
                    //minorGridLineColor: 'rgba(255,255,255,0.07)'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        style: {
                            color: '#7798BF',
                            //fontWeight: 'bold'
                        }
                    },
                    plotLines: [{           //Center LIne
                        //value: 0,
                        //width: 1,
                        //color: '#808080'
                    }],
                    gridLineWidth: 1,
                    lineColor: 'rgba(255, 255, 255, .1)',//'#576F89',
                    gridLineColor: 'rgba(255, 255, 255, .1)',
                    //minorGridLineColor: 'rgba(255,255,255,0.07)'
                },
                tooltip: {
                    valueSuffix: 'views',
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, 'rgba(93, 119, 146, 1)'],
                            [1, 'rgba(58, 73, 90, 0.8)']
                        ]
                    },
                    borderWidth: 0,
                    style: {
                        color: '#FFF'
                    }
                },
                legend: {
                    enabled:false,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: ' ',//self.artist,
                    data: viewsArr
                }/*, {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Berlin',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    name: 'London',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }*/]
            });
        },
        renderHotnessChart:function(val){

            $('.hotness-num').html(val);
            $('.chart-value').width(val+'%');

            $('#hotness-chart').highcharts({
                chart: {
                    type: 'bar',
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#315273'],
                            [1, '#2C3640']
                        ]
                    },
                    borderWidth: 0,
                    borderRadius: 5,
                    plotBackgroundColor: null,
                    plotShadow: false,
                    plotBorderWidth: 0
                },
                colors:['#FF9326',"#7291B3","#83A7CD","#4F647B"],
                title: {
                    text: ''
                },
                xAxis: {

                    categories: ['Hotness'],
                    labels: {
                        style: {
                            color: '#7798BF'
                        }
                    }
                },
                yAxis: {
                    min:0,max:100,
                    title: {
                        text: ''
                    },
                    labels: {
                        style: {
                            color: '#7798BF'
                        }
                    },
                    gridLineWidth:0
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: '#FFFFFF',
                    shadow: true
                },
                plotOptions: {
                    dataLabels: {
                        enabled: true
                    }
                },
                tooltip: {
                    valueSuffix: '',
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, 'rgba(93, 119, 146, 1)'],
                            [1, 'rgba(58, 73, 90, 0.8)']
                        ]
                    },
                    borderWidth: 0,
                    style: {
                        color: '#FFF'
                    }
                },
                series: [{
                    name: 'Hotness',
                    data: [val]
                }]
            });
        },
        numberWithCommas:function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    });

});