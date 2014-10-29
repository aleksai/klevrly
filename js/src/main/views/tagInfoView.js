
define(['jquery','underscore','backbone','text!main/views/tagInfoTemplate.html','main/models/genreModel','main/models/albumModel',
    'main/models/artistModel','main/models/trackModel','main/views/itemViews/artistItemView','main/views/itemViews/trackItemView','main/views/itemViews/genreItemView'],

    function($,_,Backbone,tagInfoTemplate,GenreModel,AlbumModel,ArtistModel,TrackModel,ArtistItemView,TrackItemView,GenreItemView){

    return Backbone.View.extend({
        tag:'div',
        id:'tagView',
        template: _.template(tagInfoTemplate),
        events:{
            'click .btn-play-radio':'playTagRadio'
        },
        initialize:function(){
            this.genreModel = new GenreModel();
            this.listenTo(this.genreModel,'fetchInfoComplete',this.onTagFetchComplete,this);
            this.listenTo(this,'playItem',this.onTagTrackPlayed);
            this.listenTo(this.genreModel,'fetchTopArtistComplete',this.onTopArtistFetchComplete,this);
            this.listenTo(this.genreModel,'fetchTopTracksComplete',this.onTopTracksFetchComplete,this);
            this.listenTo(this.genreModel,'fetchSimilarTagsComplete',this.onSimilarTagFetchComplete,this);
        },
        render:function(){
            this.$el.html(this.template({}));
            this.$loaderDiv = $('#mainOverlay');

            this.$tagName = this.$('.tag-name .title');
            this.$tags = this.$('.similar-tags');
            this.$info = this.$('.info');
            this.$songs = this.$('.songs');
            this.$artists = this.$('.artists');
            return this;
        },
        showLoadingAnimation:function(){
            this.$loaderDiv.show().addClass('visible');
        },
        hideLoadAnimation:function(){
            this.$loaderDiv.removeClass('visible').hide();
        },
        destroyAllChildViews:function(){
            //TODO - clean up child views
        },
        fetchTagInfo:function(tagName){
            this.$tagName.text(tagName);
            this.showLoadingAnimation();
            this.genreModel.fetchInfo(tagName);
            this.genreModel.fetchChartingArtists(tagName);
            this.genreModel.fetchTopTracks(tagName);
            this.genreModel.fetchSimilarTags(tagName);
        },
        onTagFetchComplete:function(){
            var htmlText = this.genreModel.get('summary');
            //htmlText = htmlText.replace('last.fm/tag','#/tag');
            this.$info.html(htmlText);
        },
        onTopArtistFetchComplete:function(){
            this.hideLoadAnimation();
            var self = this;
            self.$artists.empty();
            var showLimit = 20;
            var artistsArr = this.genreModel.get('artists');
            _.each(artistsArr,function(iArtist,index){
                if(index < showLimit){
                    var iModel = new ArtistModel();
                    var link = iArtist.mbid ? '#artist/' + iArtist.name + '/' + iArtist.mbid: '#artist/' + iArtist.name;
                    iModel.set({
                        title:iArtist.name,
                        mbid:iArtist.mbid,
                        link:link,
                        thumbnail:iArtist.image && iArtist.image[3]['#text']});

                    var iView = new ArtistItemView({model:iModel});
                    self.$artists.append(iView.render().el);
                }
            });
        },
        onTopTracksFetchComplete:function(){
            this.hideLoadAnimation();
            var showLimit = 15;
            var self = this;
            _.each(this.genreModel.get('tracks'),function(iTrack,index){
                if(index < showLimit){
                    iTrack.trackNumber = index+1;
                    var iView = new TrackItemView({model:new TrackModel(iTrack),parent:self});
                    self.$songs.append(iView.render().el);
                }
            });
        },
        onSimilarTagFetchComplete:function(){
            var showLimit = 15;
            var self = this;
            self.$tags.empty();

            _.each(this.genreModel.get('tags'),function(iTag,index){
                if(index < showLimit){
                    var iModel = new GenreModel();
                    iModel.set({name:iTag.name});

                    var iVew = new GenreItemView({model:iModel});
                    self.$tags.append(iVew.render().el);
                }
            });
        },
        onTagTrackPlayed:function(options){
            options.type = 'album';
            options.albumModel  = this.getGenreAlbum();
            this.bubble('playTagRadio',options);
        },
        playTagRadio:function(){
            var options = {
                type:'album',
                trackNumber:0,
                albumModel:this.getGenreAlbum()
            };
            this.bubble('playTagRadio',options);
        },
        getGenreAlbum:function(){
            if(!this.genreAlbum){this.genreAlbum = new AlbumModel()}
            this.genreAlbum.set({tracks:this.genreModel.get('tracks')});
            this.genreAlbum.set({tagName:this.genreModel.get('name')});
            return this.genreAlbum;
        }
    });

});