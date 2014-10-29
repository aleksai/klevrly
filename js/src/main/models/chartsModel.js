define(function(require){
    var _ = require('underscore'),
        Backbone = require('backbone');

    var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
    return Backbone.Model.extend({
        initialize:function(){

        },
        fetchTracksChart:function(){
            var chartsUrl = 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key='+ API_KEY + '&format=json&limit=50';
            var self = this;
            if(self.tracks){
                self.trigger('fetch:tracksChart:complete',self.tracks); //use cached list to avoid re-fetch
            }else{
                $.ajax({
                    type:'GET',
                    url:chartsUrl,
                    dataType:'jsonp',
                    success:function(data){
                        if(data.tracks){
                            self.tracks = data.tracks.track;
                            self.trigger('fetch:tracksChart:complete',data.tracks.track);
                        }
                    }
                });
            }
        },
        fetchArtistsChart:function(){
            var chartsUrl = 'http://ws.audioscrobbler.com/2.0/?method=chart.getTopArtists&api_key='+ API_KEY + '&format=json&limit=50';
            var self = this;
            if(self.artists){
                self.trigger('fetch:artistsChart:complete',self.artists);   //use cached list to avoid re-fetch
            }else{
                $.ajax({
                    type:'GET',
                    url:chartsUrl,
                    dataType:'jsonp',
                    success:function(data){
                        if(data.artists){
                            self.artists =data.artists.artist;
                            self.trigger('fetch:artistsChart:complete',data.artists.artist);
                        }
                    }
                });
            }
        },
        fetchTagChart:function(){

        }

    });
});