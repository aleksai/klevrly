
define(['jquery','underscore','backbone','text!main/views/searchResultsTemplate.html',
    'main/models/videoCollection','main/models/albumCollection','main/models/artistCollection',
    'main/models/trackCollection','main/models/genreCollection',

    'main/views/itemViews/videoItemView','main/views/itemViews/albumItemView','main/views/itemViews/artistItemView',
    'main/views/itemViews/trackItemView','main/views/itemViews/genreItemView'],
    function($,_,Backbone,searchResultsTemplate,VideoCollection,AlbumCollection,ArtistCollection,TrackCollection,GenreCollection,
             VideoItemView,AlbumItemView,ArtistItemView,TrackItemView,GenreItemView){
    'use strict';

    return Backbone.View.extend({
        tagName:'div',
        className:'searchResults',
        template: _.template(searchResultsTemplate),
        events:{

        },
        initialize:function(){

            this.videoCollection = new VideoCollection();
            this.albumCollection = new AlbumCollection();
            this.artistCollection = new ArtistCollection();
            this.trackCollection = new TrackCollection();
            this.genreCollection = new GenreCollection();

            this.listenTo(this.videoCollection,'reset',this.renderVideoResults,this);
            this.listenTo(this.albumCollection,'reset',this.renderAlbumResults,this);
            this.listenTo(this.artistCollection,'reset',this.renderArtistResults,this);
            this.listenTo(this.trackCollection,'reset',this.renderTrackResults,this);
            this.listenTo(this.genreCollection,'reset',this.renderGenreResults,this);

            this.childViews = [];
            this.containerWidth = $('#main').width();

        },
        render:function(){
            this.$el.html(this.template({title:'Search Results'}));

            this.$videoResultsDiv = this.$el.find('#videoSearchResults .content');
            this.$albumResultsDiv = this.$el.find('#albumSearchResults .content');
            this.$artistResultsDiv = this.$el.find('#artistSearchResults .content');
            this.$trackResultsDiv = this.$el.find('#trackSearchResults .content');
            this.$genreResultsDiv = this.$el.find('#genreSearchResults .content');

            this.$loaderDiv = $('#mainOverlay');

            return this;

        },
        searchAll:function(query){
            this.showLoadingAnimation();
            this.destroyAllChildViews();
            //TODO - fetch many results (i.e. 20) and then limit the number rendered - until 'More >>' is clicked
            this.videoCollection.fetchSearch(query,10);
            this.albumCollection.fetchSearch(query,12);
            this.artistCollection.fetchSearch(query,3);
            this.trackCollection.fetchSearch(query,15);
            this.genreCollection.fetchSearch(query,10);
        },
        showLoadingAnimation:function(){
            this.$loaderDiv.show().addClass('visible');
            this.$videoResultsDiv.hide();
            this.$albumResultsDiv.hide();
            this.$artistResultsDiv.hide();
            this.$trackResultsDiv.hide();
            this.$genreResultsDiv.hide();
        },
        hideLoadAnimation:function(){
            this.$loaderDiv.removeClass('visible').hide();
        },
        destroyAllChildViews:function(){
            var self = this;
            _.each(this.childViews,function(iView){
                self.stopListening(iView);
                iView.stopListening();
                iView.remove();
            });
            this.childViews.length = 0;

        },
        renderVideoResults:function(){

            this.hideLoadAnimation();
            var self = this;
            if(this.videoCollection.length > 0){

                this.$videoResultsDiv.html('');
                this.videoCollection.each(function(iVid){
                    var iVew = new VideoItemView({model:iVid,parent:self});
                    self.$videoResultsDiv.append(iVew.render().el);
                    self.childViews.push(iVew);
                });

            }else{
                this.$videoResultsDiv.html('No results found');
            }

            this.$videoResultsDiv.fadeIn();
        },
        renderAlbumResults:function(){

            this.hideLoadAnimation();
            var self = this;
            if(this.albumCollection.length > 0){

                this.$albumResultsDiv.html('');
                this.albumCollection.each(function(iAlbum){
                    var iVew = new AlbumItemView({model:iAlbum,searchMode:true});
                    self.$albumResultsDiv.append(iVew.render().el);
                    self.childViews.push(iVew);
                });

            }else{
                self.$albumResultsDiv.html('No results found');
            }

            this.$albumResultsDiv.fadeIn();
        },
        renderArtistResults:function(){

            this.hideLoadAnimation();
            var self = this;
            if(this.artistCollection.length > 0){

                this.$artistResultsDiv.html('');
                this.artistCollection.each(function(iVid){
                    var iVew = new ArtistItemView({model:iVid});
                    self.$artistResultsDiv.append(iVew.render().el);
                    self.childViews.push(iVew);
                });

            }else{
                self.$artistResultsDiv.html('No results found');
            }

            this.$artistResultsDiv.fadeIn();
        },
        renderTrackResults:function(){

            this.hideLoadAnimation();
            var self = this;
            if(this.trackCollection.length > 0){

                this.$trackResultsDiv.html('');
                this.trackCollection.each(function(iVid){
                    var iVew = new TrackItemView({model:iVid,parent:self});
                    self.$trackResultsDiv.append(iVew.render().el);
                    self.childViews.push(iVew);
                });

            }else{
                self.$trackResultsDiv.html('No results found');
            }

            this.$trackResultsDiv.fadeIn();
        },
        renderGenreResults:function(){

            this.hideLoadAnimation();
            var self = this;
            if(this.genreCollection.length > 0){

                this.$genreResultsDiv.html('');
                this.genreCollection.each(function(iVid){
                    var iVew = new GenreItemView({model:iVid});
                    self.$genreResultsDiv.append(iVew.render().el);
                    self.childViews.push(iVew);
                });

            }else{
                self.$genreResultsDiv.html('No results found');
            }

            this.$genreResultsDiv.fadeIn();
        }


    });

});