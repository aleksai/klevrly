define(function(require){

    var _ = require('underscore'),
        Backbone = require('backbone'),
        $ = require('jquery'),
        BaseView = require('components/baseView'),
        $htmlTemplate = require('text!main/views/chartsTemplate.html'),
        ChartTrackItemView = require('main/views/itemViews/chartTrackItemView'),
        TrackModel = require('main/models/trackModel'),
        ChartsModel = require('main/models/chartsModel'),
        ArtistModel = require('main/models/artistModel'),
        AlbumModel = require('main/models/albumModel'),
        ArtistItemView = require('main/views/itemViews/artistItemView');

    return BaseView.extend({
        className:'charts',
        template: _.template($htmlTemplate),
        initialize:function(){
            this.chartsModel = new ChartsModel();
            this.listenTo(this.chartsModel,'fetch:tracksChart:complete',this.onTrackChartsReady);
            this.listenTo(this.chartsModel,'fetch:artistsChart:complete',this.onArtistChartsComplete);
        },
        render:function(){
            this.$el.html(this.template({}));
            this.$loaderDiv = $('#mainOverlay');
            this.$content = this.$('.charts-content');
            this.$header = this.$('.chart-title');
            return this;
        },
        clearUI:function(){
            this.$content.empty();
            this.removeChildViews();
        },
        showChart:function(chartType){

            this.showLoadingAnimation();
            this.clearUI();

            this.$('.button').removeClass('selected');
            this.$('.btn-chart-' + chartType).addClass('selected');

            this.$header.text('Top ' + chartType);
            switch (chartType){
                case 'songs':
                    this.chartsModel.fetchTracksChart();
                    break;
                case 'artists':
                    this.chartsModel.fetchArtistsChart();
                    break;
                case 'genres':
                    this.showComingSoon();
                    break;
                case 'trending':
                    this.$header.text(chartType);
                    this.showComingSoon();
                    break;
            }
        },
        onArtistChartsComplete:function(artistList){
            this.hideLoadingAnimation();

            var self = this;
            _.each(artistList,function(iArtist,index){
                iArtist.position = index +1;
                var artistView = new ArtistItemView({model:new ArtistModel(iArtist),parent:self});
                self.addChild(artistView);
                self.$content.append(artistView.render().el);
            });
        },
        onTrackChartsReady:function(trackList){
            this.hideLoadingAnimation();
            this.clearUI();
            this.trackChart = new AlbumModel({tracks:trackList});

            var self = this;
            _.each(trackList,function(iTrack,index){
                iTrack.position = index +1;
                iTrack.trackNumber = index + 1;
                var trackView = new ChartTrackItemView({model:new TrackModel(iTrack),parent:self});
                trackView.albumMode = true;
                trackView.album = self.trackChart;
                self.addChild(trackView);
                self.$content.append(trackView.render().el);
            });
        },
        showLoadingAnimation:function(){
            this.$loaderDiv.css('top','100px');
            this.$loaderDiv.show().addClass('visible');
        },
        hideLoadingAnimation:function(){
            this.$loaderDiv.hide().css('top','50px').removeClass('visible');
        },
        showComingSoon:function(){
            this.hideLoadingAnimation();
            this.$content.html('Coming Soon');
        }

    });


});