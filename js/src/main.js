'use strict'

require.config({
    paths:{
        requireLib:'../lib/require/require',
        jquery:'../lib/jquery/jquery-min',
        jqueryui:'../lib/jqueryui/jquery-ui-1.10.3.custom.min',
        underscore:'../lib/underscore/underscore-min',
        backbone:'../lib/backbone/backbone-min',
        text:'../lib/require/text',
        bubble: '../lib/bubble/backbone.bubble.min',
        moment:'../lib/moment/moment.min',
        knob:'../lib/knob/jquery.knob',
        //highcharts:'../lib/highcharts/highcharts',
        api:'../api',
        velocity:'../lib/velocity/velocity.min',
        velocityui:'../lib/velocity/velocity.ui.min'
    },
    shim:{
        underscore:{
            exports: '_'
        },
        backbone:{
            deps:['underscore','jquery'],
            exports:'Backbone'
        },
        jqueryui:{
            deps:['jquery'],
            exports:'jqueryui'
        },
        highcharts:{
            deps:['jquery'],
            exports:'highcharts'
        },
        bubble:{
            deps:['backbone'],
            exports:'bubble'
        },
        knob:{
            deps:['jquery'],
            exports:'knob'
        },
        velocityui:{
            deps:['velocity'],
            exports:'velocityui'
        }
    }
});

//TODO - use sugar syntax
define(['jquery','jqueryui','underscore','backbone','router','application',
    'sidebar/sidebarModule','main/mainModule','header/headerModule','player/playerModule','bubble','requireLib','knob'],
    function($,jqueryui, _,Backbone,Router,Application,SidebarModule,MainModule,HeaderModule,PlayerModule){

        var application = new Application();
        var sidebarModule = new SidebarModule(application,{region:'#sideBar'});
        var mainModule = new MainModule(application,{region:'#main'});
        var headerModule = new HeaderModule(application,{region:'#header'});
        var playerModule = new PlayerModule(application,{region:'#player'});

        window.app = application;

        application.addModule(sidebarModule);
        application.addModule(mainModule);
        application.addModule(headerModule);
        application.addModule(playerModule);


        var detectRetinaDisplay = function(){
            window.retina = window.devicePixelRatio > 1 ? true : false;
        };

        $(document).ready(function(){
            detectRetinaDisplay();
            var appRouter = new Router;
            application.start({router:appRouter});
            Backbone.history.start();

            window.versionTitle = "Klevrly 2.1";
            document.title = window.versionTitle;

        });
    });
