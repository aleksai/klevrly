
define(function(require){

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        moment = require('moment'),
        AlbumModel = require('main/models/albumModel'),
        TrackItemView = require('main/views/itemViews/trackItemView'),
        TrackModel = require('main/models/trackModel'),
        GenreItemView = require('main/views/itemViews/genreItemView'),
        GenreModel = require('main/models/genreModel'),
        $htmlTemplate = require('text!main/views/albumOverlayTemplate.html');

    return Backbone.View.extend({
        tagName:'div',
        className:'album-overlay',
        template: _.template($htmlTemplate),
        events:{
            'click .album-cover':'toggleCoverImage'
        },
        initialize:function(){
            this.model = new AlbumModel();
            this.listenTo(this.model,'fetchAlbumComplete',this.onFetchComplete,this);
            this.listenTo(this.model,'fetchComplete2',this.onFetchComplete2,this);
            this.coverShowing = false;
            this.childViews = [];
        },
        render:function(){
            this.$el.html(this.template(this.model));
            this.$loaderDiv = this.$('.loader');
            return this;
        },
        slideIn:function(){
            var footerHeight = 0;
            var windowHeight = $(window).height() - footerHeight;
            var albumHeight = this.$el.height();
            var marginTop = Math.round((windowHeight - albumHeight)/3);
            this.$el.css('margin-top',marginTop);
        },
        slideOut:function(){
            this.$el.css('margin-top',-600);
        },
        getAlbumInfo:function(artist,album,mbid){
            this.destroyAllChildViews();
            this.showLoadingAnimation();
            this.model.fetchAlbumInfo(artist,album,mbid);
        },
        onFetchComplete:function(){

            this.hideLoadAnimation();
            this.$el.html(this.template(this.model));

            var date = moment(this.model.get('releaseDate')).format("MMM Do YYYY");
            this.$('.title').html(this.model.get('name'));
            this.$('.artist').html(date);
            this.$('.album-cover-img').attr('src',this.model.get('thumbnail'));
            this.$('.album-cover-img-large').attr('src',this.model.get('cover'));

            this.$('.album-cover-img-large').off();
            this.$('.album-cover-img-large').on('load',function(){
                $(this).css('opacity',0.9);
                $(this).css('margin-top',0);
            });

            this.renderTrackList();
            this.renderTagList();

            this.$el.get('summary') ? this.$el.find('#albumSummary').show() : this.$el.find('#albumSummary').hide() ;
        },
        renderTrackList:function(){
            var self = this;
            _.each(this.model.get('tracks'),function(iTrack,index){
                iTrack.trackNumber = index+1;
                var trackView = new TrackItemView({model:new TrackModel(iTrack),parent:self});
                trackView.albumMode = true;
                trackView.album = self.model;

                self.childViews.push(trackView);
                this.$('.album-tracks').append(trackView.render().el);
            });
        },
        renderTagList:function(){
            var self = this;
            _.each(this.model.get('tags'),function(iTag,index){
                var tagModel = new GenreModel();
                tagModel.set({name:iTag.name});

                if(tagModel.get('name') && tagModel.get('name')!==''){
                    var tagView = new GenreItemView({model:tagModel});
                    self.childViews.push(tagView);
                    self.$('.album-tags').append(tagView.render().el);
                }
            });

        },
        onFetchComplete2:function(){
            this.hideLoadAnimation();
            this.$el.html(this.template(this.model));
        },
        showLoadingAnimation:function(){
            //this.$('.loader').show();
        },
        hideLoadAnimation:function(){
            //this.$('.loader').fadeOut();
        },
        destroyAllChildViews:function(){
            //TODO - clean up child views
            _.each(this.childViews,function(childView){
                childView.off();
                childView.remove();
            });

            this.childViews.length = 0;
        },
        toggleCoverImage:function(){
            this.coverShowing ? this.hideCoverImage() : this.showCoverImage();
            this.coverShowing = !this.coverShowing;
        },
        showCoverImage:function(){
            this.$('.album-cover-large').css('left',0);
        },
        hideCoverImage:function(){
            this.$('.album-cover-large').css('left',-500);
        }
    });
});