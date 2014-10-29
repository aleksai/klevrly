
define( function(require){

    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('components/baseView'),
        ArtistModel = require('main/models/artistModel'),
        GenreModel = require('main/models/genreModel'),
        AlbumModel = require('main/models/albumModel'),
        TrackModel = require('main/models/trackModel'),
        VideoCollection = require('main/models/videoCollection'),
        ArtistItemView = require('main/views/itemViews/artistItemView'),
        GenreItemView = require('main/views/itemViews/genreItemView'),
        AlbumItemView = require('main/views/itemViews/albumItemView'),
        TrackItemView = require('main/views/itemViews/trackItemView'),
        VideoItemView = require('main/views/itemViews/videoItemView'),
        ArtistMetricsView = require('main/views/artistMetricsView'),
        velocity = require('velocityui'),
        $htmlTemplate = require('text!main/views/artistInfoTemplate.html');

    var MAX_ALBUMS = 10,
        MAX_VIDEOS = 8,
        MAX_TRACKS = 10,
        MAX_SIMILAR_ARTIST = 15;

    return BaseView.extend({
        tag:'div',
        id:'artistView',
        template: _.template($htmlTemplate),
        events:{
            'mouseenter .avatar-wrapper':'onAvatarMouseEnter',
            'mouseleave .avatar-wrapper':'onAvatarMouseLeave',
            'click .avatar-wrapper':'getArtistImages',
            'click .btn-play-artist':'playArtistRadio',
            'click .btn-more-videos':'showMoreVideos'
        },
        initialize:function(){
            _.bindAll(this,'handleResize');
            this.handleResize = _.debounce(this.handleResize,300);

            this.artistModel = new ArtistModel();
            this.videoCollection = new VideoCollection();
            this.artistMetrics = new ArtistMetricsView();

            this.listenTo(this.videoCollection,'reset',this.renderVideoResults,this);
            this.listenTo(this.artistModel,'fetchComplete',this.onArtistFetchComplete,this);
            this.listenTo(this.artistModel,'fetchSimilarComplete',this.onArtistSimilarComplete,this);
            this.listenTo(this.artistModel,'fetchAlbumsComplete',this.onArtistAlbumsComplete,this);
            this.listenTo(this.artistModel,'fetchTracksComplete',this.onArtistTracksComplete,this);
            this.listenTo(this.artistModel,'fetchImagesComplete',this.onArtistImagesComplete,this);
            this.listenTo(this.artistModel,'fetchHotnessComplete',this.onFetchHotnessComplete,this);
            this.listenTo(this.artistModel,'fetchFamiliarityComplete',this.onFetchFamiliarityComplete,this);

        },
        render:function(){
            this.$el.html(this.template({}));

            this.$('img.avatar').one('load',function(){
                $(this).css('opacity',1);
            }).each(function(){
                if(this.complete){
                    $(this).load();
                }
            });

            this.$loaderDiv = $('#mainOverlay');
            this.$imageBar = $('#imageBar');
            var self = this;
            this.$imageBar.click(function(evt){
                if($(evt.target).prop('tagName').toLowerCase()==='section'){
                    self.$imageBar.removeClass('is-open').removeClass('is-loading');
                }
            });

            this.$name = this.$('.artist');
            this.$avatar = this.$('.avatar');
            this.$avatarOverlay = this.$('.avatar-wrapper .overlay');
            this.$similar = this.$('.similar');
            this.$bio = this.$('.bio');
            this.$bioTitle = this.$('.bio-title');
            this.$tags = this.$('.tags');
            this.$albums = this.$('.albums');
            this.$tracks = this.$('.songs');
            this.$videos = this.$('.videos');
            this.$metrics = this.$('.metrics');
            this.$hotness = this.$('.artist-hotness');
            this.$popularity = this.$('.artist-popularity');
            this.$buttonMoreVids = this.$('.btn-more-videos');
            $(window).on('resize.artistView',this.handleResize);

            return this;
        },
        handleResize:function(){
            var albumContainer = this.$albums.width(),
                albumWidth,
                numRows = 3;

            if(albumContainer < 780){
                numRows = 3;
            }else if(albumContainer <= 900){
                numRows = 4;
            }else if(albumContainer > 900){
                numRows = 5;
            }
            albumWidth = Math.round(albumContainer/numRows) - 5;

            $('#artistView .albumItem').css('width',albumWidth);
            $('#artistView .albumItem').css('height',albumWidth);
        },
        getArtistImages:function(){
            this.$imageBar.empty().addClass('is-open').addClass('is-loading');
            this.artistModel.fetchImages(this.currentArtist,this.currentArtistId);
        },
        playArtistRadio:function(){
            var options = {
                type:'album',
                trackNumber:0,
                albumModel:this.getTopTracksAlbum()
            };
            this.bubble('playItem',options);
        },
        getTopTracksAlbum:function(){
            if(!this.topTracksAlbum){this.topTracksAlbum = new AlbumModel()}
            this.topTracksAlbum.set({tracks:this.shuffleArray(this.artistModel.get('tracks'))});
            this.topTracksAlbum.set({artistName:this.artistModel.get('name')});
            return this.topTracksAlbum;
        },
        shuffleArray:function(array){
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },
        onAvatarMouseEnter:function(){
            this.$avatarOverlay.show();
        },
        onAvatarMouseLeave:function(){
            this.$avatarOverlay.hide();
        },
        showLoadingAnimation:function(){
            this.$loaderDiv.show().addClass('visible');
        },
        hideLoadAnimation:function(){
            var self = this;
            setTimeout(function(){
                self.$loaderDiv.removeClass('visible').hide();
            },150);    //Delay before hiding animation to allow page to render in the background - smoother experience
        },
        clearUI:function(){
            this.$metrics.empty();
            this.$hotness.empty();
            this.removeChildViews();
            this.allVidsRendered = false;
            this.$buttonMoreVids.show();

        },
        getArtistInfo:function(artist,mbid){
            this.showLoadingAnimation();
            this.clearUI();
            this.currentArtist = artist;
            this.currentArtistId = mbid;
            this.$imageBar.removeClass('is-open');
            this.$imageBar.empty();
            this.$bio.hide();
            this.$bioTitle.hide();

            //TODO - keep track of all Ajax request in model and cancel them
            //TODO - implement cache (within model) of the last 10 artists to avoid refetching
            this.artistModel.imagesLoaded = false;
            this.artistModel.fetchArtistInfo(artist,mbid);
            this.artistModel.fetchSimilar(artist,mbid);
            this.artistModel.fetchTopAlbums(artist,mbid);
            this.artistModel.fetchTopTracks(artist,mbid);
            this.videoCollection.fetchSearch(artist,20,'music');
            this.artistModel.fetchHotness(artist,mbid);       //Rate limit - 20 requests per minute
            this.artistModel.fetchFamiliarity(artist,mbid);
            this.currentArtist = artist;
            this.currentId = mbid;

            this.$metrics.html(this.artistMetrics.render().el);

        },
        onArtistFetchComplete:function(){
            this.hideLoadAnimation();

            this.$name.html(this.artistModel.get('name'));
            this.$bio.html(this.artistModel.get('bio'));
            this.$avatar.attr('src',this.artistModel.get('avatar'));

            var self = this;
            _.each(this.artistModel.get('tags'),function(iTag){
                var iModel = new GenreModel();
                iModel.set({name:iTag.name});

                var iView = new GenreItemView({model:iModel});
                self.addChild(iView);
                self.$tags.append(iView.render().el);
            });

        },
        onArtistSimilarComplete:function(){
            var self = this;
            _.each(this.artistModel.get('similar'),function(iArtist,index){
                if(index < MAX_SIMILAR_ARTIST){
                    var iView = new ArtistItemView({model:new ArtistModel(iArtist)});
                    self.addChild(iView);
                    self.$similar.append(iView.render().el);
                }
            });
            this.animateSimilarArtists();
        },
        animateSimilarArtists:function(){
            var artists =this.$('.artistItem').hide();

            artists.velocity('transition.slideRightBigIn',{
                stagger: 70,
                complete:function(){
                }
            });
        },
        onArtistAlbumsComplete:function(){
            var self = this;
            self.$albums.css('opacity','0');
            _.each(this.artistModel.get('albums'),function(iAlbum,index){
                if(index < MAX_ALBUMS){
                    var iView = new AlbumItemView({model:new AlbumModel(iAlbum)});
                    iView.artistMode = true;
                    self.addChild(iView);
                    self.$albums.append(iView.render().el);
                }
            });
            self.handleResize();
            var self = this;
            setTimeout(function(){
                self.$albums.css('opacity','1');
            },300);
        },
        onArtistTracksComplete:function(){
            var self = this;
            _.each(this.artistModel.get('tracks'),function(iTrack,index){

                if(index < MAX_TRACKS){
                    var iView = new TrackItemView({model:new TrackModel(iTrack),parent:self});
                    iView.artistMode = true;
                    self.addChild(iView);
                    self.$tracks.append(iView.render().el);
                }
            });
            //this.animateTracks();
        },
        animateTracks:function(){
            var tracks =this.$('.trackItem').hide(),
                self = this;

            tracks.velocity('transition.slideUpBigIn',{
                stagger: 50,
                complete:function(){
                    self.$bio.show();
                    self.$bioTitle.show();
                }
            });
        },
        renderVideoResults:function(){
            if(this.videoCollection.length > 0){
                this.artistMetrics.videoCollection = this.videoCollection;
                this.artistMetrics.artist = this.currentArtist;

                this.$videos.html('');
                var self = this;
                this.videoCollection.each(function(iVid,index){
                    if(index < MAX_VIDEOS){self.renderVideoItem(iVid);}
                });
            }else{
                this.$videos.html('No results found');
            }
        },
        renderVideoItem:function(iVid){
            var iView = new VideoItemView({model:iVid,parent:self});
            this.addChild(iView);
            this.$videos.append(iView.render().el);
        },
        showMoreVideos:function(){
            if(this.allVidsRendered)return;

            for(var i=MAX_VIDEOS; i<this.videoCollection.length; i++){
                this.renderVideoItem(this.videoCollection.at(i));
            }
            this.$buttonMoreVids.hide();
            this.allVidsRendered = true;
        },
        onArtistImagesComplete:function(imageArr){
            this.$imageBar.removeClass('is-loading');
            this.$imageBar.empty();
            var self = this;
            imageArr = imageArr.reverse();
            _.each(imageArr,function(imageObj, index){
                if(index < 20){
                    self.$imageBar.append('<a class="image-container" href="'+ imageObj.url +'" target="_blank"><img src="'+ imageObj.url +'"></a>');
                }
            });
        },
        onFetchHotnessComplete:function(){
            var hotness = parseInt(this.artistModel.get('hotness'));
            var hotness_str = hotness + '';
            if(hotness < 10){
                hotness_str = '0' + hotness;
            }else if(hotness ===100){
                hotness_str = '99'
            }
            this.$hotness.text(hotness_str);
        },
        onFetchFamiliarityComplete:function(){

            var familiarity = parseInt(this.artistModel.get('familiarity'));
            var familiarity_str = familiarity + '';
            if(familiarity < 10){
                familiarity_str = '0' + familiarity;
            }else if(familiarity ===100){
                familiarity_str = '99'
            }
            this.$popularity.text(familiarity_str);
        }

    });

});