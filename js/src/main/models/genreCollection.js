
define(['jquery','underscore','backbone','main/models/genreModel'],function($,_,Backbone,GenreModel){

    return Backbone.Collection.extend({
        model:GenreModel,
        initialize:function(){

        },
        lastFMAPI:'http://ws.audioscrobbler.com/2.0/',
        fetchSearch:function(query,limit){
            limit = limit || 10;
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = this.lastFMAPI + '?method=tag.search&tag='+ query +'&api_key='+ API_KEY +'&limit='+ limit +'&format=json';

            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){
                    var resultsArr = data.results.tagmatches.tag;
                    var genreArr = [];

                    _.each(resultsArr,function(rawObj,index){
                        var genreObj={};
                        genreObj.name = rawObj.name;
                        genreObj.title = genreObj.name;
                        genreArr.push(genreObj);
                    });

                    if(genreArr.length){
                        self.reset(genreArr);
                    }else{
                        self.reset();
                    }
                },
                error:function(error){
                    console.log('error fetching genres from lastFM');
                }
            });
        }
    });
});