'use strict'

require.config({
    paths:{
        jquery:'../bower/jquery/jquery',
        jqueryui:'../lib/jqueryui/jquery-ui-1.10.3.custom.min',
        underscore:'../bower/underscore/underscore',
        backbone:'../bower/backbone/backbone',
        text:'../bower/require-text/text',
        bubble: '../lib/bubble/backbone.bubble.min',
        moment:'../bower/moment/moment',
        knob:'../lib/knob/jquery.knob',
        //highcharts:'../lib/highcharts/highcharts',
        velocity:'../bower/velocity/velocity',
        velocityui:'../bower/velocity/velocity.ui'
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
    'sidebar/sidebarModule','main/mainModule','header/headerModule','player/playerModule','bubble','knob'],
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
