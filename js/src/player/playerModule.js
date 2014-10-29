
define(function(require){

    var $ = require('jquery'),
        _ = require('underscore'),
        AppModule = require('appModule'),
        YTPlayer = require('player/YTPlayer'),
        util = require('util/stringUtils');


    var player, module, youtubePlayer;

    return AppModule.extend({
        name:'Player Module',
        playerReady:false,
        start:function(){
            var self = this;
            module = this;
            window.onYouTubePlayerAPIReady = function(){self.onPlayerAPIReady();}
            this.loadYoutubePlayer();

            this.subscribe('player:playItem',function(options){
                self.onPlayItemRequest(options);
            });

            self.$playButton = $('.btn-player-play');
            self.$nextButton = $('.btn-player-next');
            self.$prevButton = $('.btn-player-prev');
            self.$playerTitle = $('#playerTrackInfo');
            self.$playerDiv = $('#playerWrapper');

            self.$playerTotalTime = $('.player-total-time');
            self.$playerCurrentTime = $('.player-current-time');
            self.$playProgressbar = $("#playProgressBar");
            self.$loadProgressbar = $("#loadProgressBar");

            this.initPlayerControls();
        },
        loadYoutubePlayer:function(){
            var tag = document.createElement('script');
            tag.src = "http://www.youtube.com/player_api";

            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        },
        onPlayerAPIReady:function(){
            youtubePlayer = new YTPlayer();
            youtubePlayer.init();
            youtubePlayer.events.on('player:state:change',module.handlePlayerState);
            youtubePlayer.events.on('player:ready',module.handlePlayerReady);
        },
        handlePlayerState:function(state){
            switch(state){
                case YT.PlayerState.BUFFERING:
                    break;
                case YT.PlayerState.PLAYING:
                    module.showPlayer();
                    module.$playerTotalTime.text(util.formatSeconds(youtubePlayer.getDuration()));
                    module.$playButton.removeClass('fa-play');
                    module.$playButton.addClass('fa-pause');
                    break;
                case YT.PlayerState.PAUSED:
                    module.$playButton.removeClass('fa-pause');
                    module.$playButton.addClass('fa-play');
                    break;
                case YT.PlayerState.ENDED:
                    module.setTitle(window.versionTitle);
                    module.albumMode ? module.playNextTrack() : module.hidePlayer();
                    break;
                case YT.PlayerState.CUED:
                    break;
                case -1:
                    break;
            }
        },
        handlePlayerReady:function(){
            setInterval(module.onPlayerTimerTick,500);
        },
        onPlayerTimerTick:function(evt){
            if(module.seekDelay && module.seekDelay > 0){
                module.seekDelay--;
            }else{
                module.updatePlayback();
            }
        },
        playVideo:function(vidId,title){
            this.showPlayer();
            this.setTitle(title);
            this.resetPlayback();
            youtubePlayer.play(vidId);
        },
        setTitle:function(title){
            this.$playerTitle.text(title);
            document.title = title;
        },
        searchAndPlay:function(title){
            this.setTitle(title);
            var searchUrl = 'https://gdata.youtube.com/feeds/api/videos?&v2&alt=json&max-results='+ 10 +'&orderby=relevance&q=' + encodeURIComponent(title);
            var self = this;
            $.ajax({
                type:'GET',url:searchUrl,dataType:'jsonp',
                success:function(data){self.onSearchReady(data,title);}
            });
        },
        searchAndQueueNext:function(title){
            var searchUrl = 'https://gdata.youtube.com/feeds/api/videos?&v2&alt=json&max-results='+ 10 +'&orderby=relevance&q=' + encodeURIComponent(title);
            var self = this;
            $.ajax({
                type:'GET',url:searchUrl,dataType:'jsonp',
                success:function(data){self.onSearchReady(data,title,true);}
            });
        },
        onSearchReady:function(data,title,queueNextTrack){
            var resultsArr = data.feed.entry;
            _.each(resultsArr,function(rawObj,index){
                var vidObj={};
                var vidURl = rawObj.id["$t"];
                vidObj.videoUrl = rawObj.id["$t"];
                vidObj.videoId = $.trim(vidURl.substr(vidURl.lastIndexOf('/')+1,vidURl.length));
                vidObj.title = rawObj.title["$t"];

                if(index===0){
                    if(queueNextTrack){
                        module.nextQueuedItem = {
                            videoId:vidObj.videoId,
                            title:title
                        };
                    }else{
                        module.playVideo(vidObj.videoId,decodeURIComponent(title));
                    }
                }
            });
        },
        queueNextTrack:function(){
            var hasNext = this.currentTrackNum < this.currentAlbum.get('tracks').length-1 ? true : false;
            if(hasNext){
                var nextTitle = this.currentAlbum.getTrackTitleByPosition(this.currentTrackNum+1);
                this.searchAndQueueNext(nextTitle);
            }
        },
        onPlayItemRequest:function(playerItem){
            switch (playerItem.type){
                case 'track':
                    this.searchAndPlay(playerItem.trackModel.get('title'));
                    this.albumMode = false;
                    break;
                case 'video':
                    this.playVideo(playerItem.videoModel.get('videoId'),playerItem.videoModel.get('title'));
                    this.albumMode = false;
                    break;
                case 'album':
                    this.currentAlbum = playerItem.albumModel.clone();
                    this.currentTrackNum = playerItem.trackNumber;
                    var title = this.currentAlbum.getTrackTitleByPosition(this.currentTrackNum);
                    this.searchAndPlay(title);
                    this.queueNextTrack();

                    this.albumMode = true;
                    break;
            }
        },
        playNextTrack:function(){
            this.currentTrackNum++;
            if(module.nextQueuedItem && module.nextQueuedItem.title === this.currentAlbum.getTrackTitleByPosition(this.currentTrackNum)){
                module.playVideo(module.nextQueuedItem.videoId,module.nextQueuedItem.title);
                module.queueNextTrack();
            }
            else if(this.albumMode && this.currentAlbum && this.currentTrackNum <= this.currentAlbum.get('tracks').length-1){
                var title = this.currentAlbum.getTrackTitleByPosition(this.currentTrackNum);
                if(title){
                    youtubePlayer.pause();
                    this.searchAndPlay(title);
                }
            }
        },
        playPreviousTrack:function(){

            this.currentTrackNum--;
            if(this.albumMode && this.currentAlbum && this.currentTrackNum >= 0){
                var title = this.currentAlbum.getTrackTitleByPosition(this.currentTrackNum);
                if(title){
                    youtubePlayer.pause();
                    this.searchAndPlay(title);
                }
            }
        },
        initPlayerControls:function(){
            var self = this;

            self.$playButton.click(function(e){
                self.$playButton.hasClass('fa-pause') ? youtubePlayer.pause() : youtubePlayer.resume();
            });

            self.$nextButton.click(function(){
                self.playNextTrack();
            });

            self.$prevButton.click(function(){
                self.playPreviousTrack();
            });

            self.$loadProgressbar.progressbar({max:100});
            self.$playProgressbar.slider({
                min:0,
                max:100,
                range:'min',
                orientation:'horizontal',
                create: function(event, ui) {},
                start:function(event,ui){
                },
                slide:function(event,ui){
                },
                stop:function(event,ui){
                    self.seekTo(ui.value);
                }
            });
        },
        showPlayer:function(){
            this.$playerDiv.addClass('active');
        },
        hidePlayer:function(){
            this.$playerDiv.removeClass('active');
        },
        updatePlayback:function(){
            $( "#loadProgressBar" ).progressbar( "value", this.getPercentLoaded());
            $( "#playProgressBar" ).slider( "value", this.getPercentPlayed() );

            this.$playerCurrentTime.text(util.formatSeconds(youtubePlayer.getCurrentTime()));
        },
        resetPlayback:function(){
            this.$loadProgressbar.progressbar( "value", 0);
            this.$playProgressbar.slider( "value", 0 );
        },
        seekTo:function(percentVal){
            var seconds = (percentVal/100)*youtubePlayer.getDuration();
            youtubePlayer.seekTo(seconds);
            this.seekDelay = 2; //increase if needed (do this so that progress bar isn't jumpy when seeking)
        },
        getPercentLoaded:function(){
            if(youtubePlayer && youtubePlayer.getVideoLoadedFraction){
                return Math.round(youtubePlayer.getVideoLoadedFraction()*100);
            }
        },
        getPercentPlayed:function(){
            var duration = youtubePlayer.getDuration();
            var currentTime = youtubePlayer.getCurrentTime();
            var percentPlayed = Math.round((currentTime/duration*100));
            return percentPlayed;
        }
    });


});