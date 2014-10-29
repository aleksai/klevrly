
define(['jquery','underscore','backbone'],function($,_,Backbone){

    return Backbone.Model.extend({

        initialize:function(){

        },
        fetchInfo:function(tagName){

            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';

            var tagUrl = 'http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=' + tagName +'&api_key='+ API_KEY +'&format=json';
            $.ajax({
                type:'GET',
                url:tagUrl,
                dataType:'jsonp',
                success:function(data){

                    if(data.tag){
                        var tagObj = {};
                        tagObj.name = data.tag.name;
                        tagObj.title = data.tag.name;
                        tagObj.thumbnail = '';
                        tagObj.link = '';

                        tagObj.reach = data.tag.reach;
                        tagObj.taggings = data.tag.taggings;
                        tagObj.streamable = data.tag.streamable;
                        tagObj.summary = data.tag.wiki && data.tag.wiki.summary || '';
                        tagObj.content = data.tag.wiki && data.tag.wiki.content || '';

                        self.set(tagObj);
                        self.trigger('fetchInfoComplete');
                    }
                },
                error:function(error){
                    console.log('error fetching tag info from lastFM');
                    //self.trigger('fetchInfoError');
                }
            });

        },
        fetchChartingArtists:function(tagName){
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';

            var tagUrl = 'http://ws.audioscrobbler.com/2.0/?method=tag.getweeklyartistchart&tag=' + tagName +'&api_key='+ API_KEY +'&format=json';
            $.ajax({
                type:'GET',
                url:tagUrl,
                dataType:'jsonp',
                success:function(data){
                    if(data.weeklyartistchart && data.weeklyartistchart.artist){
                        self.set({artists:data.weeklyartistchart.artist});
                        self.trigger('fetchTopArtistComplete');
                    }
                },
                error:function(error){
                    console.log('error fetching tag top artists from lastFM');
                }
            });
        },
        fetchTopTracks:function(tagName){
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';

            var tagUrl = 'http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=' + tagName +'&api_key='+ API_KEY +'&format=json';
            $.ajax({
                type:'GET',
                url:tagUrl,
                dataType:'jsonp',
                success:function(data){
                    if(data.toptracks && data.toptracks.track){
                        self.set({tracks:data.toptracks.track});
                        self.trigger('fetchTopTracksComplete');
                    }
                },
                error:function(error){
                    console.log('error fetching tag top artists from lastFM');
                }
            });
        },
        fetchSimilarTags:function(tagName){
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';

            var tagUrl = 'http://ws.audioscrobbler.com/2.0/?method=tag.getSimilar&tag=' + tagName +'&api_key='+ API_KEY +'&format=json';
            $.ajax({
                type:'GET',
                url:tagUrl,
                dataType:'jsonp',
                success:function(data){
                    if(data.similartags && data.similartags.tag){
                        self.set({tags:data.similartags.tag});
                        self.trigger('fetchSimilarTagsComplete');
                    }
                },
                error:function(error){
                    console.log('error fetching tag top artists from lastFM');
                }
            });
        }
    });
});