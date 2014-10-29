
define(['jquery','underscore','backbone','appModule'
    ,'main/views/searchResultsView','main/views/albumOverlayView','main/views/artistInfoView','main/views/tagInfoView','main/views/chartsView'],
    function($,_,Backbone,AppModule,SearchResultsView,AlbumOverlayView,ArtistInfoView,TagInfoView,ChartsView){

    var ESC_KEY = 27;
    return AppModule.extend({
        name:'Main Module',
        start:function(options){

            if(options && options.router){
                this.router = options.router;
                this.router.on('home',this.onRouterHome,this);
                this.router.on('artist',this.onRouterShowArtist,this);
                this.router.on('album',this.onRouterShowAlbum,this);
                this.router.on('tag',this.onRouterShowTag,this);
                this.router.on('search',this.onRouterSearchAll,this);
                this.router.on('charts',this.onRouterShowChart,this);
            }

            this.$albumOverlay = $('#darkOverlay');
            this.$sideBarArrow = $('#sideBarArrow');

            var self = this;
            this.$albumOverlay.click(function(event){
                if($(event.target).attr('id') === 'darkOverlay' || $(event.target).attr('class')==='album-cover'){
                    self.closeAlbumOverlay();
                    history.back();
                }
            });

            $(document).keyup(function(evt){
                if(evt.keyCode===ESC_KEY && self.albumOverlayOpen){
                    self.closeAlbumOverlay();
                    history.back();
                }
            });

        },
        showSearchResultsView:function(query){
            this.closeAlbumOverlay();

            if(!this.searchResultsView){
                this.searchResultsView = new SearchResultsView();
                this.searchResultsView.on('playItem',this.onPlayItemEvent,this);
            }

            $(this.region).html(this.searchResultsView.render().el);
            this.searchResultsView.delegateEvents();
            this.searchResultsView.searchAll(query);
        },
        showArtistView:function(name,id){

            if(!this.artistInfoView){
                this.artistInfoView = new ArtistInfoView();
                this.artistInfoView.on('playItem',this.onPlayItemEvent,this);
            }
            $(this.region).html(this.artistInfoView.render().el);
            this.artistInfoView.delegateEvents();
            this.artistInfoView.getArtistInfo(name,id);

        },
        showAlbumInfoView:function(artist,album,id){

            this.albumOverlayOpen = true;
            if(!this.albumOverlayView){
                this.albumOverlayView = new AlbumOverlayView();
                this.albumOverlayView.on('playItem',this.onPlayItemEvent,this);
            }

            this.$albumOverlay.html(this.albumOverlayView.render().el);
            this.albumOverlayView.delegateEvents();
            this.showAlbumOverlay();

            this.albumOverlayView.getAlbumInfo(artist,album,id);
            this.albumOverlayView.slideIn();

        },
        showAlbumOverlay:function(){
            this.$sideBarArrow.addClass('dark');
            this.$albumOverlay.fadeIn();
        },
        hideAlbumOverlay:function(){
            this.$sideBarArrow.removeClass('dark');
            this.$albumOverlay.fadeOut();
        },
        showTagInfoView:function(tagName){
            if(!this.tagInfoView){
                this.tagInfoView = new TagInfoView();
                this.tagInfoView.on('playTagRadio',this.onPlayItemEvent,this);
            }

            $(this.region).html(this.tagInfoView.render().el);
            this.tagInfoView.delegateEvents();
            this.tagInfoView.fetchTagInfo(tagName);
        },
        closeAlbumOverlay:function(){
            this.albumOverlayOpen = false;
            if(this.albumOverlayView){
                this.albumOverlayView.slideOut();
            }
            this.hideAlbumOverlay();
        },
        showChartsView:function(chartType){
            if(!this.chartsView){
                this.chartsView = new ChartsView();
                this.chartsView.on('playItem',this.onPlayItemEvent,this);
            }
            $(this.region).html(this.chartsView.render().el);
            this.chartsView.delegateEvents();
            this.chartsView.showChart(chartType);
        },
        showGenreView:function(){

        },
        onRouterShowArtist:function(artistName,mbid){
            this.closeAlbumOverlay();
            if(this.currentArtist!==artistName){
                this.currentArtist = artistName;
                this.currentSearch = undefined;
                this.showArtistView(artistName,mbid);
            }
        },
        onRouterShowAlbum:function(artist,album, id){
            this.showAlbumInfoView(artist,album,id);
        },
        onRouterShowTag:function(tagName){
            this.closeAlbumOverlay();
            this.currentArtist = undefined;
            this.currentSearch = undefined;
            this.showTagInfoView(tagName);
        },
        onRouterSearchAll:function(query){

            if(this.currentSearch!==query){
                this.currentSearch = query;
                this.currentArtist = undefined;
                this.showSearchResultsView(query);
            }
        },
        onRouterShowChart:function(type){
            this.closeAlbumOverlay();
            this.currentSearch = undefined;
            this.currentArtist = undefined;
            this.showChartsView(type);
        },
        onPlayItemEvent:function(options){
            this.publish('player:playItem',options);
        }

    });


});