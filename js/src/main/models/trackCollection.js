
define(['jquery','underscore','backbone','main/models/trackModel'],function($,_,Backbone,TrackModel){

    return Backbone.Collection.extend({
        model:TrackModel,
        initialize:function(){
        },
        fetchSearch:function(query,limit){
            limit = limit || 10;
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track='+ query +'&api_key='+ API_KEY +'&limit='+ limit +'&format=json';

            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){

                    var resultsArr = data.results.trackmatches.track;
                    var trackArr = [];
                    _.each(resultsArr,function(rawObj){
                        var trackObj={
                            name:rawObj.name,
                            artist:{name:rawObj.artist}
                        };
                        trackArr.push(trackObj);
                    });
                    trackArr.length ? self.reset(trackArr) : self.reset();
                },
                error:function(error){
                    console.log('error fetching tracks from lastFM');
                }
            });
        }
    });
});