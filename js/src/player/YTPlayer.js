define(function(require){

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var YTPlayer = function(){
        var self = this,
            player;

        self.events = _.extend({},Backbone.Events);

        function onPlayerReady(){
            self.events.trigger('player:ready');
        }

        function onPlayerStateChange(evt){
            var state = evt.data;
            self.events.trigger('player:state:change',state);
        }

        function onPlayerError(evt){
            var error = evt.data;
            self.events.trigger('player:error',error);
            console.log('YT: player error: ' + error);
        }

        function onPlayerQualityChange(evt){
            var quality = evt.data;
            self.events.trigger('player:quality:change',quality);
        }

        self.init = function(){
            player = new YT.Player('player', {
                height: '200',
                width: '350',
                wmode: 'transparent',
                playerVars: { 'autoplay': 0, 'controls': 0, 'autohide':2, 'color':'white',showinfo:0 },
                events: {
                    'onReady':onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError':onPlayerError,
                    'onPlaybackQualityChange':onPlayerQualityChange
                }
            });
        };

        self.play = function(videoId){
            player.loadVideoById(videoId);
            player.playVideo();
        };

        self.pause = function(){
            player.pauseVideo();
        };

        self.resume = function(){
            player.playVideo();
        };

        self.getDuration = function(){
            return player.getDuration();
        };

        self.getCurrentTime = function(){
            return player.getCurrentTime();
        };

        self.seekTo = function(val){
            player.seekTo(val);
        };

        self.getVideoLoadedFraction = function(){
            return player.getVideoLoadedFraction();
        };
    };

    //TODO - extend BB events so we can trigger events

    return YTPlayer;

});