
define(['jquery','underscore','backbone','main/models/albumModel'],function($,_,Backbone,AlbumModel){

    return Backbone.Collection.extend({
        model:AlbumModel,
        url:'http://ws.audioscrobbler.com/2.0/',
        initialize:function(){

        },
        fetchSearch:function(query,limit){

            //TODO - when fetching album info
            //Albums with no MBID use apparently deprecated playlist.fetch
            //http://web.archive.org/web/20101124000129/http://www.last.fm/api/show?service=271
            //http://ws.audioscrobbler.com/2.0/?method=playlist.fetch&playlistURL=lastfm://playlist/album/245524393&api_key=50255a0265dc1cc8d8b325c940f4ecd0&format=json

            limit = limit || 10;
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album='+ query +'&api_key='+ API_KEY +'&limit='+ limit +'&format=json';

            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){

                    var resultsArr = data.results.albummatches.album;
                    var albumArr = [];
                    _.each(resultsArr,function(rawObj,index){

                        var albumData={};
                        albumData.name = rawObj.name || '';
                        albumData.artist = rawObj.artist;
                        albumData.mbid = rawObj.mbid;

                        albumData.title = albumData.artist + ' - ' + albumData.name;
                        albumData.thumbnail = rawObj.image[3]["#text"];      //TODO - test null values with query: 'kiss land'
                        albumArr.push(albumData);
                    });

                    if(albumArr.length){
                        self.reset(albumArr);
                    }else{
                        self.reset();
                    }

                },
                error:function(error){
                    console.log('error fetching albums from lastFM');
                }
            });
        }
    });

});