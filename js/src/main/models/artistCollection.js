
define(['jquery','underscore','backbone','main/models/artistModel'],function($,_,Backbone,ArtistModel){

    return Backbone.Collection.extend({
        model:ArtistModel,
        initialize:function(){

        },
        fetchSearch:function(query,limit){
            limit = limit || 5;
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+ query +'&api_key='+ API_KEY +'&limit='+ limit +'&format=json';

            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){
                    var resultsArr = data.results.artistmatches.artist;
                    var artistArr = [];

                    _.each(resultsArr,function(rawObj,index){
                        var artistObj = {};
                        artistObj.name = rawObj.name;
                        artistObj.title = artistObj.name;
                        artistObj.mbid = rawObj.mbid;
                        artistObj.link = "#artist/" + artistObj.name;
                        if(artistObj.mbid){artistObj.link += "/" + artistObj.mbid}
                        artistObj.thumbnail = rawObj.image[3]["#text"];
                        artistObj.image = rawObj.image;
                        artistArr.push(artistObj);
                    });

                    if(artistArr.length){
                        self.reset(artistArr);
                    }else{
                        self.reset();
                    }
                },
                error:function(error){
                    console.log('error fetching artists from lastFM');
                }
            });
        }
    });
});